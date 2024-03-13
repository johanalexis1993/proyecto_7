const mongoose = require('mongoose')
const connectBD = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('conectado a la BBDD💪')
  } catch (error) {
    console.error('Error conectando con la BBDD👊', error)
  }
}
module.exports = { connectBD }
