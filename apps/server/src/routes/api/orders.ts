import { Router } from 'express'
import OrderManager from '../../dao/db/orderManager'
import { oneTimeToken, verifyToken } from '../../utils'
import { checkOrderToken } from '../../middlewares'

const router = Router()

const orders = new OrderManager()

router.get('/user/:email', (req, res, next) => {
	const { email } = req.params
	
	return orders.getOrders(email)
	.then(orders => {
		return res.send(orders)
	}).catch(err => {
		return next(err)
	})
})

router.get('/token', checkOrderToken, (req, res) => {
	if (!(req.token && verifyToken(req.token))) {
		return res.status(400).send({ success: false, message: 'Invalid token' })
	}
	
	return res.send({ success: true, message: 'Valid token' })
})

router.get('/user/:email/:oid', (req, res, next) => {
	const { email, oid } = req.params

	return orders.getOrder(email, oid)
	.then(order => {
		return res.send(order)
	}).catch(err => {
		return next(err)
	})
})

router.post('/', (req, res, next) => {
	const { cid, email, userInfo } = req.body
	
	return orders.addOrder(cid, email, userInfo)
	.then(order => {
		const id = order.id
		const token = oneTimeToken(id)

		return res.cookie('orderToken', token, { httpOnly: true, maxAge: 15 * 1000 }).send({ success: true, message: 'Order created successfully' })
	}).catch(err => {
		return next(err)
	})
})

export default router