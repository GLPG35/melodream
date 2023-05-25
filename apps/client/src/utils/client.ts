import { User } from '../types'
import { manageCart } from './server'

export const resolveCid = (user?: User | null) => {
	if (user) {
		localStorage.setItem('cart', user.cart)

		return new Promise((res: (value: any) => void, _rej) => {
			res(user.cart)
		})
	}
	
	const guestCart = localStorage.getItem('guestCart')

	if (guestCart) {
		return new Promise((res: (value: any) => void, _rej) => {
			res(guestCart)
		})
	}

	return manageCart()
	.then(res => {
		const cid = res.message

		localStorage.setItem('guestCart', cid)

		return cid
	})
}

export const saveQuantity = (count: number, updateCartCount: (count: number) => void) => {
	localStorage.setItem('cartQtty', JSON.stringify(count))

	updateCartCount(count)
}