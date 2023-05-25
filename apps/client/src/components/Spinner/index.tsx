import styles from './styles.module.scss'
import { MotionStyle, motion } from 'framer-motion'

const Spinner = ({ color = 'primary', background, style }: { color?: 'primary' | 'secondary', background?: boolean, style?: MotionStyle }) => {
	return (
		<motion.div className={styles.spinnerContainer}
		exit={{ opacity: 0 }} data-background={background}
		style={style}>
			<div className={styles.spinner} data-color={color}>
			</div>
		</motion.div>
	)
}

export default Spinner