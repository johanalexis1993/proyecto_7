/*require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectBD } = require('./src/config/db.js')
const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema(
  {
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      }
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productos',
        required: true
      }
    ],
    total: {
      type: Number,
      default: 0.0
    },
    status: {
      type: String,
      default: 'Pendiente'
    }
  },
  {
    timestamps: true,
    collection: 'pedidos'
  }
)
const Pedido = mongoose.model('pedidos', orderSchema, 'pedidos')
const productsSchema = new mongoose.Schema(
  {
    imgUrl: {
      type: String
    },
    product: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      default: 1
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    supplier: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'productos'
  }
)
const Producto = mongoose.model('productos', productsSchema, 'productos')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    rol: { type: String, required: true, default: 'User' },
    imgUrl: {
      type: String
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)
userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 11)
})
const User = mongoose.model('users', userSchema, 'users')
const getOrders = async (req, res, next) => {
  try {
    const orders = await Pedido.find().populate('user').populate('products')
    return res.status(200).json(orders)
  } catch (error) {
    console.error(`No se enconstro ningun producto por el ${error}`)
    return res.status(400).json({ error: 'No se enconstro ningun producto' })
  }
}
const postOrder = async (req, res, next) => {
// ayudame aqui
}
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params
    const oldOrder = await Pedido.findById(id)
    const newOrder = new Pedido(req.body)
    newOrder._id = id
    newOrder.products = [...oldOrder.products, ...req.body.products]
    const updatedOrder = await Pedido.findByIdAndUpdate(id, newOrder, {
      new: true
    })
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    return res.status(200).json(updatedOrder)
  } catch (error) {
    console.error(`Ha fallado la petición: ${error}`)
    return res.status(400).json({ error: 'Ha fallado la petición' })
  }
}
const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params
    const deletedOrder = await Pedido.findByIdAndDelete(id)
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    return res
      .status(200)
      .json({ message: 'Pedido eliminado correctamente', deletedOrder })
  } catch (error) {
    console.error(`Ha fallado la petición: ${error}`)
    return res.status(400).json({ error: 'Ha fallado la petición' })
  }
}
const deleteProductFromOrder = async (req, res, next) => {
  try {
    const { orderId, productId, quantity } = req.params
    const order = await Pedido.findById(orderId).populate('products')
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    const productIndex = order.products.findIndex(
      (product) => product._id.toString() === productId
    )
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ error: 'Producto no encontrado en el pedido' })
    }
    const productPrice = order.products[productIndex].price || 0
    const productAmount = order.products[productIndex].amount || 0
    const deleteQuantity = quantity || productAmount
    order.total = (order.total || 0) - productPrice * deleteQuantity
    if (deleteQuantity < productAmount) {
      order.products[productIndex].amount -= deleteQuantity
    } else {
      order.products.splice(productIndex, 1)
    }
    const updatedOrder = await order.save()
    return res.status(200).json(updatedOrder)
  } catch (error) {
    console.error(`Error al eliminar el producto del pedido: ${error}`)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
const getProductsByPrice = async (req, res, next) => {
  try {
    const { precio } = req.params
    const product = await Producto.find({ price: { $lte: precio } })
    !product
      ? res.status(404).json({ error: 'no hay productos con ese precio' })
      : res.status(200).json(product)
  } catch (error) {
    console.error(`no hay productos con ese precio por el ${error}`)
    return res.status(400).json({ error: 'no hay productos con ese precio' })
  }
}
const nameProduct = async (req, res) => {
  try {
    const { nombre } = req.params
    const producto = await Producto.findOne({ product: nombre })
    !producto
      ? res.status(404).json({ error: 'No se encontro el nombre del producto' })
      : res.status(200).json(producto)
  } catch (error) {
    console.error(`No se encontro un producto con ese nombre por el ${error}`)
    return res
      .status(500)
      .json({ error: 'No se encontro el nombre del producto' })
  }
}
const getProducts = async (req, res, next) => {
  try {
    const allProducts = await Producto.find()
    return res.status(200).json(allProducts)
  } catch (error) {
    console.error(`No se enconstro ningun producto por el ${error}`)
    return res.status(400).json({ error: 'No se enconstro ningun producto' })
  }
}
const postProducts = async (req, res, next) => {
  try {
    const newProduct = new Producto(req.body)
    const productSave = await newProduct.save()
    return res.status(201).json(productSave)
  } catch (error) {
    console.error(`No se a pido crear el producto por el ${error}`)
    return res.status(400).json({ error: `No se a pido crear el producto` })
  }
}
const updateProducts = async (req, res, next) => {
  try {
    const { id } = req.params
    const newProducto = new Producto(req.body)
    newProducto._id = id
    const updatedProduct = await Producto.findByIdAndUpdate(id, newProducto, {
      new: true
    })
    !updatedProduct
      ? res.status(404).json({ error: 'No se ha actualizado el producto' })
      : res.status(200).json(updatedProduct)
  } catch (error) {
    console.error(`No se ha actualizado el producto por el ${error}`)
    return res.status(400).json({ error: 'No se ha actualizado el producto' })
  }
}
const deleteProducts = async (req, res, next) => {
  try {
    const { id } = req.params
    const productDeleted = await Producto.findByIdAndDelete(id)
    !productDeleted
      ? res.status(404).json({ error: 'No se ha  eliminado el producto' })
      : res.status(200).json(productDeleted)
  } catch (error) {
    console.error(`No se ha  eliminado el producto por el ${error}`)
    return res.status(400).json({ error: 'No se ha  eliminado el producto' })
  }
}
const jwk = require('jsonwebtoken')
const generateSign = (id) =>
  jwk.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1y' })
const verifyJwk = (token) => jwk.verify(token, process.env.JWT_SECRET)
const postRegister = async (req, res, next) => {
  try {
    const newUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      rol: 'User'
    })
    const userDuplicated = await User.findOne({ userName: req.body.userName })
    userDuplicated
      ? res.status(400).json('este usuario ya existe')
      : ((userSaved = await newUser.save()), res.status(201).json(userSaved))
  } catch (error) {
    console.error(`No se a podido crear el USUARIO por el ${error}`)
    return res.status(400).json({ error: `No se a podido crear el usuario` })
  }
}
const postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ userName: req.body.userName })
    user && bcrypt.compareSync(req.body.password, user.password)
      ? res.status(200).json({ user, token: generateSign(user._id) })
      : res.status(400).json({ error: 'Usuario o contraseña incorrectos' })
  } catch (error) {
    console.error(`No se a podido crear el USUARIO por el ${error}`)
    return res.status(400).json({ error: `No se a podido crear el usuario` })
  }
}
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const userDeleted = await User.findByIdAndDelete(id)
    return res.status(200).json({ msg: 'usuario eliminado', userDeleted })
  } catch (error) {
    console.error(`No se a podido borrar el USUARIO por el ${error}`)
    return res.status(400).json({ error: `No se a podido borrar el usuario` })
  }
}
const getUser = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    console.error(`ha fallado la peticion por el ${error}`)
    return res.status(400).json({ error: `ha fallado la peticion` })
  }
}
const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).json({ msg: 'No estás autorizado' })
    }
    const parsedToken = token.replace('Bearer ', '').trim()
    const { id } = verifyJwk(parsedToken)
    const user = await User.findById(id)
    user.password = null
    req.user = user
    next()
  } catch (error) {
    console.error('Error de token:', error)
    return res.status(401).json({ error: 'Token inválido' })
  }
}
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).json({ msg: 'No estás autorizado' })
    }
    const parsedToken = token.replace('Bearer ', '').trim()
    const { id } = verifyJwk(parsedToken)
    const user = await User.findById(id)
    user.rol === 'Admin'
      ? ((user.password = null), (req.user = user), next())
      : res.status(400).json('necesitas permiso de administrador')
  } catch (error) {
    console.error('Error de token:', error)
    return res.status(401).json({ error: 'Token inválido' })
  }
}
const ordersRouter = require('express').Router()
ordersRouter.get('/', [isAdmin], getOrders)
ordersRouter.post('/', [isAuth], postOrder)
ordersRouter.put('/:id', [isAdmin], updateOrder)
ordersRouter.delete(
  '/borrar/pedido/:orderId/producto/:productId/cantidad/:quantity',
  [isAdmin],
  deleteProductFromOrder
)
ordersRouter.delete('/:id', [isAdmin], deleteOrder)
const productRouters = require('express').Router()
productRouters.get('/nombre/:nombre', nameProduct)
productRouters.get('/:precio', getProductsByPrice)
productRouters.get('/', getProducts)
productRouters.post('/', [isAdmin], postProducts)
productRouters.put('/:id', [isAdmin], updateProducts)
productRouters.delete('/:id', [isAdmin], deleteProducts)
const usersRouters = require('express').Router()
usersRouters.get('/', [isAdmin], getUser)
usersRouters.post('/register', postRegister)
usersRouters.post('/login', postLogin)
usersRouters.delete('/:id', [isAdmin], deleteUser)
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
})*/
