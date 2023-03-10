export interface Product {
	id: number,
	code: string,
	title: string,
	price: number,
	thumbnails: string[],
	description: string,
	stock: number,
	category: string,
	subCategory: string,
	status: boolean
}

export type AddProduct = Omit<Product, 'id'>

export interface CartProduct {
	id: number,
	quantity: number
}

export interface Cart {
	id: number,
	products: CartProduct[]
}