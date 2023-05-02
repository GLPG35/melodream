import styles from './styles.module.scss'
import { motion } from 'framer-motion'

const Spinner = () => {
	return (
		<motion.div className={styles.spinnerContainer}
		exit={{ opacity: 0 }}>
			<div className={styles.spinner}>
			</div>
		</motion.div>
	)
}

export default Spinner