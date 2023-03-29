import { Router } from 'express'
import ProductManager from '../dao/db/productManager'

const router = Router()

const products = new ProductManager()

router.get('/', async (_req, res) => {
	const productsData = await products.getProducts()

	const body = {
		title: 'Products',
		productsData: productsData.docs
	}

	res.render('home', body)
})

export default router