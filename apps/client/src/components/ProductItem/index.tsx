import { MouseEvent, useContext } from 'react'
import { TbCurrencyDollar, TbShoppingCart } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { globalContext } from '../../App'
import { Product } from '../../types'
import { resolveCid, saveQuantity } from '../../utils/client'
import { manageCart } from '../../utils/server'
import { motion } from 'framer-motion'
import styles from './styles.module.scss'

const ProductItem = ({ product, delay }: { product: Product, delay: number }) => {
	const { updateCartCount, user } = useContext(globalContext)
	const navigate = useNavigate()

	const viewProduct = () => {
		navigate(`/product/${product.id}`)
	}

	const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()

		resolveCid(user)
		.then(cid => {
			manageCart(cid, product.id, { quantity: 1 })
			.then(res => {
				saveQuantity(+res.message.count, updateCartCount)
			})
		})
	}

	return (
		<motion.div className={styles.product} onClick={viewProduct}
		initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: delay } }}>
			<div className={styles.pic}>
				<img src={product.thumbnails[0]} alt="" />
				<div className={styles.overlay}>
					<div className={styles.info}>
						<div className={styles.title}>
							{product.title}
						</div>
						<div className={styles.price}>
							<TbCurrencyDollar style={{ fontSize: '0.9em' }} /> {product.price}
						</div>
					</div>
					<button title='Add to cart' onClick={handleAddToCart}>
						<TbShoppingCart />
					</button>
				</div>
			</div>
		</motion.div>
	)
}

export default ProductItem