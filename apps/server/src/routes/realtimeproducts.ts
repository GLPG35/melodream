import { Router } from 'express'
import { Server } from 'socket.io'
import ProductManager from '../productManager'

const router = Router()

const actualDir = __dirname.split('/').pop()
const products = new ProductManager(actualDir !== 'dist' ? `${__dirname}/../public/products.json` : `${__dirname}/public/products.json`)

router.get('/', async (req, res) => {
	const productsData = await products.getProducts()
	const io: Server = req.app.get('socketio')

	const body = {
		title: 'Real Time Products',
		productsData: productsData.reverse()
	}
	
	res.render('realtime', body)

	io.on('connection', socket => {
		console.log('Cliente conectado')

		socket.on('add product', product => {
			products.addProduct(product)
			.then(() => {
				products.getProducts()
				.then(resProducts => {
					socket.emit('product added', resProducts.reverse())
				})
			}).catch(err => {
				socket.emit('product error', err.message)
			})
		})
	})
})

export default router