import { Link, useNavigate, Outlet } from 'react-router-dom'
import { TbCirclePlus, TbEdit, TbEraser, TbFileDescription, TbUserEdit, TbUserPlus, TbUsersMinus, TbVersions } from 'react-icons/tb'
import styles from './styles.module.scss'
import { useContext, useEffect } from 'react'
import { globalContext } from '../../App'

const Dashboard = () => {
	const navigate = useNavigate()
	const { user } = useContext(globalContext)
	
	useEffect(() => {
		if (!user) {
			navigate('/login', { replace: true })
		} else if (!['admin', 'superstar'].includes(user.userType)) {
			navigate('/')
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
							{user.userType === 'admin' &&
								<>
									<li>
										<Link to={'addCategory'}>
											<TbVersions fontSize={'1.2em'} /> Add Category
										</Link>
									</li>
									<li>
										<Link to={'addUser'}>
											<TbUserPlus fontSize={'1.2em'} /> Add User
										</Link>
									</li>
									<li>
										<Link to={'updateUser'}>
											<TbUserEdit fontSize={'1.2em'} /> Update User
										</Link>
									</li>
									<li>
										<Link to={'deleteUsers'}>
											<TbUsersMinus fontSize={'1.2em'} /> Delete Users
										</Link>
									</li>
									<li>
										<Link to={'documentation'}>
											<TbFileDescription fontSize={'1.2em'} /> Documentation
										</Link>
									</li>
								</>
							}
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