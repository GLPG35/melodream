import Wave from '../../components/Wave'
import { TbChevronDown, TbSearch } from 'react-icons/tb'
import styles from './styles.module.scss'
import ProductContainer from '../../components/ProductContainer'
import { useEffect, useState } from 'react'
import { manageProduct } from '../../utils/server'
import { Product } from '../../types'

const Home = () => {
	const [products, setProducts] = useState<Product[]>()

	useEffect(() => {
		manageProduct()
		.then(products => {
			setProducts(products.docs)
		})
	}, [])

	return (
		<div className={styles.container1}>
			<div className={styles.hero}>
				<h1>Melodream</h1>
				<span>the music you always wanted</span>
				<div className={styles.bigSearchBar}>
					<div className={styles.searchIcon}>
						<TbSearch />
					</div>
					<input autoFocus type="text" placeholder='Search for music...' />
				</div>
				<div className={styles.waveBg}>
					<div className={styles.wave}>
						<Wave />
					</div>
				</div>
				<a className={styles.scrollButton}
				href='#products'>
					<TbChevronDown />
				</a>
			</div>
			<div className={styles.categories}>
				<ProductContainer products={products} title={'Most recent'} id='products' />
			</div>
		</div>
	)
}

export default Home