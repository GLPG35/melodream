import CartIcon from '../CartIcon'
import MelodreamIcon from '../MelodreamIcon'
import UserIcon from '../UserIcon'
import styles from './styles.module.scss'

const Header = () => {
	return (
		<div className={styles.header}>
			<div className={styles.innerHeader}>
				<div className={styles.icon}>
					<MelodreamIcon className={styles.melodreamIcon} />
				</div>
				<nav>
					<ul>
						<li>
							<a href="#">Home</a>
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