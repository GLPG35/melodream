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
	.then(doc => res.send({ success: true, message: doc }))
	.catch(next)
})

router.get('/check/:pid', (req, res, next) => {
	const { cid, pid } = req.params as { cid: string, pid: string }

	return carts.checkProduct(cid, pid)
	.then(check => res.send({ success: true, message: check }))
	.catch(next)
})

router.delete('/:pid', (req, res, next) => {
	const { cid, pid } = req.params as { cid: string, pid: string }

	return carts.deleteProduct(cid, pid)
	.then(() => res.send({ success: true, message: 'Product deleted successfully' }))
	.catch(next)
})

export default router