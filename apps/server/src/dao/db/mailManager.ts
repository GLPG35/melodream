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
					<p style="margin: 0;">Hello ${user.name},</p>
					<p style="margin: 0;">We've received a request to reset your password for the Melodream account associated with ${email}.</p>
					<br />
					<p style="margin: 0;">You can reset your password clicking on the link provided below:</p>
					<p style="margin: 0;"><a href="${process.env.BASE_URL_CLIENT}/login/reset?token=${token}" class="button">Reset Password</a></p>
					<br />
					<p style="margin: 0;">This link will expire after 15 minutes. If your link has expired you can request another reset using this link:</p>
					<p style="margin: 0;"><a href="${process.env.BASE_URL_CLIENT}/login/recover">${process.env.BASE_URL_CLIENT}/login/recover</a></p>
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
			<p style="margin: 0;">Hello ${user.name},</p>
			<p style="margin: 0;">We've deleted one of your products because it didn't pass our quality standards.</p>
			<p style="margin: 0;">If you think this is a mistake, please answer this email and we'll review it right away.</p>
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
						<p style="margin: 0;">Hello ${user.name},</p>
						<p style="margin: 0;">We've recently deleted your account because it was not respecting the site policies.</p>
						<p style="margin: 0;">If you have any problem with our decision, please answer this email and we'll talk it so we can achieve an agreement.</p>
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
						<p style="margin: 0;">Hello ${user.name},</p>
						<p style="margin: 0;">We've recently deleted your account because it was inactive for more than 30 days.</p>
						<p style="margin: 0;">If you want you can create a new account clicking on this link: <a href="${process.env.BASE_URL_CLIENT}/login">${process.env.BASE_URL_CLIENT}/login</a></p>.</p>
					`

					this.sendMail(email, subject, content)

					return res(true)
				})
			})
		)
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