import Cart from './models/Cart'
import ProductManager from './productManager'

class CartManager {
	addCart = () => {
		return Cart.create({ products: [] })
	}

	getCart = (id: string) => {
		return Cart.findById(id).exec()
	}

	addProduct = async (cid: string, pid: string) => {
		const products = new ProductManager()

		await products.getProductById(pid)
		.catch(err => {
			throw new Error(err.message)
		})

		this.getCartById(cid)
		.then(doc => {
			if (!doc) throw new Error('Cart not found')

			const findProduct = doc.products.find(x => x.pid == pid)

			if (findProduct) {
				const mapCart = doc.products.map(x => x.pid == pid ? { ...x, quantity: x.quantity + 1 } : x)
				doc.products = mapCart

				doc.save()
			} else {
				doc.products.push({ pid, quantity: 1 })

				doc.save()
			}

			return true
		}).catch(err => {
			throw new Error(err.message)
		})
	}

	getCartById = (cid: string) => {
		return Cart.findById(cid).exec()
	}
}

export default CartManager