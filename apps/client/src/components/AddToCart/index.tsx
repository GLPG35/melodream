import { motion } from 'framer-motion'
import { useState, useContext } from 'react'
import { TbCirclePlus, TbMinus, TbPlus } from 'react-icons/tb'
import { manageCart } from '../../utils/server'
import { globalContext } from '../../App'
import styles from './styles.module.scss'
import { resolveCid, saveQuantity } from '../../utils/client'

const AddToCart = ({ id, stock }: { id: string, stock: number }) => {
	const [selectedQuantity, setSelectedQuantity] = useState(1)
	const { updateCartCount } = useContext(globalContext)

	const checkStock = (qtty: number) => {
		if (qtty > stock) return stock
		if (qtty < 1) return 1

		return qtty
	}

	const changeQtty = (type: 'sub' | 'add') => {
		const bType = type == 'add'

		const newQtty = checkStock(bType ? selectedQuantity + 1 : selectedQuantity - 1)
		setSelectedQuantity(newQtty)
	}

	const handleAddToCart = () => {
		const body = {
			quantity: selectedQuantity
		}

		resolveCid()
		.then(cid => {
			manageCart(cid, id, body)
			.then(res => {
				saveQuantity(+res.message.count, updateCartCount)
			})
		})
	}

	return (
		<div className={styles.addToCart}>
			<div className={styles.wrapper}>
				<span>Quantity</span>
				<div className={styles.quantity}>
					<motion.button className={styles.sub}
					onClick={() => changeQtty('sub')}>
						<TbMinus />
					</motion.button>
					<input type="number" min={0} max={stock} value={selectedQuantity}
					readOnly />
					<motion.button className={styles.add}
					onClick={() => changeQtty('add')}>
						<TbPlus />
					</motion.button>
				</div>
			</div>
			<motion.div className={styles.addProduct}
			whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
			onClick={handleAddToCart}>
				Add to Cart <TbCirclePlus />
			</motion.div>
		</div>
	)
}

export default AddToCart