import Cart from './models/Cart'
import ProductManager from './productManager'
import { Types } from 'mongoose'

class CartManager {
	addCart = () => {
		return Cart.create({ products: [] })
	}

	getCart = async (id: string, count?: any) => {
		if (count) {
			const cart = await Cart.findById(id)
			
			if (cart) {
				const countProducts = cart.products.reduce((prev, curr) => (
					prev + curr.quantity
				), 0)

				return {
					count: countProducts
				}
			}

			throw new Error('Cart not found')
		}

		return Cart.findOne({ _id: id }).populate('products.product')
		.then(doc => {
			if (!doc) throw new Error('Cart not found')

			return doc
		})
	}

	deleteCart = (cid: string) => {
		return Cart.findByIdAndUpdate(cid, { products: [] }, { new: true })
		.catch(err => { throw new Error(err.message) })
	}

	addProduct = async (cid: string, pid: string, quantity?: any) => {
		const products = new ProductManager()

		await products.getProductById(pid)
		.catch(err => {
			throw new Error(err.message)
		})

		return Cart.findById(cid)
		.then(data => {
			if (!data) throw new Error('Cart not found')

			return Cart.findOne({ _id: cid, 'products.product': pid })
			.then(async doc => {
				if (!doc) {
					const newProducts = [...data.products, { product: pid, quantity: 1 }]

					return Cart.findByIdAndUpdate(cid, { products: newProducts }, { new: true })
					.then(cart => {
						if (cart) {
							const countProducts = cart.products.reduce((prev, curr) => (
								prev + curr.quantity
							), 0)
			
							return {
								...cart,
								count: countProducts
							}
						}

						throw new Error('Cart not found')
					}).catch(err => { throw new Error(err.message) })
				} else {
					const pQuantity = isNaN(+quantity) ? 1 : +quantity

					return Cart.findOneAndUpdate(
						{ _id: cid },
						{ $inc: { 'products.$[p].quantity': pQuantity } },
						{ arrayFilters: [{ 'p.product': new Types.ObjectId(pid) }], new: true }
					).then(cart => {
						if (cart) {
							const countProducts = cart.products.reduce((prev, curr) => (
								prev + curr.quantity
							), 0)

							return {
								...cart,
								count: countProducts
							}
						}

						throw new Error('Cart not found')
					}).catch(err => { throw new Error(err.message) })
				}
			}).catch(err => {
				throw new Error(err.message)
			})
		}).catch(err => {
			throw new Error(err.message)
		})
	}

	deleteProduct = (cid: string, pid: string) => {
		return Cart.updateOne(
			{ _id: cid },
			{ $pull: { 'products': { 'product': pid } } },
			{ new: true }
		).catch(err => { throw new Error(err.message) })
	}
}

export default CartManager