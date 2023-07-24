import { useContext, useEffect } from 'react'
import styles from './styles.module.scss'
import { globalContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import { TbCash, TbDeviceDesktopAnalytics, TbMessages } from 'react-icons/tb'
import { manageSuperstar, manageUser } from '../../utils/server'

const Superstar = () => {
	const { user, callAlert, setUser } = useContext(globalContext)
	const navigate = useNavigate()
	
	useEffect(() => {
		if ((user && user.userType !== 'user') || user === null) navigate('/', { replace: true })
	}, [user])

	const handleConfirm = () => {
		if (!user) return

		manageSuperstar(user.email)
		.then(() => {
			manageUser(true)
			.then(() => {
				setUser(null)

				localStorage.removeItem('cart')
				localStorage.removeItem('cartQtty')

				navigate('/login')
			})
		}).catch(err => {
			callAlert('error', err.message)
		})
	}
	
	return (
		<div className={styles.superstar}>
			{user && user.userType === 'user' &&
				<div className={styles.plan}>
					<div className={styles.title}>
						<h2>Become a Superstar member</h2>
						<span>As a Superstar member you can:</span>
					</div>
					<ul>
						<li>
							<div className={styles.icon}>
								<TbCash />
							</div>
							<div className={styles.info}>
								<h3>Sell your own albums</h3>
								<span>You will be able to sell any music album you want, at your own price</span>
							</div>
						</li>
						<li>
							<div className={styles.icon}>
								<TbDeviceDesktopAnalytics />
							</div>
							<div className={styles.info}>
								<h3>Track your sales</h3>
								<span>With your own dashboard you can track how well your items are selling</span>
							</div>
						</li>
						<li>
							<div className={styles.icon}>
								<TbMessages />
							</div>
							<div className={styles.info}>
								<h3>Direct communication</h3>
								<span>Chat directly with your clients or with the Melodream support</span>
							</div>
						</li>
					</ul>
					<button onClick={handleConfirm}>Become a member</button>
					<span className={styles.smallInfo}>After this you will be redirected to the login page to reflex the changes</span>
				</div>
			}
		</div>
	)
}

export default Superstar