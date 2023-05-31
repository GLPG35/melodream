import { Link, useParams } from 'react-router-dom'
import styles from './styles.module.scss'
import { useContext, useEffect, useState } from 'react'
import { manageOrder } from '../../../utils/server'
import { globalContext } from '../../../App'
import { Order } from '../../../types'
import { TbChevronLeft, TbCurrencyDollar, TbDisc, TbTicket } from 'react-icons/tb'
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
					<div className={styles.topBar}>
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
						<div className={styles.summary}>
							<div className={styles.quantity}>
								<TbDisc /> {order.products.reduce((prev, curr) => prev + curr.quantity, 0)}
							</div>
							<div className={styles.price}>
								<TbCurrencyDollar /> {order.amount}
							</div>
						</div>
					</div>
					<div className={styles.details}>
						<div className={styles.productsListWrapper}>
							<div className={styles.listTitle}>
								Products
							</div>
							<div className={styles.productsList}>
								{order.products.map(({ product, quantity }) => {
									return (
										<div className={styles.product} key={product.id}>
											<div className={styles.pic}>
												<img src={product.thumbnails[0]} alt="" />
											</div>
											<div className={styles.productDetails}>
												<div className={styles.productTitle}>
													{product.title}
												</div>
												<div className={styles.extraInfo}>
													<div className={styles.price}>
														<TbCurrencyDollar /> {product.price}
													</div>
													<div className={styles.quantity}>
														<TbDisc /> {quantity}
													</div>
												</div>
											</div>
										</div>
									)
								})}
							</div>
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