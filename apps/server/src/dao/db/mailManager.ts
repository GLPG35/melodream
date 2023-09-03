import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import Token from './models/Token'
import jwt from 'jsonwebtoken'
import Mail from 'nodemailer/lib/mailer'
import { __root } from '../../paths'
import { CustomError, verifyToken } from '../../utils'
import dotenv from 'dotenv'
import UserManager from './userManager'

dotenv.config()

const { OAuth2 } = google.auth

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, SENDER_EMAIL_ADDRESS } = process.env

const oauth2Client = new OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OAUTH_PLAYGROUND)

oauth2Client.setCredentials({
	refresh_token: GOOGLE_REFRESH_TOKEN
})

class MailManager {
	sendMail = async (email: string, subject: string, html: string, attachments?: Mail.Attachment[]) => {
		const accessToken = await oauth2Client.getAccessToken()
	
		const transport = nodemailer.createTransport({
			service: 'gmail',
			port: 465,
			secure: true,
			auth: {
				type: 'OAuth2',
				user: SENDER_EMAIL_ADDRESS,
				clientId: GOOGLE_CLIENT_ID,
				clientSecret: GOOGLE_CLIENT_SECRET,
				refreshToken: GOOGLE_REFRESH_TOKEN,
				accessToken
			}
		} as SMTPTransport.Options)
	
		return transport.sendMail({
			from: `Melodream <${SENDER_EMAIL_ADDRESS}>`,
			to: email,
			subject,
			html,
			attachments
		})
	}

	resetPassword = async (email: string) => {
		const users = new UserManager()
		const user = await users.getUser(email)

		if (!user) throw new CustomError('User not found', 404)

		return Token.findOne({ email })
		.then(async doc => {
			if (doc) {
				const verify = verifyToken(doc.token)

				if (verify) throw new CustomError('You already have a pending recovery email', 429)

				await Token.findOneAndDelete({ email }, { new: true })
			}

			const token = jwt.sign({token: `${Date.now()}${email}`}, process.env.SECRET as string, { expiresIn: '15m' })
		
			return Token.create({ token, email })
			.then(() => {
				const subject = 'Reset your Melodream password'
				const content = `
					<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
						<style>
							@font-face {
								font-family: Inter;
								font-style: normal;
								font-weight: 400;
								mso-font-alt: Verdana;
								src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')
							}

							* {
								font-family: Inter, Verdana
							}
						</style>
						<style>
							blockquote, h1, h2, h3, img, li, ol, p, ul {
								margin-top: 0;
								margin-bottom: 0
							}
						</style>
					</head>
					<body>
						<table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem">
						<tbody>
							<tr style="width:100%">
							<td>
								<img alt="" src="https://i.ibb.co/Zf6ns6g/melodream-icon.png" style="display: block;outline: none;border: none;text-decoration: none;margin-bottom: 32px;margin-top: 0px;height: 40px;">
								<h2 style="font-size: 30px;font-weight: 700;line-height: 40px;margin-bottom: 12px;color: rgb(17, 24, 39);text-align: left;">
								<strong>Hello ${user.name},</strong>
								</h2>
								<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">We've received a request to reset your password for the Melodream account associated <a href="${email}" target="_blank" style="font-weight: 500;color: rgb(17, 24, 39);text-decoration-line: underline;">${email}</a>.
								</p>
								<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">You can reset your password by clicking on the button provided below:</p>
								<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0px;margin-bottom:0px;text-align:left;">
								<tbody>
									<tr>
									<td>
										<a href="${process.env.BASE_URL_CLIENT}/login/reset?token=${token}" style="border: 2px solid;line-height: 1.25rem;text-decoration: none;display: inline-block;max-width: 100%;font-size: 0.875rem;font-weight: 500;text-decoration-line: none;color: #f0f0f0;background-color: #4f3499;border-color: #4f3499;padding: 12px 34px;border-radius: 9999px;">
										<span></span>
										<span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Reset Password</span>
										<span></span>
										</a>
									</td>
									</tr>
								</tbody>
								</table>
								<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="height: 64px;">
								<tbody>
									<tr>
									<td></td>
									</tr>
								</tbody>
								</table>
								<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">This link will expire after 15 minutes. If your link has expired you can request another reset using this link:</p>
								<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">
								<a href="${process.env.BASE_URL_CLIENT}/login/recover" target="_blank" style="font-weight: 500;color: rgb(17, 24, 39);text-decoration-line: underline;">${process.env.BASE_URL_CLIENT}/login/recover</a>
								</p>
							</td>
							</tr>
						</tbody>
						</table>
					</body>
					</html>
				`

				this.sendMail(email, subject, content)
			})
		})
	}

