import express, { Request, Response } from 'express'
import crypto from 'crypto'
import multer from 'multer'
import { __root } from '../../paths'
import { verifyToken } from '../../utils'
import { checkToken } from '../../middlewares'
import UserManager from '../../dao/db/userManager'
import fs from 'fs/promises'

const router = express.Router()
const users = new UserManager()

const upload = multer({ storage: multer.diskStorage({
	destination: async (req, _file, cb) => {
		let user: string
		let userPath: any
		const { type } = req.query
		const typeDictionary = [
			{
				type: 'pfp',
				path: '/public/images/users/{user}/profile/'
			},
			{
				type: 'doc',
				path: '/public/images/users/{user}/documentation/'
			}
		]

		if (req.token && verifyToken(req.token)) {
			const { email } = verifyToken(req.token)
			user = await users.getUser(email).then(user => user ? user.id : null)

			if (user) {
				const path = typeDictionary.find(x => x.type === type)?.path
				
				if (path) {
					userPath = __root + path.replace(/{user}/gim, user)
					await fs.mkdir(userPath, { recursive: true })
				}
			}
		}

		cb(null, userPath || __root + '/public/images/thumbs/')
	},
	filename: (_req, _file, cb) => {
		const name = new Date().getTime().toString() + (Math.random() + 1).toString(36).substring(10)
		const hash = crypto.createHash('md5').update(name, 'utf8').digest('hex')

		cb(null, `${hash}.jpg`)
	}
})}).single('thumb')

router.post('/upload', [checkToken, upload], (req: Request, res: Response) => {
	if (req.file) {
		const findDest = req.file.destination.split('/').findIndex(x => x === 'images')
		const dest =  req.file.destination.split('/').slice(findDest + 1).join('/')
		const path = `/static/images/${dest}/${req.file.filename}`

		return res.send({ success: true, path })
	}

	return res.status(500).send({ success: false, message: 'File not uploaded' })
})

export default router