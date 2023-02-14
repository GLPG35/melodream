import { Cart, CartProduct } from './types'
import * as fs from 'fs/promises'
import ProductManager from './productManager'

class CartManager {
	path: string

	constructor(path: string) {
		this.path = path
	}

	addCart = async () => {
		const carts: Cart[] = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		carts.push({ id: carts.length + 1, products: [] })

		await fs.writeFile(this.path, JSON.stringify(carts, null, '\t'), 'utf-8')

		return true
	}

	getCart = async (id: number) => {
		const carts: Cart[] = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		if (isNaN(id)) throw new Error('Id is not a number!')

		const cart = carts.find(x => x.id == id)

		if (!cart) throw new Error('The cart does not exist!')

		return cart.products
	}

	addProduct = async (cid: number, pid: number) => {
		const carts: Cart[] = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		if (isNaN(cid)) throw new Error('Id is not a number!')

		const findCart = carts.find(x => x.id == cid)

		if (!findCart) throw new Error('The cart does not exist!')

		const products = new ProductManager('/static/products.json')
		await products.getProductById(pid)
		.catch(err => { throw new Error(err.message) })
		
		const findCartIndex = carts.findIndex(x => x.id == cid)
		const findCartProduct = findCart.products.find(x => x.id == pid)

		if (findCartProduct) {
			const mapProducts = findCart.products.map((x: CartProduct) => x.id === pid ? {...x, quantity: x.quantity + 1 } : x)
			findCart['products'] = mapProducts
		} else {
			findCart.products.push({ id: pid, quantity: 1 })
		}

		carts.splice(findCartIndex, 1, findCart)

		await fs.writeFile(this.path, JSON.stringify(carts, null, '\t'), 'utf-8')

		return true
	}
}

export default CartManager