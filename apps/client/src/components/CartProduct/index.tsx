import { useState } from 'react'
import { TbCurrencyDollar, TbMinus, TbPlus } from 'react-icons/tb'
import { Product } from '../../types'
import { motion } from 'framer-motion'
import styles from './styles.module.scss'

const CartProduct = ({ product, quantity, delay }: { product: Product, quantity: number, delay: number }) => {
	const [selectedQuantity, setSelectedQuantity] = useState(quantity)

	const checkStock = (qtty: number) => {
		if (qtty > product.stock) return product.stock
		if (qtty < 1) return 1

		return qtty
	}

	const changeQtty = (type: 'sub' | 'add') => {
		const bType = type == 'add'

		const newQtty = checkStock(bType ? selectedQuantity + 1 : selectedQuantity - 1)
		setSelectedQuantity(newQtty)
	}

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
					onClick={() => changeQtty('sub')}>
						<TbMinus />
					</motion.button>
					<input type="number" min={0} max={product.stock} value={selectedQuantity}
					readOnly />
					<motion.button className={styles.add}
					onClick={() => changeQtty('add')}>
						<TbPlus />
					</motion.button>
				</div>
			</div>
		</motion.div>
	)
}

export default CartProduct