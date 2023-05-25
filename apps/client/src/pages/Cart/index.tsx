import { useEffect, useState, useContext } from 'react'
import CartList from '../../components/CartList'
import { Product } from '../../types'
import { changeProductQtty, manageCart, manageCartTotal } from '../../utils/server'
import styles from './styles.module.scss'
import { resolveCid, saveQuantity } from '../../utils/client'
import { globalContext } from '../../App'
import NoProducts from '../../components/NoProducts'
import { TbHome } from 'react-icons/tb'
import Spinner from '../../components/Spinner'

const Cart = () => {
	const { user, callAlert, updateCartCount } = useContext(globalContext)
	const [products, setProducts] = useState<{product: Product, quantity: number}[]>()
	const [total, setTotal] = useState(0)
	const [spinner, setSpinner] = useState(false)
	const [cid, setCid] = useState('')

	useEffect(() => {
		if (user === undefined) return

		resolveCid(user).then(cid => {
			setCid(cid)

			manageCart(cid)
			.then(res => {
				setProducts(res.products)
			})
		})
	}, [user])

	useEffect(() => {
		if (user === undefined) return

		resolveCid(user).then(cid => {
			manageCartTotal(cid)
			.then(res => {
				setTotal(res)
			})
		})
	}, [products])

	const handleDelete = async (id: string) => {
		await manageCart(cid, id, {}, 'DELETE')
		.then(res => {
			callAlert('success', res.message)
		}).catch(err => {
			callAlert('error', err.message)
		})

		manageCart(cid)
		.then(res => {
			setProducts(res.products)
		})

		manageCart(cid, true)
		.then(res => {
			saveQuantity(+res.count, updateCartCount)
		})

		manageCartTotal(cid)
		.then(res => {
			setTotal(res)
		})
	}

	const handleQtty = async (id: string, type: 'add' | 'sub') => {
		setSpinner(true)

		await changeProductQtty(cid, id, type)
		.then(res => {
			saveQuantity(+res.count, updateCartCount)
		}).catch(err => {
			callAlert('error', err.message)
		})

		manageCart(cid)
		.then(res => {
			setSpinner(false)
			setProducts(res.products)
		})

		manageCartTotal(cid)
		.then(res => {
			setTotal(res)
		})
	}

	const callbacks = {
		handleDelete,
		handleQtty
	}

	return (
		<div className={styles.cart}>
			<div className={styles.title}>
				Cart
			</div>
			{(products === undefined || spinner) &&
				<div className={styles.spinner}>
					<Spinner color='secondary' background style={{ height: '100%' }} />
				</div>
			}
			{(products !== undefined && products.length > 0) ?
				<CartList products={products} callbacks={callbacks} total={total} />
			: (products !== undefined && !products.length) &&
				<NoProducts title='Your cart is empty!' icon='cart' message='Go add some albums to it!'
				buttonLink='/' buttonMsg='Home' buttonIcon={<TbHome />} />
			}
		</div>
	)
}

export default Cart