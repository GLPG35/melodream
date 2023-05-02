import { Router } from 'express'

const router = Router()

router.post('/', (_req, res) => {
	return res.clearCookie('jwtToken').send({ success: true, message: 'Logged out successfully' })
})

export default router