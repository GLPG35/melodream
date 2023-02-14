import { FormEvent, useContext, useEffect, useState } from 'react'
import { TbAlertTriangle, TbCurrencyDollar, TbPackage } from 'react-icons/tb'
import WaveLoader from '../../../components/WaveLoader'
import { Product } from '../../../types'
import { manageProduct } from '../../../utils/server'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './styles.module.scss'
import { globalContext } from '../../../App'
import NoProducts from '../../../components/NoProducts'

const DeleteProduct = () => {
	const [finish, setFinish] = useState(false)
	const [loader, setLoader] = useState(false)
	const [render, setRender] = useState(false)
	const [products, setProducts] = useState<Product[]>()
	const [selectedId, setSelectedId] = useState<number>()
	const [selectedProduct, setSelectedProduct] = useState<Product>()
	const { callAlert } = useContext(globalContext)

	useEffect(() => {
		if (!products) {
			setLoader(true)

			manageProduct()
			.then(products => {
				setProducts(products.reverse())
				setFinish(true)
			})
		}
	}, [])

	const handleSelectProduct = (id: number) => {
		if (products) {
			setSelectedId(id)
			setSelectedProduct(products.find(x => x.id == id))
		}
	}

	const resetSelectedProduct = () => {
		setSelectedId(undefined)
		setSelectedProduct(undefined)
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (selectedId) {
			setLoader(true)

			manageProduct(selectedId, 'DELETE')
			.then(res => {
				setTimeout(() => {
					resetSelectedProduct()

					manageProduct()
					.then(products => {
						setProducts(products)
						setFinish(true)
					})

					callAlert('success', res.message)
				}, 2000)
			}).catch(err => {
				setTimeout(() => {
					resetSelectedProduct()
					setFinish(true)

					callAlert('error', err.message)
				}, 2000)
			})
		}
	}
	
	return (
		<div className={styles.deleteProduct}>
			<div className={styles.topBar}>
				<h2>Delete Product</h2>
			</div>
			{loader && <WaveLoader end={finish} callback={setLoader} render={setRender} />}
			{products && products.length > 0 ?
				<div className={styles.productsList}>
					{render &&
						<>
							{products.map(({ id, title, thumbnails, price, stock }) => {
								return (
									<motion.div key={id} layoutId={`${id}`} className={styles.product}
									onClick={() => handleSelectProduct(id)}>
										<div className={styles.pic}>
											<img src={thumbnails[0]} alt="" />
										</div>
										<div className={styles.info}>
											<div className={styles.title}>
												{title}
											</div>
											<div className={styles.extraInfo}>
												<div className={styles.price}>
													<TbCurrencyDollar /> {price}
												</div>
												<div className={styles.stock}>
													<TbPackage /> {stock}
												</div>
											</div>
										</div>
									</motion.div>
								)
							})}
							<AnimatePresence>
								{selectedId && selectedProduct &&
									<motion.form className={styles.productWrapper}
									initial={{ opacity: 0 }} animate={{ opacity: 1 }}
									exit={{ opacity: 0 }} onClick={resetSelectedProduct}
									onSubmit={handleSubmit}>
										<motion.div layoutId={`${selectedId}`}
										className={styles.viewProduct} onClick={(e) => e.stopPropagation()}>
											<div className={styles.productInfo}>
												<div className={styles.pic}>
													<img src={selectedProduct.thumbnails[0]} alt="" />
												</div>
												<div className={styles.info}>
													<div className={styles.title}>
														{selectedProduct.title}
													</div>
													<div className={styles.extraInfo}>
														<div className={styles.price}>
															<TbCurrencyDollar /> {selectedProduct.price}
														</div>
														<div className={styles.stock}>
															<TbPackage /> {selectedProduct.stock}
														</div>
													</div>
												</div>
											</div>
											<div className={styles.confirmation}>
												<div className={styles.infoWrapper}>
													<div className={styles.icon}>
														<TbAlertTriangle />
													</div>
													<div className={styles.text}>
														Are you sure to delete this product?
													</div>
												</div>
												<div className={styles.buttons}>
													<button className={styles.yes}
													type='submit'>
														Yes
													</button>
													<button type='button' className={styles.no}
													onClick={resetSelectedProduct}>
														No
													</button>
												</div>
											</div>
										</motion.div>
									</motion.form>
								}
							</AnimatePresence>
						</>
					}
				</div>
			: render &&
				<NoProducts title='There are no products!'
				message='Please add a product to see more options' />
			}
		</div>
	)
}

export default DeleteProduct