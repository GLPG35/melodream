import { TbCircleCheck } from 'react-icons/tb'
import styles from './styles.module.scss'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyPaymentToken } from '../../../utils/server'

const SuccessPayment = () => {
	const navigate = useNavigate()
	const [verifyToken, setVerifyToken] = useState<boolean>()
	
	useEffect(() => {
		if (verifyToken === undefined) {
			verifyPaymentToken()
			.then(() => setVerifyToken(true))
			.catch(() => setVerifyToken(false))
		} else {
			if (!verifyToken) navigate('/')

			setTimeout(() => {
				navigate('/', { replace: true })
			}, 5000)
		}
	}, [verifyToken])

	return (
		<>
			{verifyToken !== undefined && verifyToken &&
				<div className={styles.success}>
					<div className={styles.icon}>
						<TbCircleCheck />
					</div>
					<div className={styles.title}>
						Order completed successfully
					</div>
					<div className={styles.message}>
						Wait while we redirect you to the home page...
					</div>
				</div>
			}
		</>
	)
}

export default SuccessPayment