import { Router } from 'express'
import UserManager from '../../dao/db/userManager'
import { checkToken } from '../../middlewares'
import { verifyToken } from '../../utils'

const router = Router()
const users = new UserManager()

router.post('/', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ success: false, message: 'You must be logged in to perform this action' })

	const { path } = req.body
	const { email } = verifyToken(req.token)

	return users.updatePfp(email, path)
	.then(() => res.send({ success: true, message: 'Profile picture updated successfully' }))
	.catch(next)
})

export default router