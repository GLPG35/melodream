import { Router } from 'express'
import path from 'path'
import ProductManager from '../productManager'

const router = Router()

const products = new ProductManager(path.join(__dirname, '../assets/products.json'))

router.get('/', (req, res) => {
	const { limit } = req.query

	products.getProducts(limit ? +limit : undefined)
	.then(product => {
		res.send(product)
	}).catch(err => {
		res.status(400).send({ error: err.message })
	})

})

router.get('/:pid', (req, res) => {
	const { pid } = req.params

	products.getProductById(+pid)
	.then(product => {
		res.send(product)
	}).catch(err => {
		res.status(404).send({ error: err.message })
	})
})

export default router