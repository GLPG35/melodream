import styles from './styles.module.scss'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import docs from './docs.json'
import { TbChevronLeft, TbSearch } from 'react-icons/tb'
import { useState } from 'react'
import DocsHome from './Home'
import DocsPath from './Path'

const Docs = () => {
	const { paths, components } = docs
	const [options, setOptions] = useState<string[]>([])
	const [selected, setSelected] = useState<{path: string, method: any}>()

	const handleSearch = () => {

	}
	
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

	return (
		<div className={styles.docs}>
			<motion.div layoutScroll className={styles.sidebar}>
				<div className={styles.search}>
					<div className={styles.icon}>
						<TbSearch />
					</div>
					<input type="text" onChange={handleSearch} placeholder='Search...' />
				</div>
				<div className={styles.optionsWrapper}>
					<motion.div layoutScroll className={styles.options}>
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
												<motion.div className={styles.details} layout exit={{ height: 0 }}>
													{Object.entries(routes).map(([route, method]) => {
														return Object.entries(method).map(([name, info]: [name: string, info: any]) => {
															return (
																<div className={styles.route} key={route + name}
																onClick={() => setSelected({path: route, method: { [name]: info }})}>
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
				</div>
			</motion.div>
			<div className={styles.main}>
				{!selected ?
					<DocsHome />
				:
					<DocsPath key={selected.path + Object.keys(selected.method)[0]} selectedPath={selected} changeSelection={setSelected} components={components} />
				}
			</div>
		</div>
	)
}

export default Docs