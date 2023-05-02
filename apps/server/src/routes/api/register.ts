import { Router } from 'express'
import { checkToken } from '../../middlewares'
import { verifyToken } from '../../utils'
import passport from 'passport'

const router = Router()


router.post('/', checkToken, (req, res) => {
	const { body } = req

	if (req.token && !verifyToken(req.token)) {
		return res.status(403).send({ success: false, message: 'User authorization failed' })
	}

	if (body.userType && !req.token) {
		delete body.userType
	}

	return passport.authenticate('register', (err: Error, user: any) => {
		if (err) return res.status(400).send({ success: false, message: err.message })

		const { token, ...parseUser } = user

		return res.cookie('jwtToken', token).send({ success: true, message: parseUser })
	})(req, res)
})

export default router