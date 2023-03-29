import express from 'express'
import product from './product'
import CartManager from '../../../dao/db/cartManager'

const router = express.Router()

const carts = new CartManager()

router.post('/', (_req, res) => {
	carts.addCart()
	.then(cart => {
		return res.send({ success: true, message: cart.id })
	}).catch(err => {
		return res.status(500).send({ success: false, message: err.message })
	})
})

router.get('/:cid', (req, res) => {
	const { cid } = req.params
	const { count } = req.query

	carts.getCart(cid, count)
	.then(products => {
		return res.send(products)
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

router.delete('/:cid', (req, res) => {
	const { cid } = req.params

	carts.deleteCart(cid)
	.then(() => {
		return res.send({ success: true, message: 'Cart deleted successfully' })
	}).catch(err => {
		return res.status(404).send({ success: false, message: err.message })
	})
})

router.use('/:cid/product', (_req, _res, next) => {
	next()
}, product)

export default router