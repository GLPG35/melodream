import { Link, useParams } from 'react-router-dom'
import styles from './styles.module.scss'
import { useContext, useEffect, useState } from 'react'
import { manageOrder } from '../../../utils/server'
import { globalContext } from '../../../App'
import { Order } from '../../../types'
import { TbChevronLeft, TbTicket } from 'react-icons/tb'
import Spinner from '../../../components/Spinner'
import NoProducts from '../../../components/NoProducts'

const Order = () => {
	const { oid } = useParams()
	const { user } = useContext(globalContext)
	const [order, setOrder] = useState<Order | null>()

	useEffect(() => {
		if (oid && user) {
			manageOrder(user.email, oid)
			.then(res => {
				setOrder(res)
			}).catch(() => {
				setOrder(null)
			})
		}
	}, [user])

	return (
		<div className={styles.order}>
			<div className={styles.title}>
				<span>Order</span>
				{order &&
					<Link to={'/orders'}>
						<TbChevronLeft /> Orders
					</Link>
				}
			</div>
			{order === undefined ?
				<div className={styles.spinner}>
					<Spinner color='secondary' background style={{ height: '100%' }} />
				</div>
			: order ?
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
			:
				<NoProducts title='Order not found' message='Please check your orders and try again'
				icon='order' buttonIcon={<TbTicket />} buttonMsg='Go to orders' buttonLink='/orders' />
			}
		</div>
	)
}

export default Order