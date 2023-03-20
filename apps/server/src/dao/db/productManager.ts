import { AddProduct } from '../../types'
import Product from './models/Product'

class ProductManager {
	addProduct = async (product: AddProduct) => {
		Product.create(product)
		.then(() => {
			return true
		}).catch(err => {
			throw new Error(err.message)
		})
	}

	getProducts = async (limit?: number) => {
		if (limit) {
			if (isNaN(limit)) throw new Error('Limit is not a number!')

			return Product.find({}).limit(limit).sort({ createdAt: 'desc' }).exec()
		}

		return Product.find({}).sort({ createdAt: 'desc' }).exec()
	}

	getProductByCode = (code: string) => {
		return Product.findOne({ code }).exec()
		.then(product => {
			if (!product) throw new Error('Product not found')

			return product
		})
		.catch(err => {
			throw new Error(err.message)
		})
	}

	getProductById = (id: string) => {
		return Product.findById(id).exec()
		.then(product => {
			if (!product) throw new Error('Product not found')

			return product
		})
		.catch(err => {
			throw new Error(err.message)
		})
	}

	updateProduct = (id: string, newProduct: AddProduct) => {
		return Product.findByIdAndUpdate(id, newProduct, { new: true }).exec()
		.then(product => {
			if (!product) throw new Error('Product not found')

			return product
		})
		.catch(err => {
			throw new Error(err.message)
		})
	}

	deleteProduct = (id: string) => {
		return Product.findByIdAndDelete(id).exec()
		.then(() => {
			return true
		}).catch(() => {
			throw new Error('Product not found')
		})
	}
}

export default ProductManager