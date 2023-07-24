import express from 'express'
import product from './product'
import CartManager from '../../../dao/db/cartManager'

const router = express.Router()

const carts = new CartManager()

router.post('/', (_req, res, next) => {
	carts.addCart()
	.then(cart => res.send({ success: true, message: cart.id }))
	.catch(next)
})

router.get('/:cid', (req, res, next) => {
	const { cid } = req.params
	const { count } = req.query

	carts.getCart(cid, count)
	.then(products => res.send(products))
	.catch(next)
})

router.get('/:cid/total', (req, res, next) => {
	const { cid } = req.params

	carts.getTotalAmount(cid)
	.then(total => res.send({ success: true, message: total }))
	.catch(next)
})

router.delete('/:cid', (req, res, next) => {
	const { cid } = req.params

	carts.deleteCart(cid)
	.then(() => res.send({ success: true, message: 'Cart deleted successfully' }))
	.catch(next)
})

router.use('/:cid/product', (_req, _res, next) => {
	next()
}, product)

export default router