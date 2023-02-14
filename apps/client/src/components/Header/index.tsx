import CartIcon from '../CartIcon'
import MelodreamIcon from '../MelodreamIcon'
import UserIcon from '../UserIcon'
import styles from './styles.module.scss'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
	const navigate = useNavigate()

	return (
		<div className={styles.header}>
			<div className={styles.innerHeader}>
				<div className={styles.icon} onClick={() => navigate('/')}>
					<MelodreamIcon className={styles.melodreamIcon} />
				</div>
				<nav>
					<ul>
						<li>
							<Link to={'/'}>Home</Link>
						</li>
						<li>
							<a href="#">Categories</a>
						</li>
						<li>
							<a href="#">Sales</a>
						</li>
					</ul>
					<UserIcon />
					<CartIcon />
				</nav>
			</div>
		</div>
	)
}

export default Header