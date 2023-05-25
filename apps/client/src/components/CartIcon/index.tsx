import { TbShoppingCart } from 'react-icons/tb'
import { globalContext } from '../../App'
import { useContext } from 'react'
import styles from './styles.module.scss'
import { useNavigate } from 'react-router-dom'

const CartIcon = () => {
	const { cartCount } = useContext(globalContext)
	const navigate = useNavigate()

	const goToCart = () => {
		navigate('/cart')
	}

	return (
		<div className={styles.cartIcon}
		onClick={goToCart}>
			<TbShoppingCart />
			{cartCount !== undefined && cartCount !== 0 &&
				<div className={styles.count}>
					{cartCount > 99 ? +99 : cartCount}
				</div>
			}
		</div>
	)
}

export default CartIcon