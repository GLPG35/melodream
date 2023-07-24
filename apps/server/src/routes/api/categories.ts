import { Router } from 'express'
import CategoryManager from '../../dao/db/categoryManager'
import passport from 'passport'

const router = Router()

const categories = new CategoryManager()

router.get('/', (_req, res) => {
	return categories.getCategories()
	.then(categories => res.send(categories))
})

router.post('/',  passport.authenticate('jwt', { session: false }), (req, res, next) => {
	const { name } = req.body
	
	return categories.addCategory(name)
	.then(() => res.send({ success: true, message: 'Category added successfully' }))
	.catch(next)
})

export default router