import { Router } from 'express'
import login from './login'
import register from './register'
import superstar from './superstar'
import logout from './logout'
import products from './products'
import categories from './categories'
import image from './image'
import carts from './carts'
import orders from './orders'
import mocks from './mocks'
import testLogs from './testLogs'

const router = Router()

router.use('/login', login)
router.use('/register', register)
router.use('/superstar', superstar)
router.use('/logout', logout)
router.use('/products', products)
router.use('/categories', categories)
router.use('/image', image)
router.use('/carts', carts)
router.use('/orders', orders)
router.use('/mocks', mocks)
router.use('/testLogs', testLogs)

export default router