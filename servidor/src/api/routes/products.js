const { isAdmin } = require('../../middlewares/auth.js')
const {
  getProducts,
  postProducts,
  updateProducts,
  deleteProducts,
  nameProduct,
  getProductsByPrice
} = require('../controllers/products.js')
const productRouters = require('express').Router()
productRouters.get('/nombre/:nombre', nameProduct)
productRouters.get('/:precio', getProductsByPrice)
productRouters.get('/', getProducts)
productRouters.post('/', [isAdmin], postProducts)
productRouters.put('/:id', [isAdmin], updateProducts)
productRouters.delete('/:id', [isAdmin], deleteProducts)
module.exports = productRouters
