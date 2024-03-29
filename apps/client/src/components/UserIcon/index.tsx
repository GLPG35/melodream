import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useEffect, useRef, useState } from 'react'
import { TbLayout, TbLogout, TbStar, TbTicket, TbUser } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router-dom'
import { globalContext } from '../../App'
import { manageUser } from '../../utils/server'
import styles from './styles.module.scss'

const UserIcon = () => {
	const navigate = useNavigate()
	const { user, setUser } = useContext(globalContext)
	const [menu, setMenu] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)

	const clickOutside = (e: globalThis.MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
			setMenu(false)
		}
	}

	const handleLogout = () => {
		manageUser(true)
		.then(() => {
			setMenu(!menu)
			setUser(null)

			localStorage.removeItem('cart')
			localStorage.removeItem('cartQtty')
		})
	}
	
	useEffect(() => {
		document.addEventListener('click', clickOutside, { capture: true })

		return () => {
			document.removeEventListener('click', clickOutside, { capture: true })
		}
	}, [])
	
	return (
		<>
			{!user ?
				<div className={styles.userIcon} onClick={() => navigate('/login')}>
					<TbUser />
				</div>
			:
				<div className={styles.activeUser}
				onClick={() => setMenu(!menu)}>
					<div className={styles.pic}>
						<img src={user.pic || `https://ui-avatars.com/api/
							?name=${user.name}
							&background=4f3499
							&color=fbdef4
							&size=48&font-size=0.35
							&uppercase=false`} alt="" />
					</div>
					<AnimatePresence>
						{menu &&
							<motion.div className={styles.menu}
							initial={{ height: 0 }}
							animate={{ height: 'max-content' }}
							exit={{ height: 0 }} onClick={e => e.stopPropagation()}
							ref={menuRef}>
								<div className={styles.wrapper}>
									<Link to={'/profile'} onClick={() => setMenu(!menu)}>
										<TbUser /> Profile
									</Link>
									{['admin', 'superstar'].includes(user.userType) &&
										<Link to={'/dashboard'} onClick={() => setMenu(!menu)}>
											<TbLayout /> Dashboard
										</Link>
									}
									{user.userType == 'user' &&
										<Link to={'/superstar'} onClick={() => setMenu(!menu)}>
											<TbStar /> Superstar
										</Link>
									}
									<Link to={'/orders'} onClick={() => setMenu(!menu)}>
										<TbTicket /> Orders
									</Link>
									<a href={undefined} onClick={handleLogout}>
										<TbLogout /> Logout
									</a>
								</div>
							</motion.div>
						}
					</AnimatePresence>
				</div>
			}
		</>
	)
}

export default UserIcon	