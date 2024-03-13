const Producto = require('../models/products.js')
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
module.exports = {
  getProducts,
  postProducts,
  updateProducts,
  deleteProducts,
  nameProduct,
  getProductsByPrice
}
