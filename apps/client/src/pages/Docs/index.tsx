import styles from './styles.module.scss'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import docs from './docs.json'
import { Outlet } from 'react-router-dom'
import { TbChevronLeft, TbSearch } from 'react-icons/tb'
import { useState } from 'react'

const Docs = () => {
	const { paths } = docs
	const [options, setOptions] = useState<string[]>([])

	const changeOption = (tag: string) => {
		const findTag = options.find(x => x == tag)

		if (findTag) {
			const tagIndex = options.findIndex(x => x == tag)
			const cOptions = [...options]

			cOptions.splice(tagIndex, 1)
			setOptions(cOptions)

			return
		}

		setOptions(prev => [...prev, tag])
	}

	const handleSearch = () => {

	}

	return (
		<div className={styles.docs}>
			<motion.div layoutScroll className={styles.sidebar}>
				<div className={styles.search}>
					<div className={styles.icon}>
						<TbSearch />
					</div>
					<input type="text" onChange={handleSearch} placeholder='Search...' />
				</div>
				<LayoutGroup>
					{Object.entries(paths).map(([tag, routes]) => {
						return (
							<motion.div layout className={styles.op} key={tag}>
								<motion.div layout='position' className={styles.name} onClick={() => changeOption(tag)}>
									<span>{tag}</span>
									<motion.div animate={{ rotate: options.includes(tag) ? -90 : 0 }} className={styles.arrow}>
										<TbChevronLeft />
									</motion.div>
								</motion.div>
								<AnimatePresence>
									{options.includes(tag) &&
										<motion.div className={styles.details} layout initial={{ height: 0 }} animate={{ height: 'max-content' }} exit={{ height: 0 }}>
											{Object.entries(routes).map(([route, method]) => {
												return Object.entries(method).map(([name, info]: [name: string, info: any]) => {
													return (
														<div className={styles.route} key={route + name}>
															<div className={styles.summary}>{info.name}</div>
															<div className={`${styles.method} ${styles[name]}`}>{name.toUpperCase()}</div>
														</div>
													)
												})
											})}
										</motion.div>
									}
								</AnimatePresence>
							</motion.div>
						)
					})}
				</LayoutGroup>
			</motion.div>
			<div className={styles.main}>
				<Outlet />
			</div>
		</div>
	)
}

export default Docs