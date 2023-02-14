import express, { urlencoded } from 'express'
import products from './routes/products'
import carts from './routes/carts'
import image from './routes/image'
import crypto from 'crypto'
import multer from 'multer'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

const actualDir = __dirname.split('/').pop()

const upload = multer({ storage: multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, actualDir !== 'dist' ? __dirname + '/public/images/' : __dirname + '/images')
	},
	filename: (_req, _file, cb) => {
		const name = new Date().getTime().toString() + (Math.random() + 1).toString(36).substring(10)
		const hash = crypto.createHash('md5').update(name, 'utf8').digest('hex')

		cb(null, `${hash}.jpg`)
	}
})}).single('thumb')

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use('/static', express.static(actualDir !== 'dist' ? __dirname + '/public' : __dirname))

app.use(cors())
app.use(upload)

app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/api/image', image)

app.listen(PORT)