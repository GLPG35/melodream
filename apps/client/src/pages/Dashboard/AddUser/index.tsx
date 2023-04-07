import { FormEvent, useContext, useEffect, useState } from 'react'
import { TbChevronLeft } from 'react-icons/tb'
import useCheckInput from '../../../hooks/useCheckInput'
import { motion } from 'framer-motion'
import styles from './styles.module.scss'
import { manageUser } from '../../../utils/server'
import { globalContext } from '../../../App'
import WaveLoader from '../../../components/WaveLoader'

const AddUser = () => {
	const [submit, setSubmit] = useState(false)
	const [inputs, checkInput] = useCheckInput()
	const [arrow, setArrow] = useState(false)
	const [loader, setLoader] = useState(false)
	const [finish, setFinish] = useState(false)
	const { callAlert } = useContext(globalContext)

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { email, nameInput, password, type } = e.currentTarget

		const body = {
			email: email.value,
			name: nameInput.value,
			password: password.value,
			userType: type.value
		}

		setLoader(true)

		manageUser(body)
		.then(() => {
			setTimeout(() => {
				setFinish(true)
				
				callAlert('success', 'User created successfully')
				
				email.value = ''
				nameInput.value = ''
				password.value = ''
				type.value = 'default'
			}, 2000)
		}).catch(err => {
			callAlert('error', err.message)
		})
	}

	useEffect(() => {
		if (inputs.length > 3) {
			setSubmit(inputs.every(x => x.state))
		}
	}, [inputs])

	return (
		<div className={styles.addUser}>
			{loader && <WaveLoader end={finish} callback={setLoader} />}
			<div className={styles.topBar}>
				<h2>Add User</h2>
				<button type='submit' form='addForm' disabled={!submit}>
					Add
				</button>
			</div>
			<form id='addForm' onSubmit={handleSubmit}>
				<div className={styles.group}>
					<label htmlFor="email">E-mail</label>
					<input type='email' id='email' name='email'
					required onChange={checkInput} />
				</div>
				<div className={styles.group}>
					<label htmlFor="name">Name</label>
					<input type="text" id='name' name='nameInput'
					required onChange={checkInput} />
				</div>
				<div className={styles.group}>
					<label htmlFor="password">Password</label>
					<input type="password" id='password' name='password'
					required onChange={checkInput} />
				</div>
				<div className={styles.group}>
					<label htmlFor="type">Type</label>
					<div className={styles.selectWrapper}>
						<select name="type" id="type" defaultValue='default'
						onFocus={() => setArrow(true)} onBlur={() => setArrow(false)}
						required onChange={checkInput}>
							<option value="default" disabled>Select one type</option>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
						<motion.div animate={{ rotate: arrow ? -90 : 0 }} className={styles.arrow}>
							<TbChevronLeft />
						</motion.div>
					</div>
				</div>
			</form>
		</div>
	)
}

export default AddUser