require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectBD } = require('./src/config/db.js')
const ordersRouter = require('./src/api/routes/order.js')
const productRouters = require('./src/api/routes/products.js')
const usersRouters = require('./src/api/routes/user.js')
const app = express()
connectBD()
app.use(express.json())
app.use(cors())
app.use('/api/v1/pedidos', ordersRouter)
app.use('/api/v1/productos', productRouters)
app.use('/api/v1/users', usersRouters)
app.use('*', (req, res, next) => res.status(404).json('rute not  found'))
app.listen(3000, () => {
  console.log('http://localhost:3000')
})
