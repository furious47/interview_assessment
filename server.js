require('dotenv').config()
const express = require('express');
const app = express()
const { sequelize } = require('./models/User')
const routes = require('./router/userRoute')

//middlewares
app.use(express.json())

//routes
app.use('/auth', routes)

const port = 3000;

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(port, () => {
      console.log(`Server is on litening on ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()