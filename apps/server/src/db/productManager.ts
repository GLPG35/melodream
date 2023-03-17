import { AddProduct } from '../types'
import Product from './Product'

class ProductManager {
	addProducts = async ({ code, title, price, thumbnails, description, stock, category, subCategory }: AddProduct) => {
		const exists = await this.getProductByCode(code)

		if (exists) throw new Error('This product already exists!')

		Product.create({
			code,
			title,
			price,
			thumbnails,
			description,
			stock,
			category,
			subCategory
		}).then(doc => {
			return doc
		}).catch(err => {
			throw new Error(err.message)
		})
	}

	getProducts = async () => {
		Product.find({})
		.then(products => {
			return products
		}).catch(err => {
			throw new Error(err.message)
		})
	}

	getProductByCode = async (code: string) => {
		return Product.findOne({ code })
		.then(product => product)
		.catch(() => {
			throw new Error('Product not found')
		})
	}
}

export default ProductManager