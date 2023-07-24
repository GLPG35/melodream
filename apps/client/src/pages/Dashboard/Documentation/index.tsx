import { useContext, useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { manageUserDoc, manageUsersWithDocs } from '../../../utils/server'
import { motion, AnimatePresence } from 'framer-motion'
import { TbCheck, TbChevronLeft, TbX } from 'react-icons/tb'
import { globalContext } from '../../../App'
import NoProducts from '../../../components/NoProducts'

const Documentation = () => {
	const [users, setUsers] = useState([])
	const [doc, setDoc] = useState<{ id: string, email: string, documentation: [] }>()
	const [selectedDoc, setSelectedDoc] = useState<any>()
	const { callAlert } = useContext(globalContext)

	useEffect(() => {
		if (!users.length) {
			manageUsersWithDocs()
			.then(docs => {
				setUsers(docs.filter((x: any) => !x.documentation.every((x: any) => x.approved != undefined)))
			})
		}
	}, [])

	const handleDocReview = (approve: boolean) => {
		if (!doc) return
		const { email } = doc
		const { id } = selectedDoc

		manageUserDoc(email, +id, approve)
		.then(res => {
			callAlert('success', res)

			manageUsersWithDocs()
			.then(docs => {
				setUsers(docs.filter((x: any) => !x.documentation.every((x: any) => x.approved != undefined)))

				const { id, email, documentation } = docs.find((x: any) => x.id == doc.id)

				setSelectedDoc(undefined)
				setDoc({ id, email, documentation })
			})
		}).catch(err => {
			callAlert('error', err.message)
		})
	}
	
	return (
		<div className={styles.documentation}>
			<div className={styles.topBar}>
				<h2>Documentation</h2>
			</div>
			{users.length > 0 ?
				<div className={styles.userList}>
					<AnimatePresence>
						{doc &&
							<motion.div className={styles.selectedWrapper}
							initial={{ opacity: 0 }} animate={{ opacity: 1 }}
							exit={{ opacity: 0 }} onClick={() => setDoc(undefined)}>
								<motion.div layoutId={doc.id} className={styles.selectedUser}
								onClick={e => e.stopPropagation()}>
									{selectedDoc &&
										<motion.div className={styles.selectedDocWrapper}
										onClick={() => setSelectedDoc(undefined)}>
											<motion.div className={styles.selectedDoc}
											layoutId={selectedDoc.id} onClick={e => e.stopPropagation()}>
												<div className={styles.title}>
													<span>{selectedDoc.name}</span>
													<div className={styles.options}>
														<button onClick={() => handleDocReview(true)}>
															<TbCheck /> Approve
														</button>
														<button onClick={() => handleDocReview(false)}>
															<TbX /> Reject
														</button>
													</div>
												</div>
												<div className={styles.picWrapper}>
													<div className={styles.pic}>
														<img src={selectedDoc.url} alt="" />
													</div>
												</div>
											</motion.div>
										</motion.div>
									}
									<div className={styles.info}>
										<div className={styles.back} onClick={() => setDoc(undefined)}>
											<TbChevronLeft /> Back
										</div>
										<div className={styles.details}>
											<div className={styles.name}>
												Pending documentation
											</div>
										</div>
									</div>
									<div className={styles.pendingDocs}>
										{doc.documentation.filter((x: any) => !x.approved).map((x: any) => {
											return (
												<motion.div className={styles.document} key={x.id}
												onClick={() => setSelectedDoc(x)} layoutId={x.id}>
													<div className={styles.pic}>
														<img src={x.url} alt="" />
													</div>
													<div className={styles.details}>
														<div className={styles.name}>
															{x.name}
														</div>
														<button onClick={() => setSelectedDoc(x)}>
															Review
														</button>
													</div>
												</motion.div>
											)
										})}
									</div>
								</motion.div>
							</motion.div>
						}
					</AnimatePresence>
					{users.map(({ id, name, email, pic, documentation }) => {
						return (
							<motion.div className={styles.user} key={id}
							onClick={() => setDoc({ id, email, documentation })} layoutId={id}>
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
								</div>
							</motion.div>
						)
					})}
				</div>
			:
				<NoProducts title='There is no pending documentation' message='Please go to another section or refresh this page' />
			}
		</div>
	)
}

export default Documentation