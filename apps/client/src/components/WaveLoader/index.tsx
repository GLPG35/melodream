import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.scss'

const WaveLoader = ({ end, callback, render }: {
	end: boolean,
	callback: React.Dispatch<React.SetStateAction<boolean>>,
	render?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const [wait, setWait] = useState(false)
	const waveRef = useRef<HTMLDivElement>(null)
	
	useEffect(() => {
		const time = setTimeout(() => {
			setWait(true)
			render && render(true)
		}, 2000)

		return () => clearTimeout(time)
	}, [])
	
	useEffect(() => {
		if (end && wait) {
			if (waveRef.current) {
				waveRef.current.animate([
					{
						transform: 'translateY(4%)'
					},
					{
						transform: 'translateY(100%)'
					}
				], {
					duration: 2000,
					easing: 'cubic-bezier(0.65,0.05,0.36,1)'
				}).addEventListener('finish', () => {
					if (waveRef.current) {
						waveRef.current.style.display = 'none'
					}
					callback(false)
				})
			}
		}
	}, [end, wait])

	return (
		<div className={styles.waveLoader}>
			<div className={styles.wave} ref={waveRef}>
				<div className={styles.realWave}></div>
			</div>
		</div>
	)
}

export default WaveLoader