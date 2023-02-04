import express from 'express'
import products from './routes/products'

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/products', products)

app.listen(PORT)