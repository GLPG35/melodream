import dotenv from 'dotenv'

dotenv.config()

import express, { urlencoded } from 'express'
import home from './routes'
import realtime from './routes/realtimeproducts'
import chat from './routes/chat'
import api from './routes/api'
import crypto from 'crypto'
import multer from 'multer'
import cors from 'cors'
import compression from 'express-compression'
import http from 'http'
import io from './socket'
import passport from 'passport'
import initializePassport from './passport/config'
import { engine } from 'express-handlebars'
import { default404, errorHandler } from './middlewares'
import { dbConnect } from './dao/db'
import cookieParser from 'cookie-parser'

const app = express()
const server = http.createServer(app)

io(server)
dbConnect()

const PORT = process.env.PORT || 3000

const upload = multer({ storage: multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, __dirname + '/public/images/')
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

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(compression({
	brotli: { enabled: true, zlib: {} }
}))
app.use(cookieParser(process.env.SECRET))

initializePassport()
app.use(passport.initialize())

app.use('/static', express.static(__dirname + '/public'))

app.use(cors())
app.use(upload)

//Routes
app.use('/', home)
app.use('/realtimeproducts', realtime)
app.use('/chat', chat)
app.use('/api', api)

app.use(errorHandler)
app.use(default404)

server.listen(PORT)