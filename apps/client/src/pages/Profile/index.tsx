import { ChangeEvent, DragEvent, useContext, useEffect, useRef, useState } from 'react'
import styles from './styles.module.scss'
import { globalContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import { TbBuildingBank, TbCheck, TbChevronLeft, TbCircleCheck, TbCircleX, TbClock, TbHomeQuestion, TbId, TbMail, TbPointFilled, TbSettings, TbStar, TbUpload } from 'react-icons/tb'
import { convertImage, manageDocs, manageProfilePic, refreshUser, uploadDoc } from '../../utils/server'
import { motion } from 'framer-motion'
import DropImages from '../../components/DropImages'

const Profile = () => {
	const { user, callAlert, setUser } = useContext(globalContext)
	const navigate = useNavigate()
	const uploadRef = useRef<HTMLInputElement>(null)
	const [profilePic, setProfilePic] = useState<File>()
	const [documentation, setDocumentation] = useState<any>()
	const [docs, setDocs] = useState<{ id: number, name: string, url?: string, approved?: boolean }[]>()
	const [doc, setDoc] = useState<{ id: number, name: string, url?: string, approved?: boolean }>()
	const [uploadedDoc, setUploadedDoc] = useState<{ id: number, thumb: File }[]>([])

	useEffect(() => {
		if (user === null) return navigate('/')

		if (user && !documentation) {
			manageDocs().then(setDocumentation)
		}
	}, [user])

	useEffect(() => {
		const check = documentation?.length == 3

		if (check) return setDocs(documentation)

		const documents = [
			{
				id: 1,
				name: 'ID'
			},
			{
				id: 2,
				name: 'Proof of Address'
			},
			{
				id: 3,
				name: 'Bank Statement'
			}
		]

		if (!documentation) return setDocs(documents)

		const getIDs = documentation.map((x: any) => x.id)
		const filterDocs = documents.filter(x => !getIDs.includes(x.id))
		filterDocs.push(...documentation)
		filterDocs.sort((a, b) => a.id - b.id)

		return setDocs(filterDocs)
	}, [documentation])

	const tiers: any = {
		'superstar': <TbStar />,
		'admin': <TbSettings />
	}

	const docIcons = [
		<TbId />,
		<TbHomeQuestion />,
		<TbBuildingBank />
	]

	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.currentTarget.files) {
			if (e.currentTarget.files) {
				const file = e.currentTarget.files[0]
	
				const img = new Image()
				img.src = URL.createObjectURL(file)
				img.addEventListener('load', async () => {
					const newPic = await convertImage(img, file.name)
	
					if (newPic) {
						setProfilePic(newPic)
					}
				})

				e.currentTarget.value = ''
			}
		}
	}

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDropImage = (e: DragEvent) => {
		e.preventDefault()

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0]
	
			const img = new Image()
			img.src = URL.createObjectURL(file)
			img.addEventListener('load', async () => {
				const newPic = await convertImage(img, file.name)

				if (newPic) {
					setProfilePic(newPic)
				}
			})
		}
	}

	const closeDoc = () => {
		setDoc(undefined)
		setUploadedDoc([])
	}

	const handleConfirmImage = () => {
		if (!profilePic) return

		manageProfilePic(profilePic)
		.then(message => {
			refreshUser()
			.then(user => {
				setUser(user)

				callAlert('success', message)
			})
		}).catch(err => {
			callAlert('error', err.message)
		})
	}

	const handleDocUpload = () => {
		if (!doc || !uploadDoc.length) return

		uploadDoc(uploadedDoc[0].thumb)
		.then(path => {
			manageDocs(doc.id, path)
			.then(res => {
				callAlert('success', res)

				manageDocs()
				.then(res => {
					setDocumentation(res)

					setDoc(undefined)
					setUploadedDoc([])
				})
			}).catch(err => {
				callAlert('error', err.message)
			})
		}).catch(err => {
			callAlert('error', err.message)
		})
	}

	return (
		<div className={styles.profile}>
			{user &&
				<>
					<div className={styles.title}>
						Profile
					</div>
					<div className={styles.profileSections}>
						{doc &&
							<div className={styles.selectDocWrapper}
							onClick={closeDoc}>
								<motion.div layoutId={`${doc.id}`} className={styles.selectDoc}
								onClick={(e) => e.stopPropagation()}>
									<div className={styles.docTitle}>
										<span onClick={closeDoc}>
											<TbChevronLeft /> Back
										</span>
										<div className={styles.dTitle}>
											<div className={styles.details}>
												{doc.url &&
													<div className={styles.pic}>
														<img src={doc.url} alt="" />
													</div>
												}
												<span>{doc.name}</span>
											</div>
											<button onClick={handleDocUpload}>Upload</button>
										</div>
									</div>
									<div className={styles.docContent}>
										<div className={styles.dropDoc}>
											<DropImages images={uploadedDoc} callback={setUploadedDoc} limit={1} />
										</div>
									</div>
								</motion.div>
							</div>
						}
						<div className={styles.generalInfo}>
							<div className={styles.header}>
								<div className={styles.wave}></div>
							</div>
							<div className={styles.profileSection2}>
								<div className={styles.profilePic}>
									<div className={styles.picWrapper}>
										<div className={styles.upload} onClick={() => uploadRef.current && uploadRef.current.click()}
										onDragOver={handleDragOver} onDrop={handleDropImage}>
											<input type="file" onChange={handleFileUpload} ref={uploadRef} />
											<TbUpload /> Upload image
										</div>
										{profilePic &&
											<div className={styles.confirm} onClick={handleConfirmImage}>
												<TbCheck />
											</div>
										}
										<img src={(profilePic && URL.createObjectURL(profilePic)) || user.pic ||
										`https://ui-avatars.com/api/
										?name=${user.name}
										&background=4f3499
										&color=fbdef4
										&size=48&font-size=0.35
										&uppercase=false`} alt="" />
									</div>
								</div>
								<div className={styles.info}>
									<div className={styles.name}>
										{user.name}
									</div>
									<div className={styles.extra}>
										<div className={styles.email}>
											<TbMail /> {user.email}
										</div>
										{user.userType !== 'user' &&
											<>
												<div className={styles.separator}>
													<TbPointFilled />
												</div>
												<div className={styles.tier}>
													{tiers[user.userType]} {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
												</div>
											</>
										}
									</div>
								</div>
							</div>
						</div>
						<div className={styles.documentation}>
							<div className={styles.subTitle}>
								Documentation
							</div>
							<div className={styles.docWrapper}>
								{docs && docs.map(({ id, name, url, approved }) => {
									return (
										<motion.div layoutId={`${id}`} key={id} className={styles.document}
										onClick={() => setDoc({ id, name, url, approved })}
										title={url ? (approved === undefined ? 'Pending' : approved ? 'Approved' : 'Rejected') : ''}>
											<div className={styles.pic}>
												{url ?
													<img src={url} alt="" />
												:
													docIcons[id - 1]
												}
											</div>
											<div className={styles.info}>
												<div className={styles.docName}>
													{name}
												</div>
												{url ?
													<div className={`${styles.approved} ${approved === undefined ? styles.pending : approved ? styles.true : styles.false}`}>
														{approved === undefined ?
															<TbClock />
														: approved ?
															<TbCircleCheck />
														:
															<TbCircleX />
														}
													</div>
												:
													<button>
														Upload
													</button>
												}
											</div>
										</motion.div>
									)
								})}
							</div>
						</div>
					</div>
				</>
			}
		</div>
	)
}

export default Profile