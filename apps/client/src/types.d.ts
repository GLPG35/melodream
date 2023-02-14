export type AlertIcon = 'success' | 'error' | 'warn'

export type NotFoundIcon = 'notfound' | ''

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