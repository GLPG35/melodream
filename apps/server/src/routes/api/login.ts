import { Router } from 'express'
import UserManager from '../../dao/db/userManager'

const router = Router()

const users = new UserManager()

router.get('/', (req, res) => {
	if (req.session.user) return res.send({ success: true, message: req.session.user })

	return res.status(401).send({ success: false, message: 'User not logged in' })
})

router.post('/', (req, res) => {
	const { email, password } = req.body

	if (req.session.user) return res.send({ success: true, message: req.session.user })

	return users.authUser(email, password)
	.then(user => {
		req.session.user = user

		return res.send({ success: true, message: req.session.user })
	}).catch(err => {
		return res.status(401).send({ success: false, message: err.message })
	})
})

export default router