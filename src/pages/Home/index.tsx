import Wave from '../../components/Wave'
import { TbChevronDown, TbSearch } from 'react-icons/tb'
import styles from './styles.module.scss'

const Home = () => {
	return (
		<div className={styles.container1}>
			<div className={styles.hero}>
				<h1>Melodream</h1>
				<span>the music you always wanted</span>
				<div className={styles.bigSearchBar}>
					<div className={styles.searchIcon}>
						<TbSearch />
					</div>
					<input autoFocus type="text" placeholder='Search for music...' />
				</div>
				<div className={styles.waveBg}>
					<div className={styles.wave}>
						<Wave style={{width: '100%', height: '100%'}} />
					</div>
				</div>
				<a className={styles.scrollButton}>
					<TbChevronDown />
				</a>
			</div>
			<div className={styles.categories}>
				
			</div>
		</div>
	)
}

export default Home