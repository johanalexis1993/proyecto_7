const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const { generateSign } = require('../../utils/jwk.js')
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
module.exports = { postRegister, postLogin, deleteUser, getUser }
