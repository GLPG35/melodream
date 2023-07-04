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
import { addLogger } from './utils/logger'
import { __root } from './paths'
import { globSync } from 'glob'
import swaggerUiExpress, { SwaggerUiOptions } from 'swagger-ui-express'

const app = express()
const server = http.createServer(app)

io(server)
dbConnect()

const PORT = process.env.PORT || 3000

const upload = multer({ storage: multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, __root + '/public/images/')
	},
	filename: (_req, _file, cb) => {
		const name = new Date().getTime().toString() + (Math.random() + 1).toString(36).substring(10)
		const hash = crypto.createHash('md5').update(name, 'utf8').digest('hex')

		cb(null, `${hash}.jpg`)
	}
})}).single('thumb')

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __root + '/views')

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(compression({
	brotli: { enabled: true, zlib: {} }
}))
app.use(cookieParser(process.env.SECRET))
app.use(addLogger)

initializePassport()
app.use(passport.initialize())

app.use('/static', express.static(__root + '/public'))

//Docs
const options: SwaggerUiOptions = {
	explorer: true,
	swaggerOptions: {
		urls: globSync(`${__root}/public/docs/*.json`).map(route => {
			const filename = route.split('/').pop() as string
			
			return {
				url: `/static/docs/${filename}`,
				name: filename.charAt(0).toUpperCase() + filename.split('.').shift()?.slice(1)
			}
		})
	}
}

app.use ('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(undefined, options))

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