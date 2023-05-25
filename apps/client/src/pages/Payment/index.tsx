import { Outlet } from 'react-router-dom'
import styles from './styles.module.scss'

const Payment = () => {
	return (
		<div className={styles.payment}>
			<Outlet />
		</div>
	)
}

export default Payment