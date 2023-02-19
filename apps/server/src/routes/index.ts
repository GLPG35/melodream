import { Router } from 'express'
import ProductManager from '../productManager'

const router = Router()

const actualDir = __dirname.split('/').pop()
const products = new ProductManager(actualDir !== 'dist' ? `${__dirname}/../public/products.json` : `${__dirname}/public/products.json`)

router.get('/', async (_req, res) => {
	const productsData = await products.getProducts()

	const body = {
		title: 'Products',
		productsData
	}

	res.render('home', body)
})

export default router