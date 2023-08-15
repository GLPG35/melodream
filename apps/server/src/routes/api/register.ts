import { Router } from 'express'
import { checkToken } from '../../middlewares'
import { verifyToken } from '../../utils'
import passport from 'passport'

const router = Router()


router.post('/', checkToken, (req, res) => {
	const { body } = req
	let admin = false

	if (req.token && !verifyToken(req.token)) {
		return res.status(403).send({ success: false, message: 'User authorization failed' })
	} else {
		admin = true
	}

	if (body.userType && !req.token) {
		delete body.userType
	}

	if (admin) {
		return passport.authenticate('register', (err: Error, _user: any) => {
			if (err) return res.status(400).send({ success: false, message: err.message })

			return res.send({ success: true, message: 'User created successfully' })
		})(req, res)
	}

	return passport.authenticate('register', (err: Error, user: any) => {
		if (err) return res.status(400).send({ success: false, message: err.message })

		const { token, ...parseUser } = user

		return res.cookie('jwtToken', token, { httpOnly: true, maxAge: 48 * 60 * 60 * 1000 }).send({ success: true, message: parseUser })
	})(req, res)
})

export default router