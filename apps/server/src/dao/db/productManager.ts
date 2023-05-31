import { AddProduct } from '../../types'
import { CustomError, createURL } from '../../utils'
import Product from './models/Product'

class ProductManager {
	addProduct = async (product: AddProduct) => {
		Product.create({ ...product, status: true })
		.then(() => {
			return true
		}).catch(err => {
			throw new CustomError(err.message, 400)
		})
	}

	getProducts = async (limit?: any, page?: any, sort?: any, query?: any) => {
		if (isNaN(limit) && limit !== undefined) throw new CustomError('Provide a valid limit', 400)
		if (limit <= 0) throw new CustomError('Provide a limit greater than 0', 400)
		if (isNaN(page) && page !== undefined) throw new CustomError('Provide a valid page', 400)
		if (typeof query !== 'object' && query !== undefined) throw new CustomError('Provide a valid query', 400)

		return Product.paginate({ status: true, ...query } || { status: true }, {
			limit: limit ? limit : 10,
			page: page ? page : 1,
			sort: typeof sort !== 'object' ?
			{ createdAt: sort || 'desc' }
			: sort,
			query,
			populate: 'category'
		}).then(data => {
			return {
				...data,
				prevLink: data.prevPage ? createURL(data.prevPage) : null,
				nextLink: data.nextPage ? createURL(data.nextPage) : null
			}
		})
	}

	getProductByCode = (code: string) => {
		return Product.findOne({ code }).populate('category').exec()
		.then(product => {
			if (!product) throw new CustomError('Product not found', 404)

			return product
		}).catch(err => {
			throw new CustomError(err.message, 500)
		})
	}

	getProductById = (id: string | number) => {
		return Product.findById(id).populate('category').exec()
		.then(product => {
			if (!product) throw new CustomError('Product not found', 404)

			return product
		}).catch(err => {
			throw new CustomError(err.message, 500)
		})
	}

	updateProduct = (id: string, newProduct: AddProduct) => {
		return Product.findByIdAndUpdate(id, newProduct, { new: true }).exec()
		.then(product => {
			if (!product) throw new CustomError('Product not found', 404)

			return product
		})
		.catch(err => {
			throw new CustomError(err.message, 500)
		})
	}

	checkStock = (id: string | number, quantity: number) => {
		return this.getProductById(id)
		.then(product => {
			if (product.stock >= quantity) return false

			return {
				id: product.id,
				stock: product.stock
			}
		}).catch(err => {
			throw new CustomError(err.message, err.code)
		})
	}

	updateStock = (id: string | number, quantity: number) => {
		return Product.findOneAndUpdate({ _id: id }, { $inc: { stock: -quantity } }, { new: true })
	}

	deleteProduct = (id: string) => {
		return Product.findByIdAndUpdate(id, { status: false }).exec()
		.then(() => {
			return true
		}).catch(() => {
			throw new CustomError('Product not found', 404)
		})
	}

	searchProduct = (text: string) => {
		return Product.aggregate([
			{ $search: { autocomplete: { query: text, path: 'title'} } },
			{ $limit: 5 },
			{ $addFields: { 'id': '$_id' } }
		]).exec()
	}
}

export default ProductManager