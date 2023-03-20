import { Router } from 'express'
import products from './products'
import image from './image'
import carts from './carts'

const router = Router()

router.use('/products', products)
router.use('/image', image)
router.use('/carts', carts)

export default router