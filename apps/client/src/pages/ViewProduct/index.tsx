import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NoProducts from '../../components/NoProducts'
import ProductDetails from '../../components/ProductDetails'
import { Product } from '../../types'
import { manageProduct } from '../../utils/server'
import styles from './styles.module.scss'

const ViewProduct = () => {
	const [product, setProduct] = useState<Product | null>()
	const { pid } = useParams()

	useEffect(() => {
		if (pid) {
			manageProduct(pid)
			.then(product => {
				setProduct(product)
			}).catch(() => {
				setProduct(null)
			})
		}
	}, [])

	return (
		<div className={styles.viewProduct}>
			{product === undefined ? ''
			: product ? <ProductDetails product={product} />
			: <NoProducts style={{ height: 'calc(100vh - 5em)' }} title="This product doesn't exist!"
				message='Please select another product from the home page' />
			}
		</div>
	)
}

export default ViewProduct