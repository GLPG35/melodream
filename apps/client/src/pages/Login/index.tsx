import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'

const Login = () => {
	const navigate = useNavigate()

	useEffect(() => {
		navigate('/dashboard')
	}, [])

	return (
		<div className={styles.login}>
			
		</div>
	)
}

export default Login