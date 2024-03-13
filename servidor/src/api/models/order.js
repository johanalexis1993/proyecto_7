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
module.exports = Pedido
