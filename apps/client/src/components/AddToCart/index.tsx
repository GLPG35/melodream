import { motion } from 'framer-motion'
import { useState, useContext, useEffect } from 'react'
import { TbCirclePlus, TbMinus, TbPlus } from 'react-icons/tb'
import { checkCartProduct, manageCart } from '../../utils/server'
import { globalContext } from '../../App'
import styles from './styles.module.scss'
import { resolveCid, saveQuantity } from '../../utils/client'

const AddToCart = ({ id, stock }: { id: string, stock: number }) => {
	const [selectedQuantity, setSelectedQuantity] = useState(1)
	const { updateCartCount, user } = useContext(globalContext)
	const [canAdd, setCanAdd] = useState<boolean>()

	useEffect(() => {
		if (canAdd === undefined || user) {
			resolveCid(user)
			.then(cid => {
				checkCartProduct(cid, id)
				.then(check => {
					setCanAdd(check)
				})
			})
		}
	}, [user])

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
		if (!canAdd) return

		const body = {
			quantity: selectedQuantity
		}

		resolveCid(user)
		.then(cid => {
			manageCart(cid, id, body)
			.then(res => {
				saveQuantity(+res.message.count, updateCartCount)
			})

			checkCartProduct(cid, id)
			.then(check => {
				setCanAdd(check)
			})
		})
	}

	return (
		<div className={styles.addToCart}>
			<div className={styles.wrapper}>
				<span>Quantity</span>
				<div className={styles.quantity}>
					<motion.button className={styles.sub}
					onClick={() => changeQtty('sub')} disabled={selectedQuantity <= 1}>
						<TbMinus />
					</motion.button>
					<input type="number" min={0} max={stock} value={selectedQuantity}
					readOnly />
					<motion.button className={styles.add}
					onClick={() => changeQtty('add')} disabled={selectedQuantity >= stock}>
						<TbPlus />
					</motion.button>
				</div>
			</div>
			<motion.div className={`${styles.addProduct} ${!canAdd ? styles.disabled : ''}`}
			whileHover={{ scale: canAdd ? 1.1 : 1 }} whileTap={{ scale: canAdd ? 0.9 : 1 }}
			onClick={handleAddToCart}>
				Add to Cart <TbCirclePlus />
			</motion.div>
		</div>
	)
}

export default AddToCart