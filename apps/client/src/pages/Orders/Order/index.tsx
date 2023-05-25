import { Link, useParams } from 'react-router-dom'
import styles from './styles.module.scss'
import { useContext, useEffect, useState } from 'react'
import { manageOrder } from '../../../utils/server'
import { globalContext } from '../../../App'
import { Order } from '../../../types'
import { TbChevronLeft } from 'react-icons/tb'

const Order = () => {
	const { oid } = useParams()
	const { user } = useContext(globalContext)
	const [order, setOrder] = useState<Order>()

	useEffect(() => {
		if (oid && user) {
			manageOrder(user.email, oid)
			.then(res => {
				setOrder(res)
			}).catch
		}
	}, [user])

	return (
		<div className={styles.order}>
			<div className={styles.title}>
				<span>Order</span>
				<Link to={'/orders'}>
					<TbChevronLeft /> Orders
				</Link>
			</div>
			{order &&
				<div className={styles.orderInfo} key={order.id}>
					<div className={styles.orderTitle}>
						<div className={styles.orderId}>
							Order #{order.id}
						</div>
						<div className={styles.date}>
							{new Intl.DateTimeFormat('en-UK', {
								dateStyle: 'medium',
								timeStyle: 'short'
							}).format(new Date(order.createdAt))}
						</div>
					</div>
				</div>
			}
		</div>
	)
}

export default Order