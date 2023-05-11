import { TbSearch } from 'react-icons/tb'
import styles from './styles.module.scss'
import useDebounce from '../../hooks/useDebounce'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { manageSearch } from '../../utils/server'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const HeaderSearch = () => {
	const navigate = useNavigate()
	const [value, setValue] = useState<string>('')
	const [active, setActive] = useState(false)
	const debouncedValue = useDebounce<string>(value, 1000)
	const [productList, setProductList] = useState([])
	const searchInput = useRef<HTMLInputElement>(null)
	const listRef = useRef<HTMLDivElement>(null)

	const clickOutside = (e: globalThis.MouseEvent) => {
		if ((searchInput.current && !searchInput.current.contains(e.target as Node)) ||
		(listRef.current && !listRef.current.contains(e.target as Node))) {
			if (searchInput.current) searchInput.current.value = ''

			setValue('')
			setProductList([])
			setActive(false)
		}
	}
	
	const handleFocus = () => {
		setActive(true)
	}
	
	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
	}

	useEffect(() => {
		if (debouncedValue) {
			if (debouncedValue.length < 2) {
				setProductList([])
			} else {
				manageSearch(debouncedValue)
				.then(products => {
					setProductList(products)
				})
			}
		} else {
			setProductList([])
		}
	}, [debouncedValue])

	useEffect(() => {
		document.addEventListener('click', clickOutside, { capture: true })

		return () => {
			document.removeEventListener('click', clickOutside, { capture: true })
		}
	}, [])

	return (
		<motion.div className={styles.headerSearch}
		animate={{ gap: active ? '1em': 0 }}>
			<TbSearch onClick={() => searchInput.current && searchInput.current.focus()}
			style={{ cursor: 'pointer' }} />
			<div className={styles.searchInput}>
				<motion.input type="text" onInput={handleSearch} ref={searchInput}
				onFocus={handleFocus} animate={{ border: active ? '3px solid var(--accent-color)': 'none',
				width: active ? '12em' : 0, padding: active ? '0.2em 1em' : 0 }} />
			</div>
			<AnimatePresence>
				{productList.length > 0 &&
					<motion.div className={styles.productList} ref={listRef}
					initial={{ height: 0 }} animate={{ height: 'max-content' }} exit={{ height: 0, border: 'none' }}>
						<div className={styles.wrapper}>
							{productList.map(({ id, title, price, thumbnails }) => {
								return (
									<div key={id} className={styles.product}
									onClick={() => navigate(`/product/${id}`)}>
										<div className={styles.pic}>
											<img src={thumbnails[0]} alt='' />
										</div>
										<div className={styles.info}>
											<div className={styles.title}>
												{title}
											</div>
											<div className={styles.price}>
												${price}
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</motion.div>
				}
			</AnimatePresence>
		</motion.div>
	)
}

export default HeaderSearch