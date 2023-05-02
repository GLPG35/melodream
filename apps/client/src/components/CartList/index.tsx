import { AnimatePresence } from 'framer-motion'
import { Product } from '../../types'
import CartProduct from '../CartProduct'
import styles from './styles.module.scss'

const CartList = ({ products }: { products: {product: Product, quantity: number}[] }) => {
	return (
		<div className={styles.cartList}>
			<AnimatePresence mode='wait'>
				{products.map(({ product, quantity }, index) => {
					const delay = index === 0 ? 0 : (index + 1) / 10 

					return (
						<CartProduct key={product.id} product={product} quantity={quantity} delay={delay} />
					)
				})}
			</AnimatePresence>
		</div>
	)
}

export default CartList