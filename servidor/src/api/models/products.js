const mongoose = require('mongoose')
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
module.exports = Producto
