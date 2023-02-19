import express from 'express'
import ProductManager from '../productManager'

const router = express.Router()

const actualDir = __dirname.split('/').pop()
const products = new ProductManager(actualDir !== 'dist' ? `${__dirname}/../public/products.json` : `${__dirname}/public/products.json`)

router.get('/', (req, res) => {
	const { limit } = req.query

	products.getProducts(limit ? +limit : undefined)
	.then(product => {
		return res.send(product)
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})

})

router.get('/:pid', (req, res) => {
	const { pid } = req.params

	products.getProductById(+pid)
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

router.post('/', (req, res) => {
	const { body } = req

	products.addProduct(body)
	.then(() => {
		return res.send({ success: true, message: 'Product added successfully' })
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

router.put('/:pid', (req, res) => {
	const { body, params: { pid } } = req

	products.updateProduct(+pid, body)
	.then(() => {
		return res.send({ success: true, message: 'Product updated successfully' })
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

router.delete('/:pid', (req, res) => {
	const { pid } = req.params

	products.deleteProduct(+pid)
	.then(() => {
		return res.send({ success: true, message: 'Product deleted successfully' })
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

export default router