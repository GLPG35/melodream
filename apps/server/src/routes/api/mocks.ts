import { Router } from 'express'
import { generateProducts, generateUsers } from '../../utils'

const router = Router()

router.all('*', (_req, res, next) => {
	if (process.env.PORT) return res.status(404).end()

	return next()
})

router.get('/users/:quantity', (req, res, next) => {
	const { quantity } = req.params
	
	try {
		const users = generateUsers(+quantity)

		return res.send(users)
	} catch(err) {
		return next(err)
	}
})

router.get('/products/:quantity', (req, res, next) => {
	const { quantity } = req.params

	try {
		const products = generateProducts(+quantity)

		return res.send(products)
	} catch(err) {
		return next(err)
	}
})

export default router