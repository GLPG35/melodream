import express from 'express'
import product from './product'
import CartManager from '../../cartManager'

const router = express.Router()

const actualDir = __dirname.split('/').pop()
const carts = new CartManager(actualDir !== 'dist' ? `${__dirname}/../../public/carts.json` : `${__dirname}/carts.json`)

router.post('/', (_req, res) => {
	carts.addCart()
	.then(() => {
		return res.send({ success: true, message: 'Cart added successfully' })
	}).catch(err => {
		return res.status(500).send({ success: false, message: err.message })
	})
})

router.get('/:cid', (req, res) => {
	const { cid } = req.params

	carts.getCart(+cid)
	.then(products => {
		return res.send(products)
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

router.use('/:cid/product', (_req, _res, next) => {
	next()
}, product)

export default router