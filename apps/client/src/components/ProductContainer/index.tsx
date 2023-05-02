import { AnimatePresence } from 'framer-motion'
import { Product } from '../../types'
import ProductItem from '../ProductItem'
import Spinner from '../Spinner'
import styles from './styles.module.scss'

const ProductContainer = ({ products, title, id }: { products: Product[] | undefined, title: string, id?: string }) => {
	return (
		<div className={styles.productContainer} id={id}>
			<div className={styles.title}>
				{title}
			</div>
			<div className={styles.products}>
				<AnimatePresence mode='wait'>
					{products ?
						products.map((product, index) => {
							const delay = index === 0 ? 0 : (index + 1) / 10

							return <ProductItem key={product.id} delay={delay} product={product} />
						})
					: products === undefined &&
						<Spinner />
					}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default ProductContainer