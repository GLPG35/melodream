export interface Product {
	id: string | number,
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
	id: string | number,
	quantity: number
}

export interface Cart {
	id: string | number,
	products: CartProduct[]
}

export interface User {
	id: string,
	email: string,
	name: string,
	password: string,
	userType?: 'user' | 'admin'
}

type GetUser = Omit<User, password>

export declare module 'express-session' {
	interface SessionData {
		user: GetUser
	}
}