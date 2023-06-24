import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './styles.module.scss'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { checkResetPassword, resetPassword } from '../../../utils/server'
import { globalContext } from '../../../App'
import { TbCircleCheck, TbUser } from 'react-icons/tb'

const ResetPass = () => {
	const [queryParams] = useSearchParams()
	const token = queryParams.get('token')
	const navigate = useNavigate()
	const { callAlert } = useContext(globalContext)
	const [checkToken, setCheckToken] = useState(false)
	const [success, setSuccess] = useState(false)

	useEffect(() => {
		if (!token) return navigate('/login')

		if (!checkToken) {
			checkResetPassword(token)
			.then(() => {
				setCheckToken(true)
			}).catch(() => {
				return navigate('/login')
			})
		}
	}, [])

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { password, cPassword } = e.currentTarget

		if (password.value !== cPassword.value) return callAlert('warn', "The passwords don't match")

		if (token) {
			resetPassword(password.value, token)
			.then(() => {
				setSuccess(true)
			}).catch(err => {
				callAlert('error', err.message)
			})
		}
	}

	return (
		<div className={styles.resetPass}>
			{checkToken &&
				(!success ?
					<form onSubmit={handleSubmit}>
						<div className={styles.title}>
							<h2>Reset password</h2>
							<span>Please provide a new password for your account</span>
						</div>
						<div className={styles.group}>
							<label htmlFor="password">New password</label>
							<input type="password" name='password' id='password' />
						</div>
						<div className={styles.group}>
							<label htmlFor="cPassword">Confirm new password</label>
							<input type="password" name='cPassword' id='cPassword' />
						</div>
						<button type='submit'>
							Reset password
						</button>
					</form>
				:
					<div className={styles.success}>
						<div className={styles.icon}>
							<TbCircleCheck />
						</div>
						<div className={styles.successTitle}>
							Password changed successfully
						</div>
						<div className={styles.message}>
							Please login into your account
						</div>
						<button onClick={() => navigate('/login')}>
							<TbUser /> Login
						</button>
					</div>
				)
			}
		</div>
	)
}

export default ResetPass