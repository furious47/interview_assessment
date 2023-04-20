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

// client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+919677629583", channel: "sms" })
//   .then((verification) => console.log(verification.status))
//   .then(() => {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readline.question("Please enter the OTP:", (otpCode) => {
//       client.verify.v2
//         .services(verifySid)
//         .verificationChecks.create({ to: "+919677629583", code: otpCode })
//         .then((verification_check) => console.log(verification_check.status))
//         .then(() => readline.close());
//     });
//   });


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
