import { Router } from 'express'
import login from './login'
import register from './register'
import logout from './logout'
import products from './products'
import image from './image'
import carts from './carts'

const router = Router()

router.use('/login', login)
router.use('/register', register)
router.use('/logout', logout)
router.use('/products', products)
router.use('/image', image)
router.use('/carts', carts)

export default router