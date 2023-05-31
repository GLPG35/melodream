import express from 'express'
import product from './product'
import CartManager from '../../../dao/db/cartManager'

const router = express.Router()

const carts = new CartManager()

router.post('/', (_req, res, next) => {
	carts.addCart()
	.then(cart => {
		return res.send({ success: true, message: cart.id })
	}).catch(err => {
		return next(err)
	})
})

router.get('/:cid', (req, res, next) => {
	const { cid } = req.params
	const { count } = req.query

	carts.getCart(cid, count)
	.then(products => {
		return res.send(products)
	}).catch(err => {
		return next(err)
	})
})

router.get('/:cid/total', (req, res, next) => {
	const { cid } = req.params

	carts.getTotalAmount(cid)
	.then(total => {
		return res.send({ success: true, message: total })
	}).catch(err => {
		return next(err)
	})
})

router.delete('/:cid', (req, res, next) => {
	const { cid } = req.params

	carts.deleteCart(cid)
	.then(() => {
		return res.send({ success: true, message: 'Cart deleted successfully' })
	}).catch(err => {
		return next(err)
	})
})

router.use('/:cid/product', (_req, _res, next) => {
	next()
}, product)

export default router