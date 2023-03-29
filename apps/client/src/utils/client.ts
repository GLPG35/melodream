import { manageCart } from './server'

export const resolveCid = () => {
	const jCid = localStorage.getItem('cart')

	if (jCid) {
		const cid = JSON.parse(jCid)

		return new Promise((res: (value: any) => void, _rej) => {
			res(cid)
		})
	}

	return manageCart()
	.then(res => {
		const cid = res.message

		localStorage.setItem('cart', JSON.stringify(cid))

		return cid
	})
}

export const saveQuantity = (count: number, updateCartCount: (count: number) => void) => {
	localStorage.setItem('cartQtty', JSON.stringify(count))

	updateCartCount(count)
}