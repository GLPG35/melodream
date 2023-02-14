import { TbFilesOff } from 'react-icons/tb'
import styles from './styles.module.scss'

const NoProducts = ({ title, message }: { title: string, message: string }) => {
	return (
		<div className={styles.noProducts}>
			<div className={styles.icon}>
				<TbFilesOff />
			</div>
			<div className={styles.title}>
				{title}
			</div>
			<div className={styles.text}>
				{message}
			</div>
		</div>
	)
}

export default NoProducts