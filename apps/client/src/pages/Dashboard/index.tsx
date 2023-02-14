import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TbCirclePlus, TbEdit, TbEraser } from 'react-icons/tb'
import { Outlet } from 'react-router-dom'
import styles from './styles.module.scss'
import { useEffect } from 'react'

const Dashboard = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const currentLocation = location.pathname.split('/').pop()
	
	useEffect(() => {
		if (currentLocation === '' || currentLocation === 'dashboard') {
			navigate('add')
		}
	}, [])

	return (
		<div className={styles.dashboard}>
			<div className={styles.subContainer}>
				<div className={styles.sidebar}>
					<ul>
						<li>
							<Link to={'add'}>
								<TbCirclePlus fontSize={'1.2em'} /> Add Product
							</Link>
						</li>
						<li>
							<Link to={'update'}>
								<TbEdit fontSize={'1.2em'} /> Update Product
							</Link>
						</li>
						<li>
							<Link to={'delete'}>
								<TbEraser fontSize={'1.2em'} /> Delete Product
							</Link>
						</li>
					</ul>
				</div>
				<div className={styles.display}>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default Dashboard