import { Router } from 'express'

const router = Router()

router.post('/', (req, res) => {
	return req.session.destroy(err => {
		if (err) res.send({ success: false, message: err.message })

		return res.send({ success: true, message: 'Logged out successfully' })
	})
})

export default router