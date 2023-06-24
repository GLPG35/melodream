import { useContext, useEffect, useState } from 'react'
import { Product } from '../../types'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './styles.module.scss'
import AddToCart from '../AddToCart'
import { globalContext } from '../../App'
import { TbUserCircle } from 'react-icons/tb'

const ProductDetails = ({ product }: { product: Product }) => {
	const { user } = useContext(globalContext)
	const [selectedThumb, setSelectedThumb] = useState(0)
	const [isOwner, setIsOwner] = useState<boolean>()
	
	useEffect(() => {
		if (user && product.owner && (product.owner.email == user.email)) {
			setIsOwner(true)
		} else {
			setIsOwner(false)
		}
	}, [user])

	const cutText = (text: string) => {
		return `${text.substring(0, 299)} ${text.length > 300 && '...'}`
	}

	return (
		<div className={styles.productDetails}>
			<div className={styles.info}>
				<div className={styles.title}>
					{product.title}
				</div>
				<div className={styles.description}>
					{cutText(product.description)}
				</div>
				{(product.thumbnails.length > 1) &&
					<div className={styles.variants}>
						{product.thumbnails.map((thumb, index) => (
							<motion.div className={styles.variant} onClick={() => setSelectedThumb(index)}
							initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
								<img src={thumb} alt="" />
							</motion.div>
						))}
						<motion.div className={styles.selected} initial={{ scale: 0 }}
						animate={{ scale: 1, translateX: `${selectedThumb * 100}%` }}>
						</motion.div>
					</div>
				}
				{isOwner !== undefined && isOwner &&
					<div className={styles.owner}>
						<h4>Seller</h4>
						<div className={styles.wrapper}>
							<div className={styles.ownerPic}>
								<TbUserCircle />
							</div>
							<div className={styles.ownerName}>
								{product.owner && product.owner.name}
							</div>
						</div>
					</div>
				}
			</div>
			<div className={styles.pic}>
				<AnimatePresence mode='wait'>
					<motion.img src={product.thumbnails[selectedThumb]} alt=""
					initial={{ opacity: 0 }} animate={{ opacity: 1 }}
					exit={{ opacity: 0 }} key={selectedThumb} />
				</AnimatePresence>
			</div>
			{isOwner !== undefined && !isOwner &&
				<div className={styles.actions}>
					<AddToCart id={product.id} stock={product.stock} />
				</div>
			}
		</div>
	)
}

export default ProductDetails