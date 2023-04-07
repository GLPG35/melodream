import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TbCirclePlus, TbEdit, TbEraser, TbUser } from 'react-icons/tb'
import { Outlet } from 'react-router-dom'
import styles from './styles.module.scss'
import { useContext, useEffect } from 'react'
import { globalContext } from '../../App'

const Dashboard = () => {
	const navigate = useNavigate()
	const { user } = useContext(globalContext)
	const location = useLocation()
	const currentLocation = location.pathname.split('/').pop()
	
	useEffect(() => {
		if (!user) {
			navigate('/login')
		} else if (user.userType !== 'admin') {
			navigate('/')
		} else {
			if (currentLocation === '' || currentLocation === 'dashboard') {
				navigate('add')
			}
		}
	}, [user])

	return (
		<div className={styles.dashboard}>
			{user &&
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
							<li>
								<Link to={'addUser'}>
									<TbUser fontSize={'1.2em'} /> Add User
								</Link>
							</li>
						</ul>
					</div>
					<div className={styles.display}>
						<Outlet />
					</div>
				</div>
			}
		</div>
	)
}

export default Dashboard