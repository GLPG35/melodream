import Order from './models/Order'
import CartManager from './cartManager'
import { PopulatedCartDocument } from './models/Cart'
import UserManager from './userManager'
import ProductManager from './productManager'
import { CustomError } from '../../utils'
import MailManager from './mailManager'


class OrderManager {
	addOrder = async (cid: string, email: string, userInfo: { phone: number, street: string }) => {
		const carts = new CartManager()
		const users = new UserManager()
		const products = new ProductManager()

		const populatedCart = await carts.getCart(cid, false, false) as PopulatedCartDocument
		const amount = await carts.getTotalAmount(cid)
		const { id: user } = await users.getUser(email).then(doc => {
			if (!doc) throw new CustomError('User not found', 404)

			return doc
		})

		return Promise.allSettled(
			populatedCart.products.map(async product => {
				return new Promise(async (res, rej) => {
					const check = await products.checkStock(product.product._id, product.quantity)

					if (!check) return res(true)

					return rej(check)
				})
			})
		).then(async values => {
			const ok = values.every(x => x.status == 'fulfilled')

			if (ok) {
				populatedCart.products.forEach(async product => {
					await products.updateStock(product.product._id, product.quantity)
				})

				await carts.deleteCart(cid)
	
				return Order.create({ amount, products: populatedCart.products, user, userInfo })
				.then(async order => {
					const mails = new MailManager()

					mails.successfulOrder(email, order.id)

					return order
				})
			}

			throw new CustomError('Not enough stock of selected products', 409)
		})
	}

	getOrders = async (email: string) => {
		const users = new UserManager()

		const { id: user } = await users.getUser(email).then(doc => {
			if (!doc) throw new CustomError('User not found', 404)

			return doc
		})

		return Order.find({ user }).sort([['createdAt', -1]])
	}

	getOrder = async (email: string, oid: string) => {
		const users = new UserManager()

		const { id: user } = await users.getUser(email).then(doc => {
			if (!doc) throw new CustomError('User not found', 404)

			return doc
		})
		
		return Order.findOne({ _id: oid, user }).populate(['user', 'products.product'])
		.then(doc => {
			if (!doc) throw new CustomError('Order not found', 404)

			return doc
		})
	}
}

export default OrderManager