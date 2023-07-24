import { ChangeEvent, DragEvent, useRef } from 'react'
import { TbCloudUpload, TbX } from 'react-icons/tb'
import { convertImage } from '../../utils/server'
import { motion, Reorder } from 'framer-motion'
import styles from './styles.module.scss'

const DropImages = ({ images, callback, limit }: {
	images: { id: number, thumb: File }[],
	callback: React.Dispatch<React.SetStateAction<{
		id: number,
		thumb: File
	}[]>>,
	limit?: number
}) => {
	const inputRef = useRef<HTMLInputElement>(null)
	
	const handleDragEnter = (e: DragEvent) => {
		e.currentTarget.classList.add(styles.active)
	}

	const handleMouseLeave = (e: DragEvent) => {
		e.currentTarget.classList.remove(styles.active)
	}

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e: DragEvent) => {
		e.preventDefault()
		e.currentTarget.classList.remove(styles.active)

		if (limit && (images.length >= limit)) return

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0]

			const img = new Image()
			img.src = URL.createObjectURL(file)
			img.addEventListener('load', async () => {
				const newThumb = await convertImage(img, file.name)

				if (newThumb) {
					callback(prev => [{id: images.length + 1, thumb: newThumb}, ...prev])
				}
			})
		}
	}

	const handleFileUp = (e: ChangeEvent<HTMLInputElement>) => {
		if (limit && (images.length >= limit)) return

		if (e.currentTarget.files) {
			const file = e.currentTarget.files[0]

			const img = new Image()
			img.src = URL.createObjectURL(file)
			img.addEventListener('load', async () => {
				const newThumb = await convertImage(img, file.name)

				if (newThumb) {
					callback(prev => [{id: images.length + 1, thumb: newThumb}, ...prev])
				}
			})
			e.currentTarget.value = ''
		}
	}

	const handleDelete = (id: number) => {
		const filteredThumbs = images.filter(x => x.id !== id)

		callback(filteredThumbs)
	}

	return (
		<>
			<div className={styles.uploadFile} onDragEnter={handleDragEnter}
			onDragLeave={handleMouseLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
				<div className={styles.uploadIcon}>
					<TbCloudUpload />
				</div>
				<span className={styles.uploadInfo}>
					Drag & Drop your file here
				</span>
				<span className={styles.or}>Or</span>
				<button type='button' onClick={() => inputRef.current && inputRef.current.click()}>
					Browse Files
				</button>
				<input type="file" name="uploadThumb" id="uploadThumb"
				ref={inputRef} onChange={handleFileUp} />
			</div>
			{images.length > 0 &&
				<motion.div initial={{ opacity: 0, height: 0, padding: 0 }}
				animate={{ opacity: 1, height: 'max-content' }} className={styles.imagesList}>
					<h3>Uploaded Thumbnails</h3>
					<div className={styles.list}>
						<Reorder.Group axis='y' values={images} onReorder={callback} as='div'
						className={styles.reorder}>
							{images.map((thumb: {id: number, thumb: File}) => {
								return (
									<Reorder.Item key={thumb.id} value={thumb}>
										<div key={thumb.id} className={styles.thumbnail}>
											<div className={styles.pic}>
												<img src={URL.createObjectURL(thumb.thumb)} alt="" />
											</div>
											<div className={styles.info}>
												<div className={styles.name}>
													{thumb.thumb.name}
												</div>
												<div className={styles.size}>
													{Intl.NumberFormat('en', {
														notation: 'compact',
														style: 'unit',
														unit: 'byte',
														unitDisplay: 'narrow'
													}).format(thumb.thumb.size)}
												</div>
											</div>
											<div className={styles.delete}
											onClick={() => handleDelete(thumb.id)}>
												<TbX />
											</div>
										</div>
									</Reorder.Item>
								)
							})}
						</Reorder.Group>
					</div>
				</motion.div>
			}
		</>
	)
}

export default DropImages