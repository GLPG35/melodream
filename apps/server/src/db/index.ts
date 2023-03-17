import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const uri = `mongodb+srv://GLPG35:${process.env.DB_PASSWORD}@cluster0.aphr9ez.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

export const dbConnect = async () => {
	await mongoose.connect(uri)
	.then(() => {
		console.log('Database connected')
	}).catch(err => {
		console.error(err)
	})
}

export const dbDisconnect = () => mongoose.connection.close()