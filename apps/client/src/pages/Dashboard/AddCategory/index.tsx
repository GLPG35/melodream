import { FormEvent, useContext, useEffect, useState } from 'react'
import useCheckInput from '../../../hooks/useCheckInput'
import styles from './styles.module.scss'
import WaveLoader from '../../../components/WaveLoader'
import { manageCategory } from '../../../utils/server'
import { globalContext } from '../../../App'

const AddCategory = () => {
	const [inputs, checkInput] = useCheckInput()
	const [submit, setSubmit] = useState(false)
	const [loader, setLoader] = useState(false)
	const [finish, setFinish] = useState(false)
	const { callAlert } = useContext(globalContext)

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { nameInput } = e.currentTarget

		setLoader(true)

		manageCategory({ name: nameInput.value })
		.then(res => {
			setTimeout(() => {
				setFinish(true)
				callAlert('success', res.message)

				nameInput.value= ''
			}, 2000)
		}).catch(err => {
			setTimeout(() => {
				setFinish(true)
				callAlert('error', err.message)
			}, 2000)
		})
	}
	
	useEffect(() => {
		if (inputs.length > 0) {
			setSubmit(inputs.every(x => x.state))
		}
	}, [inputs])

	return (
		<div className={styles.addCategory}>
			{loader && <WaveLoader end={finish} callback={setLoader} />}
			<div className={styles.topBar}>
				<h2>Add Category</h2>
				<button type='submit' form='addCategory' disabled={!submit}>
					Add
				</button>
			</div>
			<form id='addCategory' onSubmit={handleSubmit}>
				<div className={styles.group}>
					<label htmlFor="nameInput">Name</label>
					<input type="text" id='nameInput' name='nameInput'
					required onChange={checkInput} />
				</div>
			</form>
		</div>
	)
}

export default AddCategory