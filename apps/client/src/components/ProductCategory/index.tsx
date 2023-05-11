import { useEffect, useState } from 'react'
import ProductContainer from '../ProductContainer'
import { Product } from '../../types'
import { useNavigate } from 'react-router-dom'
import { queryProduct } from '../../utils/server'
import NoProducts from '../NoProducts'

const ProductCategory = ({ cid }: { cid: string }) => {
	const navigate = useNavigate()
	const [products, setProducts] = useState<Product[]>([])

	useEffect(() => {
		if (cid) {
			if (!products.length) {
				queryProduct('category', cid)
				.then(products => {
					setProducts(products.docs)
				})
				.catch(console.error)
			}
		} else {
			navigate('/')
		}
	}, [])
	
	return (
		<>
			{products.length > 0 ?
				<ProductContainer products={products} title={products[0].category.name} color='secondary' />
			:
				<NoProducts title='There are no products available' message='Please choose another category from the top bar'
				style={{ height: 'calc(100vh - 10em)' }} />
			}
		</>
	)
}

export default ProductCategory