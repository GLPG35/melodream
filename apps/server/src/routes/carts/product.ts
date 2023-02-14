import express from 'express'
import CartManager from '../../cartManager'

const router = express.Router({ mergeParams: true })

const actualDir = __dirname.split('/').pop()
const carts = new CartManager(actualDir !== 'dist' ? `${__dirname}/../../public/carts.json` : `${__dirname}/carts.json`)

router.post('/:pid', (req, res) => {	
	const { cid, pid } = req.params as { cid: string, pid: string }

	carts.addProduct(+cid, +pid)
	.then(() => {
		return res.send({ success: true, message: 'Product added successfully' })
	}).catch(err => {
		return res.status(400).send({ success: false, message: err.message })
	})
})

export default router