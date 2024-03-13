const User = require('../api/models/user.js')
const { verifyJwk } = require('../utils/jwk.js')
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
module.exports = { isAuth, isAdmin }
