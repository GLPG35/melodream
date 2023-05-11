import CartIcon from '../CartIcon'
import HeaderSearch from '../HeaderSearch'
import MelodreamIcon from '../MelodreamIcon'
import UserIcon from '../UserIcon'
import styles from './styles.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { TbChevronLeft } from 'react-icons/tb'
import { useEffect, useState } from 'react'
import { manageCategory } from '../../utils/server'
import { Category } from '../../types'

const Header = () => {
	const navigate = useNavigate()
	const [active, setActive] = useState(false)
	const [categories, setCategories] = useState<Category[]>([])

	useEffect(() => {
		if (!categories.length) {
			manageCategory()
			.then(setCategories)
		}
	}, [])

	const chooseCategory = (link: string) => {
		navigate(link)

		setActive(false)
	}

	return (
		<div className={styles.header}>
			<AnimatePresence mode='wait'>
				{active &&
					<motion.div className={styles.categoriesContainer}
					initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<motion.div className={styles.categoriesWrapper}
						initial={{ y: '100%' }}
						animate={{ y: 0, transition: { ease: [0.65,0.05,0.36,1], duration: 0.7 } }}
						exit={{ y: '100%', transition: { ease: [0.65,0.05,0.36,1], duration: 0.7 } }}>
							<motion.div className={styles.categories}>
								{categories.map((cat, index) => {
									const delay = (index / 10) + 0.8

									return (
										<motion.div key={index} className={styles.category}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1, transition: { delay } }}
										onClick={() => chooseCategory(`/categories/${cat.id}`)}>
											{cat.name}
										</motion.div>
									)
								})}
							</motion.div>
							<div className={styles.waveBg}></div>
						</motion.div>
					</motion.div>
				}
			</AnimatePresence>
			<div className={styles.innerHeader}>
				<div className={styles.icon} onClick={() => navigate('/')}>
					<MelodreamIcon className={styles.melodreamIcon} />
				</div>
				<nav>
					<ul>
						<li>
							<Link to={'/'}>Home</Link>
						</li>
						<li>
							<div className={styles.categories}
							onClick={() => setActive(!active)}>
								<a>Categories</a>
								<motion.div className={styles.arrow}
								animate={{ rotate: active ? -90 : 0 }}>
									<TbChevronLeft />
								</motion.div>
							</div>
						</li>
						<li>
							<a href="#">Sales</a>
						</li>
					</ul>
				</nav>
				<div className={styles.userActions}>
					<HeaderSearch />
					<UserIcon />
					<CartIcon />
				</div>
			</div>
		</div>
	)
}

export default Header