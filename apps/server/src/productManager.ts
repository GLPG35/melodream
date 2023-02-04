import { Product } from './types'
import * as fs from 'fs/promises'

class ProductManager {
	path: string

	constructor(path: string) {
		this.path = path
	}

	addProduct = async (code: string, title: string, price: number,
	thumbnail: string, description: string, stock: number): Promise<boolean> => {
		const products = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		const exists = products.find((x: Product) => x.code == code)

		if (!exists) {
			const newProduct: Product = {
				id: products.length + 1,
				code,
				title,
				price,
				thumbnail,
				description,
				stock
			}

			products.push(newProduct)

			await fs.writeFile(this.path, JSON.stringify(products), 'utf-8')

			return true
		}

		throw new Error('This product already exists!')
	}

	getProducts = async (limit?: number): Promise<Product[]> => {
		const products: Product[] | [] = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		if (!limit) {
			return products
		}

		if (limit <= 0) {
			throw new Error('Please provide a positive limit')
		}
			
		return products.filter((_x: Product, index) => index <= limit - 1)
	}

	getProductById = async (id: number): Promise<Product> => {
		const products = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		const findProduct = products.find((x: Product) => x.id == id)

		if (findProduct) {
			return findProduct
		}

		throw new Error('Product Not Found')
	}

	updateProduct = async (id: number, code: string | undefined, title: string | undefined, price: number | undefined,
	thumbnail: string | undefined, description: string | undefined, stock: number | undefined): Promise<boolean> => {
		const products: Product[] | [] = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		const findProduct: Product | undefined = products.find((x: Product) => x.id == id)

		if (!findProduct) {
			throw new Error('Product Not Found')
		}

		const updatedProduct = {
			id,
			code: code || findProduct.code,
			title: title || findProduct.code,
			price: price || findProduct.price,
			thumbnail: thumbnail || findProduct.thumbnail,
			description: description || findProduct.description,
			stock: stock || findProduct.stock
		}

		const productIndex = products.findIndex((x: Product) => x.id == id)
		products.splice(productIndex, 1, updatedProduct)

		await fs.writeFile(this.path, JSON.stringify(products), 'utf-8')

		return true
	}

	deleteProduct = async (id: number): Promise<boolean> => {
		const products: Product[] | [] = await fs.readFile(this.path, 'utf-8')
		.then((data: any) => JSON.parse(data))
		.catch(() => [])

		const findProduct = products.find((x: Product) => x.id == id)

		if (!findProduct) {
			throw new Error('Product Not Found')
		}

		const filteredProducts = products.filter((x: Product) => x.id != id)

		await fs.writeFile(this.path, JSON.stringify(filteredProducts), 'utf-8')

		return true
	}
}

export default ProductManager