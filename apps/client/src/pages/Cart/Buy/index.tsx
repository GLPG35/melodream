import { Link, useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'
import { TbChevronLeft, TbDisc, TbShoppingCart } from 'react-icons/tb'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { globalContext } from '../../../App'
import { manageCart, manageCartTotal, manageOrder } from '../../../utils/server'
import { resolveCid } from '../../../utils/client'
import { Product } from '../../../types'
import { motion } from 'framer-motion'

const Buy = () => {
	const { user, callAlert, updateCartCount } = useContext(globalContext)
	const [products, setProducts] = useState<{product: Product, quantity: number}[]>()
	const [total, setTotal] = useState(0)
	const navigate = useNavigate()
	
	useEffect(() => {
		if (!user) navigate('/login?redirect=cart', { replace: true })

		resolveCid(user)
		.then(cid => {
			manageCart(cid)
			.then(cart => {
				setProducts(cart.products)
			})

			manageCartTotal(cid)
			.then(total => {
				setTotal(total)
			})
		})
	}, [user])

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { phone, street, streetNumber } = e.currentTarget

		if (user) {
			resolveCid(user)
			.then(cid => {
				const email = user.email
				const userInfo = {
					phone: phone.value,
					street: `${street.value} ${streetNumber.value}`
				}

				manageOrder(cid, email, userInfo)
				.then(() => {
					updateCartCount(undefined)

					navigate('/payment/success')
				}).catch(err => {
					callAlert('error', err.message)
					navigate('/cart')
				})
			})
		}
	}

	return (
		<div className={styles.buy}>
			<div className={styles.title}>
				<span>Buy</span>
				<div className={styles.back}>
					<Link to={'/cart'}><TbChevronLeft /> Back to cart</Link>
				</div>
			</div>
			<form onSubmit={handleSubmit}>
				<div className={styles.info}>
					<div className={styles.fieldsWrapper}>
						<div className={styles.title}>
							Additional data
						</div>
						<div className={styles.fields}>
							<div className={styles.field}>
								<label htmlFor="phone">Phone</label>
								<input type="tel" name='phone' id='phone' required />
							</div>
							<div className={styles.field}>
								<label htmlFor="street">Street</label>
								<input type="text" name='street' id='street' required />
							</div>
							<div className={styles.field}>
								<label htmlFor="streetNumber">Street Nº</label>
								<input type="number" name='streetNumber' id='streetNumber' required />
							</div>
						</div>
					</div>
				</div>
				<div className={styles.complete}>
					<div className={styles.title}>
						Confirm payment
					</div>
					<div className={styles.previews}>
						{products && products.map(({ product }, index) => {
							if (index > 4) return
							
							return (
								<div className={styles.pic} key={product.id}>
									<img src={product.thumbnails[0]} alt="" />
								</div>
							)
						})}
					</div>
					<div className={styles.albumsInfo}>
						<TbDisc /> {products && products.reduce((prev, curr) => prev + curr.quantity, 0)} albums
					</div>
					<div className={styles.total}>
						<span>Total</span>
						<span>${total}</span>
					</div>
					<motion.button whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }} type='submit'>
						<TbShoppingCart /> Confirm purchase
					</motion.button>
				</div>
			</form>
		</div>
	)
}

export default Buy