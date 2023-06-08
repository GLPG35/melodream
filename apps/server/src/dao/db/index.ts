import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { logger } from '../../utils/logger'

dotenv.config()

const uri = `${process.env.DB_URI}`

export const dbConnect = async () => {
	await mongoose.connect(uri)
	.then(() => {
		logger.info('Database connected')
	}).catch(err => {
		logger.error(err)
	})
}

export const dbDisconnect = () => mongoose.connection.close()