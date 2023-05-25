import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '../../types'
import CartProduct from '../CartProduct'
import styles from './styles.module.scss'
import { TbDisc, TbShoppingCart } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

interface Callbacks {
	handleDelete: (id: string) => void,
	handleQtty: (id: string, type: 'add' | 'sub') => void
}

const CartList = ({ products, callbacks, total }: { products: {product: Product, quantity: number}[], callbacks: Callbacks, total: number }) => {
	const navigate = useNavigate()
	
	const handleBuy = () => {
		navigate('buy')
	}
	
	return (
		<div className={styles.cartWrapper}>
			<div className={styles.cartList}>
				<AnimatePresence mode='wait'>
					{products.map(({ product, quantity }, index) => {
						const delay = index === 0 ? 0 : (index + 1) / 10 

						return (
							<CartProduct key={product.id} product={product} quantity={quantity} delay={delay} callbacks={callbacks} />
						)
					})}
				</AnimatePresence>
			</div>
			<div className={styles.checkout}>
				<h2>Checkout</h2>
				<div className={styles.info}>
					<div className={styles.details}>
						{products.map(({ product, quantity }) => {
							return (
								<div key={product.id} className={styles.product}>
									<div className={styles.title}>{product.title}</div>
									<div className={styles.quantity}><TbDisc /> {quantity}</div>
								</div>
							)
						})}
					</div>
					<div className={styles.total}>
						<span>Total</span>
						<span>${total}</span>
					</div>
					<motion.button whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }} onClick={handleBuy}>
						<TbShoppingCart /> Buy
					</motion.button>
				</div>
			</div>
		</div>
	)
}

export default CartList