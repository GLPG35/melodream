import express from 'express'
import CartManager from '../../../dao/db/cartManager'
import { checkToken } from '../../../middlewares'
import { verifyToken } from '../../../utils'

const router = express.Router({ mergeParams: true })

const carts = new CartManager()

router.post('/:pid', checkToken, (req, res, next) => {
	const { cid, pid } = req.params as { cid: string, pid: string }
	const { quantity } = req.body
	let email

	if (req.token) {
		email = verifyToken(req.token) || undefined
	}

	return carts.addProduct(cid, pid, quantity, email)
	.then(doc => {
		return res.send({ success: true, message: doc })
	}).catch(err => {
		return next(err)
	})
})

router.get('/check/:pid', (req, res, next) => {
	const { cid, pid } = req.params as { cid: string, pid: string }

	return carts.checkProduct(cid, pid)
	.then(check => {
		return res.send({ success: true, message: check })
	}).catch(err => {
		return next(err)
	})
})

router.delete('/:pid', (req, res, next) => {
	const { cid, pid } = req.params as { cid: string, pid: string }

	return carts.deleteProduct(cid, pid)
	.then(() => {
		return res.send({ success: true, message: 'Product deleted successfully' })
	}).catch(err => {
		return next(err)
	})
})

export default router