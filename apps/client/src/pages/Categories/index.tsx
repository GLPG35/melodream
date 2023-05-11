import { useParams } from 'react-router-dom'
import styles from './styles.module.scss'
import ProductCategory from '../../components/ProductCategory'

const Categories = () => {
	const { cid } = useParams()

	return (
		<div className={styles.categories}>
			{cid && <ProductCategory key={cid} cid={cid} />}
		</div>
	)
}

export default Categories