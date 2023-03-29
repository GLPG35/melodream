import { CSSProperties } from 'react'
import { TbFilesOff } from 'react-icons/tb'
import styles from './styles.module.scss'

const NoProducts = ({ title, message, style }: { title: string, message: string, style?: CSSProperties }) => {
	return (
		<div className={styles.noProducts} style={style}>
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