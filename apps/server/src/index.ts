import express, { urlencoded } from 'express'
import home from './routes'
import realtime from './routes/realtimeproducts'
import products from './routes/products'
import carts from './routes/carts'
import image from './routes/image'
import crypto from 'crypto'
import multer from 'multer'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'

const app = express()
const server = http.createServer(app)
const io = new Server(server)
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

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
app.set('socketio', io)

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use('/static', express.static(actualDir !== 'dist' ? __dirname + '/public' : __dirname))

app.use(cors())
app.use(upload)

app.use('/', home)
app.use('/realtimeproducts', realtime)
app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/api/image', image)

server.listen(PORT)