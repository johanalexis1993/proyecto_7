const { isAdmin } = require('../../middlewares/auth.js')
const {
  postRegister,
  postLogin,
  deleteUser,
  getUser
} = require('../controllers/user.js')
const usersRouters = require('express').Router()
usersRouters.get('/', [isAdmin], getUser)
usersRouters.post('/register', postRegister)
usersRouters.post('/login', postLogin)
usersRouters.delete('/:id', [isAdmin], deleteUser)
module.exports = usersRouters
