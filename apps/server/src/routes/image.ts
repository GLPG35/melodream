import express from 'express'

const router = express.Router()

router.post('/upload', (req, res) => {
	if (!req.file) return res.status(500).send({ success: false, message: 'File not uploaded' })

	if (req.file) {
		const path = `/static/images/${req.file.filename}`

		return res.send({ success: true, path })
	}

	return res.status(500).send({ success: false, message: 'File not uploaded' })
})

export default router