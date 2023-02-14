import { TbUser } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'

const UserIcon = () => {
	const navigate = useNavigate()
	
	return (
		<div className={styles.userIcon} onClick={() => navigate('/login')}>
			<TbUser />
		</div>
	)
}

export default UserIcon	