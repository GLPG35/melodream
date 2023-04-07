import { Router } from 'express'
import UserManager from '../../dao/db/userManager'

const router = Router()

const users = new UserManager()

router.post('/', (req, res) => {
	const { body } = req

	if (body.userType && !req.session.user) {
		delete body.userType
	}

	return users.addUser(body)
	.then(user => {
		req.session.user = user

		return res.send({ success: true, message: req.session.user })
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

export default router