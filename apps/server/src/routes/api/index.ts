import { Router } from 'express'
import login from './login'
import register from './register'
import users from './users'
import profile from './profile'
import documentation from './documentation'
import superstar from './superstar'
import logout from './logout'
import products from './products'
import categories from './categories'
import image from './image'
import carts from './carts'
import orders from './orders'
import mocks from './mocks'
import testLogs from './testLogs'
import snippets from './snippets'

const router = Router()

router.use('/login', login)
router.use('/register', register)
router.use('/users', users)
router.use('/profile', profile)
router.use('/documentation', documentation)
router.use('/superstar', superstar)
router.use('/logout', logout)
router.use('/products', products)
router.use('/categories', categories)
router.use('/image', image)
router.use('/carts', carts)
router.use('/orders', orders)
router.use('/mocks', mocks)
router.use('/testLogs', testLogs)
router.use('/snippets', snippets)

export default router