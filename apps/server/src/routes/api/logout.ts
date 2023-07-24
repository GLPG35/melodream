import { Router } from 'express'
import { verifyToken } from '../../utils'
import UserManager from '../../dao/db/userManager'
import { checkToken } from '../../middlewares'

const router = Router()
const users = new UserManager()

router.post('/', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ success: false, message: 'No user provided' })

	return users.updateLastConnection(verifyToken(req.token).email)
	.then(() => res.clearCookie('jwtToken').send({ success: true, message: 'Logged out successfully' }))
	.catch(next)
})

export default router