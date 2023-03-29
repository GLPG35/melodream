import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const uri = `${process.env.DB_URI}`

export const dbConnect = async () => {
	await mongoose.connect(uri)
	.then(() => {
		console.log('Database connected')
	}).catch(err => {
		console.error(err)
	})
}

export const dbDisconnect = () => mongoose.connection.close()