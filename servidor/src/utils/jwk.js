const jwk = require('jsonwebtoken')
const generateSign = (id) =>
  jwk.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1y' })
const verifyJwk = (token) => jwk.verify(token, process.env.JWT_SECRET)
module.exports = { generateSign, verifyJwk }
