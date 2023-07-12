import { AddProduct, UpdateProduct } from '../../types'
import { CustomError, createURL } from '../../utils'
import Product from './models/Product'
import UserManager from './userManager'

class ProductManager {
	addProduct = async (product: AddProduct) => {
		const { owner, code } = product

		const exists = await this.getProductByCode(code).catch(() => null)

		if (exists) throw new CustomError('This product already exists', 400)

		return this.parseOwner(owner as string)
		.then(parsedOwner => {
			return Product.create({ ...product, owner: parsedOwner, status: true })
			.then(() => {
				return true
			}).catch(err => {
				throw new CustomError(err.message, 400)
			})
		})
	}

	getProducts = async (limit?: any, page?: any, sort?: any, query?: any, email?: string) => {
		const users = new UserManager()

		if (isNaN(limit) && limit !== undefined) throw new CustomError('Provide a valid limit', 400)
		if (limit <= 0) throw new CustomError('Provide a limit greater than 0', 400)
		if (isNaN(page) && page !== undefined) throw new CustomError('Provide a valid page', 400)
		if (typeof query !== 'object' && query !== undefined) throw new CustomError('Provide a valid query', 400)

		let owner

		if (email) {
			const checkUser = await users.getUser(email)

			if (checkUser && checkUser.userType !== 'admin') {
				owner = checkUser.id
			}
		}

		return Product.paginate(owner ? { owner, status: true, ...query } : { status: true, ...query } || { status: true }, {
			stock: { $gte: 1 },
			limit: limit ? limit : 10,
			page: page ? page : 1,
			sort: typeof sort !== 'object' ?
			{ createdAt: sort || 'desc' }
			: sort,
			query,
			populate: ['category', 'owner']
		}).then(data => {
			return {
				...data,
				prevLink: data.prevPage ? createURL(data.prevPage) : null,
				nextLink: data.nextPage ? createURL(data.nextPage) : null
			}
		})
	}

	getProductByCode = (code: string) => {
		return Product.findOne({ code }).populate('category')
		.then(product => {
			if (!product) throw new CustomError('Product not found', 404)

			return product
		})
	}

	getProductById = (id: string | number) => {
		return Product.findById(id).populate('category').populate('owner').exec()
		.then(product => {
			if (!product) throw new CustomError('Product not found', 404)

			return product
		})
	}


	updateProduct = async (id: string, newProduct: UpdateProduct) => {
		const { email, code } = newProduct
		await this.checkOwner(id, email)

		if (code) {
			const exists = await this.getProductByCode(code).catch(() => null)

			if (exists) throw new CustomError('A product with this code already exists', 400)
		}

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

	deleteProduct = async (id: string, body?: { owner: string }) => {
		if (body?.owner) {
			const { owner } = body

			await this.checkOwner(id, owner)
		}

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

	parseOwner = async (email: string) => {
		const users = new UserManager()

		console.log(email)
		
		return users.getUser(email)
		.then(user => {
			if (!user) throw new CustomError('User not found', 404)

			return user.userType === 'admin' ? undefined : user.id
		})
	}
	
	checkOwner = async (id: string, email: string) => {
		const users = new UserManager()
		const user = await users.getUser(email)

		if (!user) throw new CustomError('User not found', 404)

		if (user.userType === 'admin') return undefined

		return Product.findOne({ _id: id, owner: user.id })
		.then(doc => {
			if (!doc) throw new CustomError('User is not the owner of this product', 403)

			return doc
		})
	}
}

export default ProductManager