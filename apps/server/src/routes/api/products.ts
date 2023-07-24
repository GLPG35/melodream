import express from 'express'
import ProductManager from '../../dao/db/productManager'
import { checkToken } from '../../middlewares'
import { verifyToken } from '../../utils'

const router = express.Router()

const products = new ProductManager()

router.get('/', checkToken, async (req, res, next) => {
	const { limit, page, sort, query, getAll } = req.query

	let email

	if (req.token && !getAll) {
		const parseToken = verifyToken(req.token)

		if (parseToken) {
			email = parseToken.email
		}
	}

	return products.getProducts(limit ? +limit : undefined, page ? +page : undefined, sort, query, email)
	.then(data => res.send({ ...data }))
	.catch(next)
})

router.get('/:pid', (req, res, next) => {
	const { pid } = req.params

	products.getProductById(pid)
	.then(product => res.send(product))
	.catch(next)
})

router.get('/exists/:code', (req, res, next) => {
	const { code } = req.params

	return products.getProductByCode(code)
	.then(product => res.send(product))
	.catch(next)
})

router.post('/', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token) && verifyToken(req.token).userType !== 'user')) return res.status(403).send({ succes: false, message: 'User unauthorized' })

	const { body } = req
	body.owner = verifyToken(req.token).email

	return products.addProduct(body)
	.then(() => res.send({ success: true, message: 'Product added successfully' }))
	.catch(next)
})

router.put('/:pid', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token) && verifyToken(req.token).userType !== 'user')) return res.status(403).send({ succes: false, message: 'User unauthorized' })

	const { body, params: { pid } } = req
	body.email = verifyToken(req.token).email

	return products.updateProduct(pid, body)
	.then(() => res.send({ success: true, message: 'Product updated successfully' }))
	.catch(next)
})

router.delete('/:pid', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token) && verifyToken(req.token).userType !== 'user')) return res.status(403).send({ succes: false, message: 'User unauthorized' })

	const { params: { pid } } = req
	const owner = verifyToken(req.token).email

	return products.deleteProduct(pid, { owner })
	.then(() => res.send({ success: true, message: 'Product deleted successfully' }))
	.catch(next)
})

router.post('/search', (req, res, next) => {
	const { text } = req.body

	return products.searchProduct(text)
	.then(products => res.send(products))
	.catch(next)
})

export default router