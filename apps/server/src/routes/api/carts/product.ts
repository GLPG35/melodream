import express from 'express'
import CartManager from '../../../dao/db/cartManager'

const router = express.Router({ mergeParams: true })

const carts = new CartManager()

router.post('/:pid', (req, res, next) => {	
	const { cid, pid } = req.params as { cid: string, pid: string }
	const { quantity } = req.body

	carts.addProduct(cid, pid, quantity)
	.then(doc => {
		return res.send({ success: true, message: doc })
	}).catch(err => {
		return next(err)
	})
})

router.delete('/:pid', (req, res, next) => {
	const { cid, pid } = req.params as { cid: string, pid: string }

	carts.deleteProduct(cid, pid)
	.then(() => {
		return res.send({ success: true, message: 'Product deleted successfully' })
	}).catch(err => {
		return next(err)
	})
})

export default router