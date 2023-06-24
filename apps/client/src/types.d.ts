export type AlertIcon = 'success' | 'error' | 'warn'

export type NotFoundIcon = 'notfound' | ''

export interface Product {
	id: string,
	code: string,
	title: string,
	price: number,
	thumbnails: string[],
	description: string,
	stock: number,
	category: {
		id: string,
		name: string
	},
	subCategory: string,
	owner?: {
		email: string,
		name: string
	},
	status: boolean
}

export interface User {
	email: string,
	name: string,
	userType: string,
	cart: string
}

export interface Category {
	id: string,
	name: string
}

export interface Order {
	amount: number,
	createdAt: Date,
	id: string,
	products: {
		product: Product,
		quantity: number
	}[],
	user: User,
	userInfo: {
		phone: number,
		street: string
	}
}