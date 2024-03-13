const Pedido = require('../models/order')
const Producto = require('../models/products')
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
  try {
    const newOrder = new Pedido(req.body)
    const productsCopy = req.body.products.map((product) => ({ ...product }))
    let total = 0
    for (const product of productsCopy) {
      total += product.price * product.amount
    }
    for (const product of productsCopy) {
      const productId = product._id
      const amountOrdered = product.amount
      const existingProduct = await Producto.findById(productId)
      if (existingProduct.amount < amountOrdered) {
        throw new Error(
          `No hay suficiente cantidad en inventario para el producto: ${existingProduct.product}`
        )
      }
      existingProduct.amount -= amountOrdered
      await existingProduct.save()
    }
    const savedOrder = await newOrder.save()
    savedOrder.total = total
    await savedOrder.save()
    const orderToSend = {
      ...savedOrder.toObject(),
      products: productsCopy
    }
    return res.status(201).json(orderToSend)
  } catch (error) {
    console.error(`Ha fallado la petición: ${error}`)
    return res.status(400).json({ error: 'Ha fallado la petición' })
  }
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
module.exports = {
  getOrders,
  postOrder,
  updateOrder,
  deleteOrder,
  deleteProductFromOrder
}
