import express from 'express'
import CartManager from '../../../dao/db/cartManager'

const router = express.Router({ mergeParams: true })

const carts = new CartManager()

router.post('/:pid', (req, res) => {	
	const { cid, pid } = req.params as { cid: string, pid: string }

	carts.addProduct(cid, pid)
	.then(() => {
		return res.send({ success: true, message: 'Product added successfully' })
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

export default router