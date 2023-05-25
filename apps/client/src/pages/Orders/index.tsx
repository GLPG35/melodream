import { useContext, useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { manageOrder } from '../../utils/server'
import { globalContext } from '../../App'
import { Order } from '../../types'
import { TbChevronRight, TbCurrencyDollar, TbDisc } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Orders = () => {
	const { user } = useContext(globalContext)
	const [orders, setOrders] = useState<Order[]>()
	const [hoverOrder, setHoverOrder] = useState<string>()
	const navigate = useNavigate()
	
	useEffect(() => {
		if (orders === undefined && user) {
			manageOrder(user.email)
			.then(res => {
				console.log(res)
				setOrders(res)
			})
		}
	}, [user])

	const handleOrder = (oid: string) => {
		navigate(oid)
	}
	
	return (
		<div className={styles.orders}>
			<div className={styles.title}>
				Orders
			</div>
			<div className={styles.ordersList}>
				{orders && orders.map(({ id, amount, createdAt, products }) => {
					const total = products.reduce((prev, curr) => {
						return prev + curr.quantity
					}, 0)

					const date = new Intl.DateTimeFormat('en-UK', {
						dateStyle: 'medium',
						timeStyle: 'short'
					}).format(new Date(createdAt))
					
					return (
						<div className={styles.order} key={id}
						onClick={() => handleOrder(id)} onMouseEnter={() => setHoverOrder(id)}
						onMouseLeave={() => setHoverOrder(undefined)}>
							<div className={styles.background}>
								<div className={styles.icon}>
									<TbDisc />
								</div>
							</div>
							<div className={styles.orderTitle}>
								<div className={styles.orderId}>
									Order #{id}
								</div>
								<div className={styles.date}>
									{date}
								</div>
							</div>
							<div className={styles.bottom}>
								<div className={styles.info}>
									<div className={styles.total}>
										<TbDisc /> {total}
									</div>
									<div className={styles.amount}>
										<TbCurrencyDollar /> {amount}
									</div>
								</div>
								<motion.button animate={{ y: hoverOrder == id ? 0 : 100 }}>
									<TbChevronRight />
								</motion.button>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
} 

export default Orders