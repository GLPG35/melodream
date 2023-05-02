import { useEffect, useState, useContext } from 'react'
import CartList from '../../components/CartList'
import { Product } from '../../types'
import { manageCart } from '../../utils/server'
import styles from './styles.module.scss'
import { resolveCid } from '../../utils/client'
import { globalContext } from '../../App'
import NoProducts from '../../components/NoProducts'
import { TbHome } from 'react-icons/tb'

const Cart = () => {
	const { user } = useContext(globalContext)
	const [products, setProducts] = useState<undefined | {product: Product, quantity: number}[]>()

	useEffect(() => {
		if (!products) {
			resolveCid(user).then(cid => {
				manageCart(cid)
				.then(res => {
					setProducts(res.products)
				})

				return
			})
		} else {
			resolveCid(user).then(cid => {
				manageCart(cid)
				.then(res => {
					setProducts(res.products)
				})

				return
			})
		}
	}, [user])

	return (
		<div className={styles.cart}>
			<div className={styles.title}>
				Cart
			</div>
			{(products !== undefined && products.length > 0) ?
				<CartList products={products} />
			: (products !== undefined && !products.length) &&
				<NoProducts title='Your cart is empty!' icon='cart' message='Go add some albums to it!'
				buttonLink='/' buttonMsg='Home' buttonIcon={<TbHome />} />
			}
		</div>
	)
}

export default Cart