import { TbHeadphonesOff, TbHome } from 'react-icons/tb'
import styles from './styles.module.scss'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
	const navigate = useNavigate()

	return (
		<div className={styles.notFound}>
			<div className={styles.icon}>
				<TbHeadphonesOff />
			</div>
			<div className={styles.title}>
				Page not found!
			</div>
			<div className={styles.message}>
				Please check the URL or go back to the home page
			</div>
			<button onClick={() => navigate('/', { replace: true })}>
				<TbHome /> Go home
			</button>
		</div>
	)
}

export default NotFound