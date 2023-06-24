import { Router } from 'express'
import CategoryManager from '../../dao/db/categoryManager'
import passport from 'passport'

const router = Router()

const categories = new CategoryManager()

router.get('/', (_req, res) => {
	return categories.getCategories()
	.then(categories => {
		return res.send(categories)
	})
})

router.post('/',  passport.authenticate('jwt', { session: false }), (req, res, next) => {
	const { name } = req.body
	
	return categories.addCategory(name)
	.then(() => {
		return res.send({ success: true, message: 'Category added successfully' })
	}).catch(err => {
		return next(err)
	})
})

export default router