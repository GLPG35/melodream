import { useContext, useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { manageOrder } from '../../utils/server'
import { globalContext } from '../../App'
import { Order } from '../../types'
import { TbChevronRight, TbCurrencyDollar, TbDisc, TbHome2, TbShoppingCart } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import NoProducts from '../../components/NoProducts'
import Spinner from '../../components/Spinner'

const Orders = () => {
	const { user, cartCount } = useContext(globalContext)
	const [orders, setOrders] = useState<Order[]>()
	const [hoverOrder, setHoverOrder] = useState<string>()
	const navigate = useNavigate()
	
	useEffect(() => {
		if (orders === undefined && user) {
			manageOrder(user.email)
			.then(res => {
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
			{orders === undefined ?
				<div className={styles.spinner}>
					<Spinner color='secondary' background style={{ height: '100%' }} />
				</div>
			: orders.length > 0 ?
				<div className={styles.ordersList}>
					{orders.map(({ id, amount, createdAt, products }) => {
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
									<motion.button initial={{ y: 100 }} animate={{ y: hoverOrder == id ? 0 : 100 }}>
										<TbChevronRight />
									</motion.button>
								</div>
							</div>
						)
					})}
				</div>
			:
				<NoProducts title="You haven't purchased anything yet"
				message={cartCount ? 'Please complete the pending purchase' : 'Go fill your cart with some albums'}
				buttonIcon={cartCount ? <TbShoppingCart /> : <TbHome2 />}
				buttonMsg={cartCount ? 'Go to cart' : 'Go home'}
				buttonLink={cartCount ? '/cart' : '/'}
				icon='order' />
			}
		</div>
	)
} 

export default Orders