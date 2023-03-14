import { Router } from 'express'
import * as fs from 'fs/promises'

const router = Router()
const actualDir = __dirname.split('/').pop()

router.get('/', async (_req, res) => {
	const messages = await fs.readFile(__dirname + `/${actualDir !== 'dist' ? '../' : ''}public/messages.json`, 'utf-8' )
		.then(data => JSON.parse(data))
		.catch(() => [])

	const body = {
		title: 'Chat',
		messages
	}

	res.render('chat', body)
})

export default router