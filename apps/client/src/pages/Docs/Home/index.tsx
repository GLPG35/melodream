import styles from './styles.module.scss'

const DocsHome = () => {
	return (
		<div className={styles.home}>
			<div className={styles.title}>
				<h1>Melodream API</h1>
			</div>
			<div className={styles.info}>
				<p>The Melodream API allows the interaction with the Melodream store without requiring the use of an external site.</p>
				<p>If you want to know the specifications of any route and how they work, just click on any of the options on the left menu.</p>
			</div>
		</div>
	)
}

export default DocsHome