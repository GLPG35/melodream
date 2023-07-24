import { Router } from 'express'
import UserManager from '../../dao/db/userManager'

const router = Router()
const users = new UserManager()

router.get('/docs', (_req, res) => {
	return users.getUsersDocs()
	.then(data => {
		return res.send(data)
	})
})

export default router