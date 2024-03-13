const { isAuth, isAdmin } = require('../../middlewares/auth.js')
const {
  getOrders,
  postOrder,
  updateOrder,
  deleteOrder,
  deleteProductFromOrder
} = require('../controllers/order.js')
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
module.exports = ordersRouter
