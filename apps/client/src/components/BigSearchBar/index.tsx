import { TbSearch } from 'react-icons/tb'
import styles from './styles.module.scss'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import useDebounce from '../../hooks/useDebounce'
import { manageSearch } from '../../utils/server'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const BigSearchBar = () => {
	const navigate = useNavigate()
	const [value, setValue] = useState<string>('')
	const debouncedValue = useDebounce<string>(value, 1000)
	const [productList, setProductList] = useState([])
	const searchRef = useRef<HTMLInputElement>(null)
	const listRef = useRef<HTMLDivElement>(null)

	const clickOutside = (e: globalThis.MouseEvent) => {
		if ((searchRef.current && !searchRef.current.contains(e.target as Node)) ||
		(listRef.current && !listRef.current.contains(e.target as Node))) {
			if (searchRef.current) searchRef.current.value = ''

			setValue('')
			setProductList([])
		}
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
		<div className={styles.bigSearchBar}>
			<div className={styles.searchWrapper}>
				<div className={styles.searchIcon}>
					<TbSearch />
				</div>
				<input autoFocus type="text" ref={searchRef} placeholder='Search for music...'
				onInput={handleSearch} />
			</div>
			<AnimatePresence>
				{productList.length > 0 &&
					<motion.div className={styles.productList}
					initial={{ height: 0, border: 0 }} animate={{ height: 'max-content', border: '5px solid var(--accent-color)' }}
					exit={{ height: 0, border: 0 }} ref={listRef}>
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
		</div>
	)
}

export default BigSearchBar