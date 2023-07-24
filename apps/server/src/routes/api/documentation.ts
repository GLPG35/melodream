import { Router } from 'express'
import UserManager from '../../dao/db/userManager'
import { checkToken } from '../../middlewares'
import { verifyToken } from '../../utils'

const router = Router()
const users = new UserManager()

router.get('/', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ success: false, message: 'You must be logged in to perform this action' })

	const { email } = verifyToken(req.token)

	return users.getDocumentation(email)
	.then((documentation) => res.send({ documentation }))
	.catch(next)
})

router.post('/', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ succes: false, message: 'You must be logged in to perform this action' })
	
	const { id, url } = req.body
	const { email } = verifyToken(req.token)

	return users.addDocumentation(email, id, url)
	.then(() => res.send({ success: true, message: 'Document uploaded successfully' }))
	.catch(next)
})

router.post('/approve', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token) && verifyToken(req.token).userType === 'admin')) return res.status(403).send({ succes: false, message: 'You must be logged in to perform this action' })

	const { id, email } = req.body
	
	return users.updateDocumentation(email, id, true)
	.then(() => res.send({ success: true, message: 'Document approved successfully' }))
	.catch(next)
})

router.post('/reject', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token) && verifyToken(req.token).userType === 'admin')) return res.status(403).send({ succes: false, message: 'You must be logged in to perform this action' })

	const { id, email } = req.body
	
	return users.updateDocumentation(email, id, false)
	.then(() => res.send({ success: true, message: 'Document rejected successfully' }))
	.catch(next)
})

export default router