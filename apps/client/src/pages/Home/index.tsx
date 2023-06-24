import Wave from '../../components/Wave'
import { TbChevronDown } from 'react-icons/tb'
import styles from './styles.module.scss'
import ProductContainer from '../../components/ProductContainer'
import { useEffect, useState } from 'react'
import { manageProduct } from '../../utils/server'
import { Product } from '../../types'
import BigSearchBar from '../../components/BigSearchBar'

const Home = () => {
	const [products, setProducts] = useState<Product[]>()
	
	useEffect(() => {
		manageProduct(true)
		.then(products => {
			setProducts(products.docs)
		})
	}, [])

	return (
		<div className={styles.container1}>
			<div className={styles.hero}>
				<h1>Melodream</h1>
				<span>the music you always wanted</span>
				<BigSearchBar />
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