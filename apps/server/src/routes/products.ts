import express from 'express'
import ProductManager from '../productManager'
import { dbConnect, dbDisconnect } from '../db'
import Product from '../db/Product'

const router = express.Router()

const actualDir = __dirname.split('/').pop()
const products = new ProductManager(actualDir !== 'dist' ? `${__dirname}/../public/products.json` : `${__dirname}/public/products.json`)

router.get('/', async (req, res) => {
	const { limit } = req.query

	await dbConnect()
	
	if (limit) {
		return Product.find({}).limit(+limit)
		.then(products => {
			res.send(products)

			return dbDisconnect()
		}).catch(err => {
			res.status(400).send({ success: false, message: err.message })

			return dbDisconnect()
		})
	}

	return Product.find({})
	.then(products => {
		res.send(products)

		return dbDisconnect()
	}).catch(err => {
		res.status(400).send({ success: false, message: err.message })

		return dbDisconnect()
	})

	// products.getProducts(limit ? +limit : undefined)
	// .then(product => {
	// 	return res.send(product)
	// }).catch(err => {
	// 	return res.status(400).send({ success: false, message: err.message })
	// })
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