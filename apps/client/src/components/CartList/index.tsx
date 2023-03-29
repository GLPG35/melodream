import { Product } from '../../types'
import CartProduct from '../CartProduct'
import styles from './styles.module.scss'

const CartList = ({ products }: { products: {product: Product, quantity: number}[] }) => {
	return (
		<div className={styles.cartList}>
			{products.map(({ product, quantity }) => {
				return (
					<CartProduct key={product.id} product={product} quantity={quantity} />
				)
			})}
		</div>
	)
}

export default CartList