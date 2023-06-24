import { AnimatePresence } from 'framer-motion'
import { Product } from '../../types'
import ProductItem from '../ProductItem'
import Spinner from '../Spinner'
import styles from './styles.module.scss'

const ProductContainer = ({ products, title, id, color = 'primary' }: { products: Product[] | undefined, title: string, id?: string, color?: 'primary' | 'secondary' }) => {
	return (
		<div className={styles.productContainer} id={id}>
			<div className={styles.title} style={{ color: color == 'primary' ? 'var(--bg-color)' : 'var(--accent-color)' }}>
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
						<Spinner style={{ gridColumn: '1 / -1' }} />
					}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default ProductContainer