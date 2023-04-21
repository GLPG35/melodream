import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get('/', (req, res) => {
	if (req.user) return res.send({ success: true, message: req.user })

	return res.status(401).send({ success: false, message: 'User not logged in' })
})

router.post('/', (req, res) => {
	passport.authenticate('local-login', (err: Error, user: any) => {
		if (!user) return res.status(401).send({ success: false, message: 'Wrong username or password' })
		if (err) return res.status(500).send({ success: false, message: err.message })
	
		return res.send({ success: true, message: user })
	})(req, res)
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