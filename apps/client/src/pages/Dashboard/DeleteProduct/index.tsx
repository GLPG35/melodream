import { FormEvent, useContext, useEffect, useState } from 'react'
import { TbAlertTriangle, TbChevronLeft, TbChevronRight, TbCurrencyDollar, TbPackage } from 'react-icons/tb'
import WaveLoader from '../../../components/WaveLoader'
import { Product } from '../../../types'
import { manageProduct, productsPage } from '../../../utils/server'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './styles.module.scss'
import { globalContext } from '../../../App'
import NoProducts from '../../../components/NoProducts'

const DeleteProduct = () => {
	const [finish, setFinish] = useState(false)
	const [loader, setLoader] = useState(false)
	const [render, setRender] = useState(false)
	const [products, setProducts] = useState<Product[]>()
	const [selectedId, setSelectedId] = useState<string>()
	const [selectedProduct, setSelectedProduct] = useState<Product>()
	const [scroll, setScroll] = useState(0)
	const [pages, setPages] = useState<{
		totalPages: number,
		page: number,
		prevPage: number | null,
		nextPage: number | null
	}>()
	const [selectedPage, setSelectedPage] = useState(1)
	const { callAlert, user } = useContext(globalContext)

	useEffect(() => {
		if (!products) {
			setLoader(true)

			manageProduct()
			.then(products => {
				const { totalPages, page, prevPage, nextPage } = products

				setPages({ totalPages, page, prevPage, nextPage })

				setProducts(products.docs)
				setFinish(true)
			})
		} else if (pages && (pages.prevPage || pages.nextPage)) {
			setLoader(true)

			setTimeout(() => {
				productsPage(selectedPage)
				.then(products => {
					const { totalPages, page, prevPage, nextPage } = products

					setPages({ totalPages, page, prevPage, nextPage })

					setProducts(products.docs)
					setFinish(true)
				})
			}, 1500)
		}
	}, [selectedPage])

	const handleSelectProduct = (id: string) => {
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

		if (!user) return

		if (selectedId) {
			setLoader(true)

			manageProduct(selectedId, 'DELETE')
			.then(res => {
				setTimeout(() => {
					resetSelectedProduct()

					productsPage(selectedPage)
					.then(products => {
						const { totalPages, page, prevPage, nextPage } = products

						if (!products.docs.length) {
							setSelectedPage(prevPage)

							return
						}
						
						setPages({ totalPages, page, prevPage, nextPage })

						setProducts(products.docs)
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
				<div className={styles.productsList} style={{ overflowY: selectedId ? 'hidden' : 'auto' }}
				onScroll={e => setScroll(e.currentTarget.scrollTop)}>
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
							{pages && (pages.nextPage || pages.prevPage) &&
								<div className={styles.pages}>
									<div className={styles.arrows}>
										<button className={styles.leftArrow} disabled={!pages.prevPage}
										onClick={() => {pages.prevPage && setSelectedPage(pages.prevPage) }}>
											<TbChevronLeft /> Prev
										</button>
										<div className={styles.totalPages}>
											{pages.page} of {pages.totalPages}
										</div>
										<button className={styles.rightArrow} disabled={!pages.nextPage}
										onClick={() => {pages.nextPage && setSelectedPage(pages.nextPage) }}>
											Next <TbChevronRight />
										</button>
									</div>
								</div>
							}
							<AnimatePresence>
								{selectedId && selectedProduct &&
									<motion.form className={styles.productWrapper}
									initial={{ opacity: 0 }} animate={{ opacity: 1 }}
									exit={{ opacity: 0 }} onClick={resetSelectedProduct}
									onSubmit={handleSubmit} style={{ top: scroll }}>
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