import { TbCurrencyDollar, TbMinus, TbPlus, TbTrash } from 'react-icons/tb'
import { Product } from '../../types'
import { motion } from 'framer-motion'
import styles from './styles.module.scss'

interface Callbacks {
	handleDelete: (id: string) => void,
	handleQtty: (id: string, type: 'add' | 'sub') => void
}

const CartProduct = ({ product, quantity, delay, callbacks }: { product: Product, quantity: number, delay: number, callbacks: Callbacks}) => {
	const { handleDelete, handleQtty } = callbacks

	return (
		<motion.div className={styles.cartProduct}
		initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay } }}>
			<div className={styles.top}>
				<div className={styles.pic}>
					<img src={product.thumbnails[0]} alt="" />
				</div>
				<div className={styles.info}>
					<div className={styles.title}>
						{product.title}
					</div>
					<div className={styles.price}>
						<TbCurrencyDollar style={{ fontSize: '0.9em' }} /> {product.price}
					</div>
				</div>
			</div>
			<div className={styles.bottom}>
				<div className={styles.quantity}>
					<motion.button className={styles.sub}
					onClick={() => handleQtty(product.id, 'sub')}>
						<TbMinus />
					</motion.button>
					<input type="number" min={0} value={quantity}
					readOnly />
					<motion.button className={styles.add}
					disabled={quantity >= product.stock}
					onClick={() => handleQtty(product.id, 'add')}>
						<TbPlus />
					</motion.button>
				</div>
				<div className={styles.delete}
				onClick={() => handleDelete(product.id)}>
					<TbTrash />
				</div>
			</div>
		</motion.div>
	)
}

export default CartProduct