import { FormEvent, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { globalContext } from '../../App'
import { manageUser } from '../../utils/server'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './styles.module.scss'

const Login = () => {
	const navigate = useNavigate()
	const { user, setUser, callAlert } = useContext(globalContext)
	const [register, setRegister] = useState(false)

	useEffect(() => {
		if (user) {
			if (user.userType == 'admin') {
				navigate('/dashboard')
			} else {
				navigate('/')
			}
		}
	}, [user])

	const handleLogin = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { email, password } = e.currentTarget

		const body = {
			email: email.value,
			password: password.value
		}

		manageUser(body)
		.then(user => {
			setUser(user)
		}).catch(err => {
			callAlert('error', err.message)
		})
	}

	const handleRegister = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { email, password, nameInput } = e.currentTarget

		const body = {
			email: email.value,
			password: password.value,
			name: nameInput.value
		}

		manageUser(body)
		.then(user => {
			console.log(user)
			setUser(user)
		}).catch(() => {})
	}

	return (
		<div className={styles.login}>
			<div className={styles.wrapper}>
				<h2>Welcome back to Melodream</h2>
				<AnimatePresence mode='wait' initial={false}>
					{!register ?
						<motion.form onSubmit={handleLogin}
						initial={{ opacity: 0 }} animate={{ opacity: 1 }}
						exit={{ opacity: 0 }} key={1}>
							<div className={styles.subtitle}>
								Login right below
							</div>
							<fieldset>
								<div className={styles.group}>
									<label htmlFor="email">
										E-mail
									</label>
									<input type='email' name='email' id='email' required />
								</div>
								<div className={styles.group}>
									<label htmlFor="password">
										Password
									</label>
									<input type='password' name='password' id='password' required />
								</div>
							</fieldset>
							<span className={styles.action}
							onClick={() => setRegister(true)}>
								Don't have an account? <span>Register</span>
							</span>
							<button type='submit'>
								Login
							</button>
						</motion.form>
					:
						<motion.form onSubmit={handleRegister}
						initial={{ opacity: 0 }} animate={{ opacity: 1 }}
						exit={{ opacity: 0 }} key={2}>
							<div className={styles.subtitle}>
								Register right below
							</div>
							<fieldset>
								<div className={styles.groupWrapper}>
									<div className={styles.group}>
										<label htmlFor="name">
											Name
										</label>
										<input type='text' name='nameInput' id='name' required />
									</div>
									<div className={styles.group}>
										<label htmlFor="email">
											E-mail
										</label>
										<input type='email' name='email' id='email' required />
									</div>
								</div>
								<div className={styles.group}>
									<label htmlFor="password">
										Password
									</label>
									<input type='password' name='password' id='password' required />
								</div>
							</fieldset>
							<span className={styles.action}
							onClick={() => setRegister(false)}>
								Already have an account? <span>Login</span>
							</span>
							<button type='submit'>
								Register
							</button>
						</motion.form>
					}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default Login