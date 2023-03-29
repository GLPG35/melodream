import { Product } from '../../types'
import ProductItem from '../ProductItem'
import styles from './styles.module.scss'

const ProductContainer = ({ products, title, id }: { products: Product[] | undefined, title: string, id?: string }) => {
	return (
		<div className={styles.productContainer} id={id}>
			<div className={styles.title}>
				{title}
			</div>
			<div className={styles.products}>
				{products &&
					products.map(product => (
						<ProductItem key={product.id} product={product} />
					))
				}
			</div>
		</div>
	)
}

export default ProductContainer