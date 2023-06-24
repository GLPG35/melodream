import { Router } from 'express'
import UserManager from '../../dao/db/userManager'

const router = Router()

const users = new UserManager()

router.post('/', (req, res, next) => {
	const { email } = req.body

	return users.upgradeUser(email)
	.then(() => {
		return res.send({ success: true, message: 'User upgraded successfully' })
	}).catch(err => {
		return next(err)
	})
})

export default router