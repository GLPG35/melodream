import { TbAlertCircle, TbAlertTriangle, TbCircleCheck, TbX } from 'react-icons/tb'
import { motion } from 'framer-motion'
import styles from './styles.module.scss'
import { useEffect, useRef, useState } from 'react'
import { AlertIcon } from '../../types'

const Alert = ({ icon, text, callback }: { icon: AlertIcon, text: string, callback: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const timer = useRef<number | null>(null)
	const progressTimer = useRef<number | null>(null)
	const [progress, setProgress] = useState(0)
	const iconOptions = {
		'success': <TbCircleCheck />,
		'error': <TbAlertCircle />,
		'warn': <TbAlertTriangle />,
	}
	const renderIcon = iconOptions[icon]

	useEffect(() => {
		timer.current = window.setTimeout(() => {
			callback(false)
		}, 2000)

		progressTimer.current = window.setInterval(() => {
			if (progress < 100) {
				setProgress(prev => prev + 2.5)
			}
		}, 50)

		return () => {
			if (timer.current) {
				clearTimeout(timer.current)
			}

			if (progressTimer.current) {
				clearInterval(progressTimer.current)
			}
		}
	}, [])
	
	const handleMouseEnter = () => {
		if (timer.current) {
			clearTimeout(timer.current)
		}

		if (progressTimer.current) {
			setProgress(0)
			clearInterval(progressTimer.current)
		}
	}
	
	const handleMouseLeave = () => {
		if (timer.current) {
			timer.current = window.setTimeout(() => {
				callback(false)
			}, 2000)
		}

		if (progressTimer.current) {
			progressTimer.current = window.setInterval(() => {
				if (progress < 100) {
					setProgress(prev => prev + 1)
				}
			}, 20)
		}
	}
	
	return (
		<div className={styles.alertContainer}>
			<motion.div initial={{translateX: '100vw'}} animate={{translateX: 0}}
			exit={{translateX: '120vw'}} transition={{type: 'spring', duration: 0.8}}
			className={styles.alert} onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
				<div className={styles.icon}>
					{renderIcon}
				</div>
				<div className={styles.text}>
					{text}
				</div>
				<div className={styles.dismiss} onClick={() => callback(false)}>
					<TbX />
				</div>
				<div className={styles.progressBar}>
					<div className={styles.progress} style={{width: `${progress}%`}}></div>
				</div>
			</motion.div>
		</div>
	)
}

export default Alert