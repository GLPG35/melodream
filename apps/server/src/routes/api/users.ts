import { Router } from 'express'
import UserManager from '../../dao/db/userManager'
import { checkToken } from '../../middlewares'
import { verifyToken } from '../../utils'

const router = Router()
const users = new UserManager()

router.get('/', checkToken, (req, res) => {
	if (!(req.token && verifyToken(req.token))) return res.status(403).send({ success: false, message: 'User authorization failed' })
	
	return users.getUsers()
	.then(data => res.send(data))
})

router.put('/:uid', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token) && verifyToken(req.token).userType === 'admin')) return res.status(403).send({ success: false, message: 'User authorization failed' })

	const { uid } = req.params
	const { name, userType } = req.body

	return users.updateUser(uid, { name, userType })
	.then(() => res.send({ success: true, message: 'User updated successfully' }))
	.catch(next)
})

router.delete('/', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token) && verifyToken(req.token).userType === 'admin')) return res.status(403).send({ success: false, message: 'User authorization failed' })
	
	const { body } = req
	
	return users.deleteUsers(body.users)
	.then(() => res.send({ success: true, message: 'User(s) deleted successfully' }))
	.catch(next)
})

router.delete('/inactive', checkToken, (req, res, next) => {
	if (!(req.token && verifyToken(req.token) && verifyToken(req.token).userType === 'admin')) return res.status(403).send({ success: false, message: 'User authorization failed' })

	return users.deleteInactiveUsers()
	.then(() => res.send({ success: true, message: 'Users(s) deleted successfully' }))
	.catch(next)
})

router.get('/docs', (_req, res) => {
	return users.getUsersDocs()
	.then(data => res.send(data))
})

export default router