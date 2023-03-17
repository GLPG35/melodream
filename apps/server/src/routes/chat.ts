import { Router } from 'express'
import Message from '../db/Message'

const router = Router()

router.get('/', async (_req, res) => {
	const messages = await Message.find({}).lean()
		.then(doc => doc)
		.catch(err => { throw new Error(err.message) })

	const body = {
		title: 'Chat',
		messages
	}

	res.render('chat', body)
})

export default router