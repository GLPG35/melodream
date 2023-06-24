import { useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'
import { FormEvent, useContext, useState } from 'react'
import { globalContext } from '../../../App'
import { recoverPassword } from '../../../utils/server'
import { TbCircleCheck, TbUser } from 'react-icons/tb'

const RecoverPass = () => {
	const navigate = useNavigate()
	const { callAlert } = useContext(globalContext)
	const [success, setSuccess] = useState(false)

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { email: { value: email } } = e.currentTarget

		recoverPassword(email)
		.then(() => {
			setSuccess(true)
		}).catch(err => {
			callAlert('error', err.message)
		})
	}

	return (
		<div className={styles.recoverPass}>
			{!success ?
				<form onSubmit={handleSubmit}>
					<div className={styles.title}>
						<h2>Forgot password?</h2>
						<span>Provide your e-mail below and we'll send you instructions to recover it.</span>
					</div>
					<div className={styles.group}>
						<label htmlFor="email">E-mail</label>
						<input type="email" name='email' id='email' required />
					</div>
					<span className={styles.action}
					onClick={() => navigate('/login')}>
						You already remembered? <span>Login</span>
					</span>
					<button type='submit'>
						Recover password
					</button>
				</form>
			:
				<div className={styles.success}>
					<div className={styles.icon}>
						<TbCircleCheck />
					</div>
					<div className={styles.successTitle}>
						Recovery mail sent successfully
					</div>
					<div className={styles.message}>
						Please check your e-mail account to reset your password
					</div>
					<button onClick={() => navigate('/login')}>
						<TbUser /> Login
					</button>
				</div>
			}
		</div>
	)
}

export default RecoverPass