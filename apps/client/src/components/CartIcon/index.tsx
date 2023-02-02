import { TbShoppingCart } from 'react-icons/tb'
import styles from './styles.module.scss'

const CartIcon = () => {
	return (
		<div className={styles.cartIcon}>
			<TbShoppingCart />
		</div>
	)
}

export default CartIcon