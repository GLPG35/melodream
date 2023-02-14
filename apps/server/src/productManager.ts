import { AddProduct, Product } from './types'
import * as fs from 'fs/promises'

const isString = (string: any): boolean => {
	return ((typeof string === 'string') || (string instanceof String))
}

const isBoolean = (boolean: any): boolean => {
	return (typeof boolean === 'boolean')
}

const isArrayOfStr = (array: any): boolean => {
	if (!Array.isArray(array)) return false
	if (!array.length) return false

	return array.every(x => isString(x))
}

class ProductManager {
	path: string

	constructor(path: string) {
		this.path = path
	}

	addProduct = async ({ code, title, price, thumbnails, description, stock, category, subCategory }: AddProduct): Promise<boolean> => {
		const products = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		if (!isString(code)) throw new Error('Code is not a string!') 

		const exists = products.find((x: Product) => x.code == code)

		if (!exists) {
			const typeCheckMap = [
				{ attr: title, fn: isString, errMsg: 'Title is not a string!' },
				{ attr: thumbnails, fn: isArrayOfStr, errMsg: 'Thumbnails are not an array of strings!' },
				{ attr: description, fn: isString, errMsg: 'Description is not a string!' },
				{ attr: category, fn: isString, errMsg: 'Category is not a string!' },
				{ attr: subCategory, fn: isString, errMsg: 'Sub Category is not a string!' }
			]
			
			typeCheckMap.forEach(({ attr, fn, errMsg }) => {
				if (attr === thumbnails && attr === undefined) return
				if (!fn(attr)) throw new Error(errMsg)
			})

			if (isNaN(+price)) throw new Error('Price is not a number!')
			if (isNaN(+stock)) throw new Error('Stock is not a number!')

			const newProduct: Product = {
				id: products.length + 1,
				code,
				title,
				price,
				thumbnails: thumbnails || 'Sin imagen',
				description,
				stock,
				category,
				subCategory,
				status: true
			}

			products.push(newProduct)

			await fs.writeFile(this.path, JSON.stringify(products, null, '\t'), 'utf-8')

			return true
		}

		throw new Error('This product already exists!')
	}

	getProducts = async (limit?: number): Promise<Product[]> => {
		const products: Product[] | [] = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		if (!limit) {
			return products.filter(x => x.status)
		}

		if (limit <= 0) {
			throw new Error('Please provide a positive limit')
		}
			
		return products.filter((x: Product, index) => index <= limit - 1 && x.status)
	}

	getProductById = async (id: number): Promise<Product> => {
		const products = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		const findProduct = products.find((x: Product) => x.id == id && x.status)

		if (findProduct) {
			return findProduct
		}

		throw new Error('Product Not Found')
	}

	getProductByCode = async (code: string): Promise<Product> => {
		const products = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		const findProduct = products.find((x: Product) => x.code == code)

		if (findProduct) {
			return findProduct
		}

		throw new Error('Product Not Found')
	}

	updateProduct = async (id: number, { code, title, price, thumbnails, description, stock, category, subCategory, status }: Product): Promise<boolean> => {
		const products: Product[] | [] = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		if (isNaN(id)) throw new Error('Id is not a number!')

		const findProduct = products.find((x: Product) => x.id == id)

		if (!findProduct) {
			throw new Error('Product Not Found')
		}

		const typeCheckMap = [
			{ attr: code, fn: isString, errMsg: 'Title is not a string!' },
			{ attr: title, fn: isString, errMsg: 'Title is not a string!' },
			{ attr: thumbnails, fn: isArrayOfStr, errMsg: 'Thumbnails are not an array of strings!' },
			{ attr: description, fn: isString, errMsg: 'Description is not a string!' },
			{ attr: category, fn: isString, errMsg: 'Category is not a string!' },
			{ attr: subCategory, fn: isString, errMsg: 'Sub Category is not a string!' },
			{ attr: status, fn: isBoolean, errMsg: 'Status is not a boolean!' }
		]
		
		typeCheckMap.forEach(({ attr, fn, errMsg }) => {
			if (attr === undefined) return
			if (!fn(attr)) throw new Error(errMsg)
		})

		if (isNaN(+price) && price !== undefined) throw new Error('Price is not a number!')
		if (isNaN(+stock) && stock !== undefined) throw new Error('Stock is not a number!')

		const updatedProduct = {
			id,
			code: code || findProduct.code,
			title: title || findProduct.title,
			price: price || findProduct.price,
			thumbnails: thumbnails || findProduct.thumbnails,
			description: description || findProduct.description,
			stock: stock || findProduct.stock,
			category: category || findProduct.category,
			subCategory: subCategory || findProduct.subCategory,
			status: status || findProduct.status
		}

		const productIndex = products.findIndex((x: Product) => x.id == id)
		products.splice(productIndex, 1, updatedProduct)

		await fs.writeFile(this.path, JSON.stringify(products, null, '\t'), 'utf-8')

		return true
	}

	deleteProduct = async (id: number): Promise<boolean> => {
		const products: Product[] | [] = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		if (isNaN(id)) throw new Error('Id is not a number!')

		const findProduct = products.find((x: Product) => x.id == id)

		if (!findProduct) {
			throw new Error('Product Not Found')
		}

		const filteredProducts = products.map((x: Product) => x.id === id ? { ...x, status: false } : x)

		await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, '\t'), 'utf-8')

		return true
	}
}

export default ProductManager