import { FormEvent, useContext, useEffect, useState } from 'react'
import styles from './styles.module.scss'
import NoProducts from '../../../components/NoProducts'
import { DashboardUser } from '../../../types'
import { manageUsers, updateUser } from '../../../utils/server'
import { AnimatePresence, motion } from 'framer-motion'
import { TbArrowLeft, TbChevronLeft, TbStar, TbUser, TbSettings, TbPointFilled } from 'react-icons/tb'
import { globalContext } from '../../../App'
import WaveLoader from '../../../components/WaveLoader'

const UpdateUser = () => {
	const [users, setUsers] = useState<DashboardUser[]>()
	const [selectedUser, setSelectedUser] = useState<DashboardUser>()
	const [arrow, setArrow] = useState(false)
	const { callAlert } = useContext(globalContext)
	const [finish, setFinish] = useState(false)
	const [loader, setLoader] = useState(false)
	const [render, setRender] = useState(false)

	useEffect(() => {
		if (!users) {
			setLoader(true)

			manageUsers()
			.then(users => {
				setUsers(users)
				setFinish(true)
			})
		}
	}, [])

	const handleSelectUser = (id: string) => {
		if (!users) return

		const findUser = users.find(x => x.id == id)
		setSelectedUser(findUser)
	}

	const resetSelectedUser = () => {
		setSelectedUser(undefined)
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!selectedUser) return

		const id = selectedUser.id
		const { uName, userType } = e.currentTarget

		const body = {
			name: uName.value || undefined,
			userType: userType.value !== 'default' ? userType.value : undefined
		}

		updateUser(id, body)
		.then(res => {
			manageUsers()
			.then(users => {
				setUsers(users)
				resetSelectedUser()
				callAlert('success', res)
			})
		})
	}

	return (
		<div className={styles.updateUser}>
			<div className={styles.topBar}>
				<h2>Update User</h2>
				<AnimatePresence>
					{selectedUser &&
						<motion.button className={styles.goBack} initial={{ x: 50, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }}
						onClick={resetSelectedUser}>
							<TbArrowLeft />
						</motion.button>
					}
				</AnimatePresence>
				<AnimatePresence mode='wait'>
					{selectedUser &&
						<motion.div className={styles.preview} initial={{ y: -50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
							<div className={styles.pic}>
								<img src={selectedUser.pic|| `https://ui-avatars.com/api/
								?name=${selectedUser.name}
								&background=4f3499
								&color=fbdef4
								&size=48&font-size=0.35
								&uppercase=false`} alt="" />
							</div>
							<div className={styles.info}>
								<div className={styles.name}>
									{selectedUser.name}
								</div>
							</div>
							<div className={styles.separator}>
								<TbPointFilled />
							</div>
							<div className={styles.type} title={selectedUser.userType.charAt(0).toUpperCase() + selectedUser.userType.slice(1)}>
								{selectedUser.userType === 'user' ?
									<TbUser />
								: selectedUser.userType === 'superstar' ?
									<TbStar />
								:
									<TbSettings />
								}
							</div>
						</motion.div>
					}
				</AnimatePresence>
				<button type='submit' form='updateForm'
				disabled={!selectedUser}>
					Update
				</button>
			</div>
			{loader && <WaveLoader end={finish} callback={setLoader} render={setRender} />}
			{users && users.length > 0 ?
				<div className={styles.usersList}>
					<AnimatePresence>
						{selectedUser &&
							<motion.form onSubmit={handleSubmit} layoutId={selectedUser.id} id='updateForm' className={styles.updateWrapper}>
								<div className={styles.property}>
									<label htmlFor="uName">Name</label>
									<input type="text" name='uName' />
								</div>
								<div className={styles.property}>
								<label htmlFor="userType">Type</label>
								<div className={styles.selectWrapper}>
									<select name="type" id="userType" defaultValue='default'
									onFocus={() => setArrow(true)} onBlur={() => setArrow(false)}>
										<option value="default" disabled>Select one type</option>
										<option value="user">User</option>
										<option value="superstar">Superstar</option>
										<option value="admin">Admin</option>
									</select>
									<motion.div animate={{ rotate: arrow ? -90 : 0 }} className={styles.arrow}>
										<TbChevronLeft />
									</motion.div>
								</div>
								</div>
							</motion.form>
						}
					</AnimatePresence>
					{render && users.map(({ id, name, pic, email, userType }) => {
						return (
							<motion.div className={styles.user} key={id}
							onClick={() => handleSelectUser(id)} layoutId={id}>
								<div className={styles.pic}>
									<img src={pic || `https://ui-avatars.com/api/
									?name=${name}
									&background=4f3499
									&color=fbdef4
									&size=48&font-size=0.35
									&uppercase=false`} alt="" />
								</div>
								<div className={styles.info}>
									<div className={styles.name}>
										{name}
									</div>
									<div className={styles.email}>
										{email}
									</div>
								</div>
								<div className={styles.type} title={userType.charAt(0).toUpperCase() + userType.slice(1)}>
									{userType === 'user' ?
										<TbUser />
									: userType === 'superstar' ?
										<TbStar />
									:
										<TbSettings />
									}
								</div>
							</motion.div>
						)
					})}
				</div>
			: users && !users.length &&
				<NoProducts title='There are no users' message='No users were retrieved from the database, which is weird because you are one of them, please refresh' />
			}
		</div>
	)
}

export default UpdateUser