import { useContext, useEffect, useRef, useState } from 'react'
import styles from './styles.module.scss'
import { deleteInactiveUsers, deleteUsers, manageUsers } from '../../../utils/server'
import { TbAlertTriangle, TbCheck, TbClock, TbDotsVertical, TbMinus } from 'react-icons/tb'
import { DashboardUser } from '../../../types'
import { globalContext } from '../../../App'
import NoProducts from '../../../components/NoProducts'
import WaveLoader from '../../../components/WaveLoader'
import { motion, AnimatePresence } from 'framer-motion'

const DeleteUsers = () => {
	const [users, setUsers] = useState<DashboardUser[]>()
	const [selected, setSelected] = useState<string[]>([])
	const [allSelected, setAllSelected] = useState<boolean>()
	const { callAlert } = useContext(globalContext)
	const [finish, setFinish] = useState(false)
	const [loader, setLoader] = useState(false)
	const [render, setRender] = useState(false)
	const [moreOptions, setMoreOptions] = useState(false)
	const [confirmDelete, setConfirmDelete] = useState(false)
	const [confirmInactive, setConfirmInactive] = useState(false)
	const moreOptionsRef = useRef<HTMLDivElement>(null)
	const dotsRef = useRef<HTMLDivElement>(null)

	const clickOutside = (e: globalThis.MouseEvent) => {
		if ((moreOptionsRef.current && !moreOptionsRef.current.contains(e.target as Node)) && (dotsRef.current && !dotsRef.current.contains(e.target as Node))) {
			setMoreOptions(false)
		}
	}

	useEffect(() => {
		if (!users) {
			setLoader(true)

			manageUsers()
			.then(users => {
				setUsers(users)
				setFinish(true)
			})
		}

		document.addEventListener('click', clickOutside, { capture: true })

		return () => {
			document.removeEventListener('click', clickOutside, { capture: true })
		}
	}, [])

	const checkAll = (newSelected: string[]) => {
		if (!users) return

		const check = newSelected.length === 0 ? undefined : newSelected.length < users.length ? false : true
		setAllSelected(check)
	}
	
	const toggleCheck = (email: string) => {
		const findUser = selected.find(x => x == email)
		
		if (findUser) {
			const newSelected = selected.filter(x => x != email)

			setSelected(newSelected)

			checkAll(newSelected)
			
			return
		}

		setSelected(prev => [...prev, email])

		checkAll([...selected, email])
	}

	const checkSelected = (email: string) => {
		const findUser = selected.find(x => x == email)

		return Boolean(findUser)
	}

	const changeSelectAll = () => {
		if (!users) return
		
		const check = allSelected === undefined ? true : undefined

		setAllSelected(check)

		if (check) {
			const newSelected = users.map(x => x.email)

			setSelected(newSelected)

			return
		}

		setSelected([])
	}

	const toggleMoreOptions = () => {
		setMoreOptions(!moreOptions)
	}

	const confirmDeleteInactive = () => {
		setConfirmInactive(true)
		setMoreOptions(false)
	}

	const confirmDeleteSubmit = () => {
		setConfirmDelete(true)
	}

	const handleSubmit = () => {
		if (!selected.length) return
		
		deleteUsers(selected)
		.then(res => {
			manageUsers()
			.then(users => {
				setUsers(users)
				setSelected([])
				setAllSelected(undefined)
				setConfirmDelete(false)
				
				callAlert('success', res)
			})
		})
	}

	const handleSubmitInactive = () => {
		deleteInactiveUsers()
		.then(res => {
			manageUsers()
			.then(users => {
				setUsers(users)
				setConfirmInactive(false)

				callAlert('success', res)
			})
		}).catch(err => {
			callAlert('error', err.message)

			setConfirmInactive(false)
		})
	}	

	return (
		<div className={styles.deleteUsers}>
			<div className={styles.topBar}>
				<h2>Delete Users</h2>
				<div className={styles.actions}>
					<div className={styles.selectAll}>
						<button className={allSelected !== undefined ? styles.active : undefined}
						onClick={changeSelectAll}>
							{(allSelected !== undefined) && allSelected ?
								<div className={styles.icon}>
									<TbCheck />
								</div>
							: (allSelected !== undefined) && !allSelected &&
								<div className={styles.icon}>
									<TbMinus />
								</div>
							}
						</button>	
					</div>
					<button className={styles.delete}
					disabled={selected.length <= 0} onClick={confirmDeleteSubmit}>
						Delete
					</button>
					<div className={styles.moreOptions}>
						<div className={styles.dots} onClick={toggleMoreOptions}
						ref={dotsRef}>
							<TbDotsVertical />
						</div>
						<AnimatePresence>
							{moreOptions &&
								<motion.div className={styles.moreWrapper}
								initial={{ height: 0, padding: 0 }}
								animate={{ height: 'max-content', padding: '0.5em' }}
								exit={{ height: 0, padding: 0 }} ref={moreOptionsRef}>
									<div className={styles.option}
									onClick={confirmDeleteInactive}>
										<TbClock />
										Delete inactive users
									</div>
								</motion.div>
							}
						</AnimatePresence>
					</div>
				</div>
			</div>
			{loader && <WaveLoader end={finish} callback={setLoader} render={setRender} />}
			{users && users.length > 0 ?
				<div className={styles.usersList}>
					<AnimatePresence>
						{(confirmDelete || confirmInactive) &&
							<motion.div className={styles.confirmDeleteWrapper}
							initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
								<div className={styles.confirmDelete}>
									<div className={styles.top}>
										<div className={styles.icon}>
											<TbAlertTriangle />
										</div>
										<div className={styles.message}>
											Are you sure to delete this user(s)?
										</div>
									</div>
									<div className={styles.bottom}>
										<button onClick={confirmDelete ? handleSubmit : confirmInactive ? handleSubmitInactive : undefined}>Yes</button>
										<button onClick={() => confirmDelete ? setConfirmDelete(false) : confirmInactive ? setConfirmInactive(false) : undefined}>No</button>
									</div>
								</div>
							</motion.div>
						}
					</AnimatePresence>
					{render && users.map(({ id, name, pic, email }) => {
						return (
							<div className={styles.user} key={id} onClick={() => toggleCheck(email)}>
								<div className={styles.pic}>
									<img src={pic || `https://ui-avatars.com/api/
									?name=${name}
									&background=4f3499
									&color=fbdef4
									&size=48&font-size=0.35
									&uppercase=false`} alt="" />
								</div>
								<div className={styles.info}>
									<div className={styles.name}>{name}</div>
									<div className={styles.email}>{email}</div>
								</div>
								<button className={checkSelected(email) ? styles.active : undefined}>
									{checkSelected(email) &&
										<div className={styles.check}>
											<TbCheck />
										</div>
									}
								</button>
							</div>
						)
					})}
				</div>
			: users && !users.length &&
				<NoProducts title='There are no users' message='No users were retrieved from the database, which is weird because you are one of them, please refresh' />
			}
		</div>
	)
}

export default DeleteUsers