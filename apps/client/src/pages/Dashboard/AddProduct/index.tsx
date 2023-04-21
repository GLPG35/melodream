import { TbChevronLeft } from 'react-icons/tb'
import { motion } from 'framer-motion'
import styles from './styles.module.scss'
import { FormEvent, useContext, useEffect, useState } from 'react'
import WaveLoader from '../../../components/WaveLoader'
import { globalContext } from '../../../App'
import { manageProduct, uploadImages } from '../../../utils/server'
import DropImages from '../../../components/DropImages'
import useCheckInput from '../../../hooks/useCheckInput'

const AddProduct = () => {
	const [thumbs, setThumbs] = useState<{id: number, thumb: File}[]>([])
	const [arrow, setArrow] = useState(false)
	const [inputs, checkInput] = useCheckInput()
	const [submit, setSubmit] = useState(false)
	const [loader, setLoader] = useState(false)
	const [finish, setFinish] = useState(false)
	const { callAlert, user } = useContext(globalContext)

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { 
			inputTitle,
			code,
			price,
			stock,
			category,
			subCategory,
			description
		} = e.currentTarget

		if (!user) return

		const productExists = await fetch(`/api/products/exists/${code.value}`)

		if (productExists.ok) {
			callAlert('error', 'Product already exists!')
			return
		}

		if (thumbs.length) {
			setLoader(true)

			uploadImages(thumbs, user.token)
			.then(thumbsURL => {
				const body = {
					title: inputTitle.value,
					code: code.value,
					price: price.value,
					stock: stock.value,
					thumbnails: thumbsURL,
					category: category.options[category.selectedIndex].text,
					subCategory: subCategory.value,
					description: description.value
				}
	
				manageProduct(body, 'POST', user.token)
				.then(res => {
					setTimeout(() => {
						setFinish(true)

						callAlert('success', res.message)

						setThumbs([])
						inputTitle.value = ''
						code.value = ''
						price.value = ''
						stock.value = ''
						category.value = 'default'
						subCategory.value = ''
						description.value = ''
					}, 2000)
				}).catch(err => {
					setTimeout(() => {
						callAlert('error', err.message)
					}, 2000)

					setFinish(true)
				})
			})
		}
	}

	useEffect(() => {
		if (inputs.length > 6) {
			setSubmit(inputs.every(x => x.state == true) && thumbs.length > 0)
		}
	}, [inputs, thumbs])

	return (
		<div className={styles.addProduct}>
			{loader && <WaveLoader end={finish} callback={setLoader} />}
			<div className={styles.topBar}>
				<h2>Add Product</h2>
				<button type='submit' form='addForm' disabled={!submit}>
					Add
				</button>
			</div>
			<form method='POST' id='addForm' onSubmit={handleSubmit}>
				<DropImages images={thumbs} callback={setThumbs} />
				<div className={styles.productInfo}>
					<div className={styles.property}>
						<label htmlFor="title">Title</label>
						<input type="text" id='title' name='inputTitle'
						required onChange={checkInput} />
					</div>
					<div className={styles.property}>
						<label htmlFor="code">Code</label>
						<input type="text" id='code' name='code'
						required maxLength={10} pattern='[A-Za-z0-9]+'
						title='Code must not contain whitespaces'
						onChange={checkInput} />
					</div>
					<div className={styles.property}>
						<label htmlFor="price">Price</label>
						<input type="number" id="price" name="price"
						required min={0} max={9999} step='.01' onChange={checkInput} />
					</div>
					<div className={styles.property}>
						<label htmlFor="stock">Stock</label>
						<input type="number" name="stock" id="stock"
						required min={0} max={99999} onChange={checkInput} />
					</div>
					<div className={styles.property}>
						<label htmlFor="category">Category</label>
						<div className={styles.selectWrapper}>
							<select name="category" id="category" defaultValue="default"
							onFocus={() => setArrow(true)} onBlur={() => setArrow(false)}
							required onChange={checkInput}>
								<option value="default" disabled>Select one category</option>
								<option value="classic">Classic</option>	
								<option value="kpop">K-Pop</option>
								<option value="metal">Metal</option>
								<option value="pop">Pop</option>
								<option value="rock">Rock</option>
							</select>
							<motion.div animate={{ rotate: arrow ? -90 : 0 }} className={styles.arrow}>
								<TbChevronLeft />
							</motion.div>
						</div>
					</div>
					<div className={styles.property}>
						<label htmlFor="subCategory">Sub Category</label>
						<input type="text" id='subCategory' name='subCategory'
						required onChange={checkInput} />
					</div>
					<div className={styles.property}>
						<label htmlFor="description">Description</label>
						<textarea name="description" id="description"
						style={{ width: 'initial', height: 'initial' }}
						required onChange={checkInput}>
						</textarea>
					</div>
				</div>
			</form>
		</div>
	)
}

export default AddProduct