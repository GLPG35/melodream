import express from 'express'
import ProductManager from '../../dao/db/productManager'
import { checkToken } from '../../middlewares'
import { verifyToken } from '../../utils'

const router = express.Router()

const products = new ProductManager()

router.get('/', async (req, res, next) => {
	const { limit, page, sort, query } = req.query

	return products.getProducts(limit ? +limit : undefined, page ? +page : undefined, sort, query)
	.then(data => {
		return res.send({ ...data })
	}).catch(err => {
		return next(err)
	})
})

router.get('/:pid', (req, res, next) => {
	const { pid } = req.params

	products.getProductById(pid)
	.then(product => {
		return res.send(product)
	}).catch(err => {
		return next(err)
	})
})

router.get('/exists/:code', (req, res, next) => {
	const { code } = req.params

	products.getProductByCode(code)
	.then(product => {
		return res.send(product)
	}).catch(err => {
		return next(err)
	})
})

router.post('/', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ success: false, message: 'User unauthorized' })
	
	const { body } = req

	return products.addProduct(body)
	.then(() => {
		return res.send({ success: true, message: 'Product added successfully' })
	}).catch(err => {
		return next(err)
	})
})

router.put('/:pid', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ succes: false, message: 'User unauthorized' })

	const { body, params: { pid } } = req

	return products.updateProduct(pid, body)
	.then(() => {
		return res.send({ success: true, message: 'Product updated successfully' })
	}).catch(err => {
		return next(err)
	})
})

router.delete('/:pid', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ succes: false, message: 'User unauthorized' })

	const { pid } = req.params

	return products.deleteProduct(pid)
	.then(() => {
		return res.send({ success: true, message: 'Product deleted successfully' })
	}).catch(err => {
		return next(err)
	})
})

router.post('/search', (req, res, next) => {
	const { text } = req.body

	return products.searchProduct(text)
	.then(products => {
		return res.send(products)
	}).catch(err => {
		return next(err)
	})
})

export default router