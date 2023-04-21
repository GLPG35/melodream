import express from 'express'
import ProductManager from '../../dao/db/productManager'
import { checkToken } from '../../middlewares'
import { verifyToken } from '../../utils'

const router = express.Router()

const products = new ProductManager()

router.get('/', async (req, res) => {
	const { limit, page, sort, query } = req.query

	products.getProducts(limit ? +limit : undefined, page ? +page : undefined, sort, query)
	.then(data => {
		return res.send({ ...data })
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

router.get('/:pid', (req, res) => {
	const { pid } = req.params

	products.getProductById(pid)
	.then(product => {
		return res.send(product)
	}).catch(err => {
		return res.status(404).send({ success: false, message: err.message })
	})
})

router.get('/exists/:code', (req, res) => {
	const { code } = req.params

	products.getProductByCode(code)
	.then(product => {
		return res.send(product)
	}).catch(err => {
		return res.status(404).send({ success: false, message: err.message })
	})
})

router.post('/', checkToken, (req, res) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ success: false, message: 'User unauthorized' })
	
	const { body } = req

	return products.addProduct(body)
	.then(() => {
		return res.send({ success: true, message: 'Product added successfully' })
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

router.put('/:pid', checkToken, (req, res) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ succes: false, message: 'User unauthorized' })

	const { body, params: { pid } } = req

	return products.updateProduct(pid, body)
	.then(() => {
		return res.send({ success: true, message: 'Product updated successfully' })
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

router.delete('/:pid', checkToken, (req, res) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ succes: false, message: 'User unauthorized' })

	const { pid } = req.params

	return products.deleteProduct(pid)
	.then(() => {
		return res.send({ success: true, message: 'Product deleted successfully' })
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

export default router