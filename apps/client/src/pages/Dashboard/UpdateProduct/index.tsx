import { motion, AnimatePresence } from 'framer-motion'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { TbArrowLeft, TbChevronLeft, TbChevronRight, TbCurrencyDollar, TbPackage } from 'react-icons/tb'
import { globalContext } from '../../../App'
import DropImages from '../../../components/DropImages'
import NoProducts from '../../../components/NoProducts'
import WaveLoader from '../../../components/WaveLoader'
import { Product } from '../../../types'
import { manageCategory, manageProduct, productsPage, uploadImages } from '../../../utils/server'
import styles from './styles.module.scss'

const UpdateProduct = () => {
	const [products, setProducts] = useState<Product[]>()
	const [categories, setCategories] = useState([])
	const [finish, setFinish] = useState(false)
	const [loader, setLoader] = useState(false)
	const [render, setRender] = useState(false)
	const [arrow, setArrow] = useState(false)
	const [thumbs, setThumbs] = useState<{ id: number, thumb: File }[]>([])
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
		if (!categories.length) {
			manageCategory()
			.then(setCategories)
		}
	}, [])
	
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

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!user) return

		const { 
			inputTitle: { value: title },
			code: { value: code },
			price: { value: price },
			stock: { value: stock },
			category,
			subCategory: { value: subCategory },
			description: { value: description }
		} = e.currentTarget

		const mapInputs = Array.from([title, code, price, stock, category.value, subCategory, description])
		.map(x => (!x || x === 'default') ? undefined : x)

		const [
			upTitle,
			upCode,
			upPrice,
			upStock,
			upCategory,
			upSubCategory,
			upDescription
		] = mapInputs

		const body: {
			title: string,
			code: string,
			price: number,
			stock: number,
			thumbnails: undefined | unknown[],
			category: string,
			subCategory: string,
			description: string
		} = {
			title: upTitle,
			code: upCode,
			price: upPrice,
			stock: upStock,
			thumbnails: undefined,
			category: upCategory ? category.value : undefined,
			subCategory: upSubCategory,
			description: upDescription
		}

		setLoader(true)

		if (thumbs.length) {
			await uploadImages(thumbs).then(thumbsURL => {
				body.thumbnails = thumbsURL
			})
		}

		if (selectedId) {
			manageProduct(selectedId, body, 'PUT')
			.then(res => {
				setTimeout(() => {
					resetSelectedProduct()

					productsPage(selectedPage)
					.then(products => {
						setProducts(products.docs)
						setFinish(true)
					})

					callAlert('success', res.message)

					setThumbs([])
				}, 2000)
			}).catch(err => {
				setTimeout(() => {
					setFinish(true)

					callAlert('error', err.message)
				}, 2000)
			})
		}
	}

	return (
		<div className={styles.updateProduct}>
			<div className={styles.topBar}>
				<h2>Update Product</h2>
				<AnimatePresence>
					{selectedId &&
						<motion.button className={styles.goBack} initial={{ x: 50, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }}
						onClick={() => resetSelectedProduct()}>
							<TbArrowLeft />
						</motion.button>
					}
				</AnimatePresence>
				<AnimatePresence mode='wait'>
					{selectedProduct && selectedId &&
						<motion.div className={styles.preview} initial={{ y: -50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
							<div className={styles.pic}>
								<img src={selectedProduct.thumbnails[0]} alt="" />
							</div>
							<div className={styles.info}>
								<div className={styles.title}>
									{selectedProduct.title}
								</div>
							</div>
						</motion.div>
					}
				</AnimatePresence>
				<button type='submit' form='updateForm'
				disabled={!selectedId}>
					Update
				</button>
			</div>
			{loader && <WaveLoader end={finish} callback={setLoader} render={setRender} />}
			{products && products.length > 0 ?
				<div className={styles.productsList} style={{ overflowY: selectedId ? 'hidden' : 'auto' }}
				onScroll={e => setScroll(e.currentTarget.scrollTop)}>
					{render &&
						<>
							{products.map(({ id, title, thumbnails, price, stock }) => {
								return (
									<motion.div layoutId={`${id}`} key={id} className={styles.product}
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
									<motion.div layoutId={`${selectedId}`} className={styles.viewProduct}
									style={{ top: scroll }}>
										<form method='PUT' id='updateForm' onSubmit={handleSubmit}>
											<DropImages images={thumbs} callback={setThumbs} />
											<div className={styles.productInfo}>
												<div className={styles.property}>
													<label htmlFor="title">Title</label>
													<input type="text" id='title' name='inputTitle' />
												</div>
												<div className={styles.property}>
													<label htmlFor="code">Code</label>
													<input type="text" id='code' name='code'
													maxLength={10} pattern='[A-Za-z0-9]+'
													title='Code must not contain whitespaces' />
												</div>
												<div className={styles.property}>
													<label htmlFor="price">Price</label>
													<input type="number" id="price" name="price"
													min={0} max={9999} />
												</div>
												<div className={styles.property}>
													<label htmlFor="stock">Stock</label>
													<input type="number" name="stock" id="stock"
													min={0} max={99999} />
												</div>
												<div className={styles.property}>
													<label htmlFor="category">Category</label>
													<div className={styles.selectWrapper}>
														<select name="category" id="category" defaultValue="default"
														onFocus={() => setArrow(true)} onBlur={() => setArrow(false)}>
															<option value="default" disabled>Select one category</option>
															{categories.length > 0 &&
																categories.map(({ id, name }) => {
																	return (
																		<option key={id} value={id}>{name}</option>
																	)
																})
															}
														</select>
														<motion.div animate={{ rotate: arrow ? -90 : 0 }} className={styles.arrow}>
															<TbChevronLeft />
														</motion.div>
													</div>
												</div>
												<div className={styles.property}>
													<label htmlFor="subCategory">Sub Category</label>
													<input type="text" id='subCategory' name='subCategory' />
												</div>
												<div className={styles.property}>
													<label htmlFor="description">Description</label>
													<textarea name="description" id="description"
													style={{ width: 'initial', height: 'initial' }}>
													</textarea>
												</div>
											</div>
										</form>
									</motion.div>
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

export default UpdateProduct