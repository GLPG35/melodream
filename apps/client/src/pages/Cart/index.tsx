import { useEffect, useState } from 'react'
import CartList from '../../components/CartList'
import { Product } from '../../types'
import { manageCart } from '../../utils/server'
import styles from './styles.module.scss'

const Cart = () => {
	const [products, setProducts] = useState<undefined | {product: Product, quantity: number}[]>()

	useEffect(() => {
		if (!products) {
			const jCid = localStorage.getItem('cart')

			if (jCid) {
				const cid = JSON.parse(jCid)

				manageCart(cid)
				.then(res => {
					setProducts(res.products)
					console.log(res.products)
				})

				return
			}

			manageCart()
			.then(res => {
				localStorage.setItem('cart', JSON.stringify(res.message))

				const cid = res.message

				manageCart(cid)
				.then(res => {
					setProducts(res.products)
				})

				return
			})
		}
	}, [])

	return (
		<div className={styles.cart}>
			<div className={styles.title}>
				Cart
			</div>
			{(products !== undefined && products.length > 0) &&
				<CartList products={products} />
			}
		</div>
	)
}

export default Cart