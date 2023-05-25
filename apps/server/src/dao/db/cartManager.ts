import { PopulatedCartProduct, Product } from '../../types'
import Cart, { PopulatedCartDocument } from './models/Cart'
import ProductManager from './productManager'
import { Types } from 'mongoose'

const products = new ProductManager()

class CartManager {
	addCart = () => {
		return Cart.create({ products: [] })
	}

	getCart = async (id: string, count?: any, populate = true) => {
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

		if (populate) {
			return Cart.findOne({ _id: id }).populate<{ products: { product: PopulatedCartProduct, quantity: number }[] }>('products.product')
			.then(doc => {
				if (!doc) throw new Error('Cart not found')

				return Promise.allSettled(
					doc.products.map(async product => {
						return new Promise(async (res, rej) => {
							const check = await products.checkStock(product.product._id, product.quantity)
		
							if (!check) return res(true)
		
							return rej(check)
						})
					})
				).then(async values => {
					const ok = values.every(x => x.status == 'fulfilled')

					if (ok) return doc

					const realValues = values as PromiseRejectedResult[]

					return Promise.allSettled(
						realValues.map(async ({ reason }) => {
							if (reason.stock < 1) {
								return Cart.findOneAndUpdate(
									{ _id: id },
									{ $pull: { 'products': { 'product': reason.id } } }
								)
							} else {
								return Cart.findById(id)
								.then(doc => {
									if (!doc) throw new Error('Cart not found')

									return Cart.findOneAndUpdate(
										{ _id: id, 'products.product': reason.id },
										{ $set: { 'products.$.quantity': reason.stock } }
									)
								})
							}
						})
					).then(() => {
						return Cart.findOne({ _id: id }).populate('products.product')
						.then(doc => {
							if (!doc) throw new Error('Cart not found')

							return doc
						})
					})
				})
			})
		}

		return Cart.findOne({ _id: id })
		.then(doc => {
			if (!doc) throw new Error('Cart not found')

			return doc
		})
	}

	getTotalAmount = async (id: string) => {
		return Cart.findOne({ _id: id }).populate<{ products: { product: Product, quantity: number }[] }>('products.product')
		.then(doc => {
			if (!doc) throw new Error('Cart not found')

			const preTotal = doc.products.reduce((prev, current) => {
				return prev + (current.product.price * current.quantity)
			}, 0)

			if (preTotal == 0) return 0

			const [whole, decimal] = preTotal.toString().split('.')
			
			return +(`${whole}.${decimal.substring(0, 2)}`)
		})
	}

	deleteCart = (cid: string) => {
		return Cart.findByIdAndUpdate(cid, { products: [] }, { new: true })
		.catch(err => { throw new Error(err.message) })
	}

	addProduct = async (cid: string, pid: string, quantity?: any) => {
		const products = new ProductManager()

		return products.getProductById(pid)
		.then(product => {
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
					}

					const pQuantity = isNaN(+quantity) ? 1 : +quantity

					const { products } = await this.getCart(cid) as PopulatedCartDocument
					const productQuantity = products.find(x => x.product._id == pid)?.quantity

					if (productQuantity && ((productQuantity + pQuantity) > product.stock)) {
						throw new Error('Not enough stock')
					}

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
				}).catch(err => {
					throw new Error(err.message)
				})
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