	deletedProduct = async (email: string) => {
		const users = new UserManager()
		const user = await users.getUser(email)

		if (!user) throw new CustomError('User not found', 404)

		const subject = 'Product deleted from Melodream'
		const content = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
				<style>
				@font-face {
					font-family: Inter;
					font-style: normal;
					font-weight: 400;
					mso-font-alt: Verdana;
					src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')
				}
			
				* {
					font-family: Inter, Verdana
				}
				</style>
				<style>
				blockquote,
				h1,
				h2,
				h3,
				img,
				li,
				ol,
				p,
				ul {
					margin-top: 0;
					margin-bottom: 0
				}
				</style>
			</head>
			<body>
				<table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem">
				<tbody>
					<tr style="width:100%">
					<td>
						<img alt="" src="https://i.ibb.co/Zf6ns6g/melodream-icon.png" style="display: block;outline: none;border: none;text-decoration: none;margin-bottom: 32px;margin-top: 0px;height: 40px;">
						<h2 style="font-size: 30px;font-weight: 700;line-height: 40px;margin-bottom: 12px;color: rgb(17, 24, 39);text-align: left;">
						<strong>Hello ${user.name},</strong>
						</h2>
						<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">We've deleted one of your products because it didn't pass our quality standards.</p>
						<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">If you think this is a mistake, please answer this email and we'll review it right away.</p>
					</td>
					</tr>
				</tbody>
				</table>
			</body>
			</html>
		`

		this.sendMail(email, subject, content)
	}

	deletedUsers = async (usersArray: string[]) => {
		const users = new UserManager()

		return Promise.allSettled(
			usersArray.map(async email => {
				return new Promise(async (res, rej) => {
					const user = await users.getUser(email)

					if (!user) return rej(new CustomError('User not found', 404))

					const subject = 'Your Melodream account was deleted'
					const content = `
						<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
							<style>
							@font-face {
								font-family: Inter;
								font-style: normal;
								font-weight: 400;
								mso-font-alt: Verdana;
								src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')
							}
						
							* {
								font-family: Inter, Verdana
							}
							</style>
							<style>
							blockquote,
							h1,
							h2,
							h3,
							img,
							li,
							ol,
							p,
							ul {
								margin-top: 0;
								margin-bottom: 0
							}
							</style>
						</head>
						<body>
							<table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem">
							<tbody>
								<tr style="width:100%">
								<td>
									<img alt="" src="https://i.ibb.co/Zf6ns6g/melodream-icon.png" style="display: block;outline: none;border: none;text-decoration: none;margin-bottom: 32px;margin-top: 0px;height: 40px;">
									<h2 style="font-size: 30px;font-weight: 700;line-height: 40px;margin-bottom: 12px;color: rgb(17, 24, 39);text-align: left;">
									<strong>Hello ${user.name},</strong>
									</h2>
									<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">We've recently deleted your account because it was not respecting the site policies.</p>
									<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">If you have a problem with our decision, please answer this email and we'll talk it so we can achieve an agreement.</p>
								</td>
								</tr>
							</tbody>
							</table>
						</body>
						</html>
					`

					this.sendMail(email, subject, content)

					return res(true)
				})
			})
		)
	}

	deletedInactiveUsers = async (usersArray: string[]) => {
		const users = new UserManager()

		return Promise.allSettled(
			usersArray.map(async email => {
				return new Promise(async (res, rej) => {
					const user = await users.getUser(email)

					if (!user) return rej(new CustomError('User not found', 404))

					const subject = 'Your Melodream account was deleted'
					const content = `
						<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
							<style>
							@font-face {
								font-family: Inter;
								font-style: normal;
								font-weight: 400;
								mso-font-alt: Verdana;
								src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')
							}

							* {
								font-family: Inter, Verdana
							}
							</style>
							<style>
							blockquote,
							h1,
							h2,
							h3,
							img,
							li,
							ol,
							p,
							ul {
								margin-top: 0;
								margin-bottom: 0
							}
							</style>
						</head>
						<body>
							<table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem">
							<tbody>
								<tr style="width:100%">
								<td>
									<img alt="" src="https://i.ibb.co/Zf6ns6g/melodream-icon.png" style="display: block;outline: none;border: none;text-decoration: none;margin-bottom: 32px;margin-top: 0px;height: 40px;">
									<h2 style="font-size: 30px;font-weight: 700;line-height: 40px;margin-bottom: 12px;color: rgb(17, 24, 39);text-align: left;">
									<strong>Hello ${user.name},</strong>
									</h2>
									<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">We've recently deleted your account because it was inactive for more than 30 days.</p>
									<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">If you want you can create a new account by clicking on the button right below:</p>
									<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0px;margin-bottom:0px;text-align:left;">
									<tbody>
										<tr>
										<td>
											<a href="${process.env.BASE_URL_CLIENT}/login" style="border: 2px solid;line-height: 1.25rem;text-decoration: none;display: inline-block;max-width: 100%;font-size: 0.875rem;font-weight: 500;text-decoration-line: none;color: #f0f0f0;background-color: #4f3499;border-color: #4f3499;padding: 12px 34px;border-radius: 9999px;">
											<span></span>
											<span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Create Account</span>
											<span></span>
											</a>
										</td>
										</tr>
									</tbody>
									</table>
									<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="height: 64px;">
									<tbody>
										<tr>
										<td></td>
										</tr>
									</tbody>
									</table>
									<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">If the button doesn't work you can also click on this link: <a href="${process.env.BASE_URL_CLIENT}/login" target="_blank" style="font-weight: 500;color: rgb(17, 24, 39);text-decoration-line: underline;">${process.env.BASE_URL_CLIENT}/login</a>
									</p>
								</td>
								</tr>
							</tbody>
							</table>
						</body>
						</html>
					`

					this.sendMail(email, subject, content)

					return res(true)
				})
			})
		)
	}

	successfulOrder = async (email: string, oid: string) => {
		const users = new UserManager()

		const user = await users.getUser(email)

		if (!user) throw new CustomError('User not found', 404)

		const subject = 'Your order on Melodream has been successful!'
		const content = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
				<style>
				@font-face {
					font-family: Inter;
					font-style: normal;
					font-weight: 400;
					mso-font-alt: Verdana;
					src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')
				}

				* {
					font-family: Inter, Verdana
				}
				</style>
				<style>
				blockquote,
				h1,
				h2,
				h3,
				img,
				li,
				ol,
				p,
				ul {
					margin-top: 0;
					margin-bottom: 0
				}
				</style>
			</head>
			<body>
				<table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem">
				<tbody>
					<tr style="width:100%">
					<td>
						<img alt="" src="https://i.ibb.co/Zf6ns6g/melodream-icon.png" style="display: block;outline: none;border: none;text-decoration: none;margin-bottom: 32px;margin-top: 0px;height: 40px;">
						<h2 style="font-size: 30px;font-weight: 700;line-height: 40px;margin-bottom: 12px;color: rgb(17, 24, 39);text-align: left;">
						<strong>Hello ${user.name},</strong>
						</h2>
						<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">We wanted to tell you that your order has been completed successfully.</p>
						<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">To view your order details please click on the button below:</p>
						<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0px;margin-bottom:0px;text-align:left;">
						<tbody>
							<tr>
							<td>
								<a href="${process.env.BASE_URL_CLIENT}/orders/${oid}" style="border: 2px solid;line-height: 1.25rem;text-decoration: none;display: inline-block;max-width: 100%;font-size: 0.875rem;font-weight: 500;text-decoration-line: none;color: #f0f0f0;background-color: #4f3499;border-color: #4f3499;padding: 12px 34px;border-radius: 9999px;">
								<span></span>
								<span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Order Details</span>
								<span></span>
								</a>
							</td>
							</tr>
						</tbody>
						</table>
						<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="height: 64px;">
						<tbody>
							<tr>
							<td></td>
							</tr>
						</tbody>
						</table>
						<p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">If the button doesn't work you can also click on this link: <a href="${process.env.BASE_URL_CLIENT}/orders/${oid}" target="_blank" style="font-weight: 500;color: rgb(17, 24, 39);text-decoration-line: underline;">${process.env.BASE_URL_CLIENT}/orders/${oid}</a>
						</p>
					</td>
					</tr>
				</tbody>
				</table>
			</body>
			</html>
		`

		this.sendMail(email, subject, content)
	}

	checkToken = (token: string, del: boolean) => {
		return Token.findOne({ token })
		.then(async doc => {
			if (!doc) throw new CustomError('Token not found', 404)

			const verify = verifyToken(doc.token)

			if (del || !verify) {
				await Token.findOneAndDelete({ token }, { new: true })
			}
			
			if (!verify) {
				throw new CustomError('Token not valid', 401)
			}
			
			return doc.email
		})
	}
}

export default MailManager