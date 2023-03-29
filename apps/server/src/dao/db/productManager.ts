import { AddProduct } from '../../types'
import createURL from '../../utils/createURL'
import Product from './models/Product'

class ProductManager {
	addProduct = async (product: AddProduct) => {
		Product.create({ ...product, status: true })
		.then(() => {
			return true
		}).catch(err => {
			throw new Error(err.message)
		})
	}

	getProducts = async (limit?: any, page?: any, sort?: any, query?: any) => {
		if (isNaN(limit) && limit !== undefined) throw new Error('Provide a valid limit')
		if (limit <= 0) throw new Error('Provide a limit greater than 0')
		if (isNaN(page) && page !== undefined) throw new Error('Provide a valid page')
		if (typeof query !== 'object' && query !== undefined) throw new Error('Provide a valid query')

		return Product.paginate(query || {}, {
			limit: limit ? limit : 10,
			page: page ? page : 1,
			sort: typeof sort !== 'object' ?
			{ createdAt: sort || 'desc' }
			: sort,
			query
		}).then(data => {
			return {
				...data,
				prevLink: data.prevPage ? createURL(data.prevPage) : null,
				nextLink: data.nextPage ? createURL(data.nextPage) : null
			}
		})
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
		return Product.findByIdAndUpdate(id, { status: false }).exec()
		.then(() => {
			return true
		}).catch(() => {
			throw new Error('Product not found')
		})
	}
}

export default ProductManager