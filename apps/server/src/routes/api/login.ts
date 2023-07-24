import { Router } from 'express'
import passport from 'passport'
import MailManager from '../../dao/db/mailManager'
import UserManager from '../../dao/db/userManager'
import { checkToken } from '../../middlewares'
import { parseSessionUser, verifyToken } from '../../utils'

const router = Router()

const mails = new MailManager()
const users = new UserManager()

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { refresh } = req.query
	
	if (req.user) {
		if (refresh) {
			return users.getUser(req.user.email)
			.then(user => {
				const { token, ...parseUser } = parseSessionUser(user)

				return res.cookie('jwtToken', token, { httpOnly: true, maxAge: 48 * 60 * 60 * 1000 }).send({ success: true, message: parseUser })				
			})
		}

		return res.send({ success: true, message: req.user })
	}

	return res.status(401).send({ success: false, message: 'User not logged in' })
})

router.post('/', (req, res) => {
	passport.authenticate('local-login', (err: Error, user: any) => {
		if (!user) return res.status(401).send({ success: false, message: 'Wrong username or password' })
		if (err) return res.status(500).send({ success: false, message: err.message })

		const { token, ...parseUser } = user
	
		return res.cookie('jwtToken', token, { httpOnly: true, maxAge: 48 * 60 * 60 * 1000 }).send({ success: true, message: parseUser })
	})(req, res)
})

router.post('/exit', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ success: false, message: 'No user provided' })

	return users.updateLastConnection(verifyToken(req.token).email)
	.then(() => res.send({ success: true, message: 'Last connection updated' }))
	.catch(next)
})

router.post('/recover', (req, res, next) => {
	const { email } = req.body

	return mails.resetPassword(email)
	.then(() => res.send({ success: true, message: 'Mail sent successfully' }))
	.catch(next)
})

router.get('/reset/:token', (req, res, next) => {
	const { token } = req.params

	return mails.checkToken(token, false)
	.then(() => res.send({ success: true, message: 'Valid token' }))
	.catch(next)
})

router.post('/reset/:token', (req, res, next) => {
	const { token } = req.params
	const { password } = req.body

	return mails.checkToken(token, true)
	.then(email => {
		return users.resetPassword(email, password)
		.then(() => res.send({ success: true, message: 'Password reset successfully' }))
	}).catch(next)
})

router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }))

router.get('/github/check', (req, res) => {
	passport.authenticate('github', (err: Error) => {
		if (err) return res.redirect(`https://melodream.vercel.app/login?error=${err.message}`)

		return res.redirect('https://melodream.vercel.app/')
	})(req, res)
})

router.get('/spotify', passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'] }))

router.get('/spotify/check', (req, res) => {
	passport.authenticate('spotify', (err: Error) => {
		if (err) return res.redirect(`https://melodream.vercel.app/login?error=${err.message}`)

		return res.redirect('https://melodream.vercel.app/')
	})(req, res)
})

export default router