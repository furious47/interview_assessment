const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const accountSid = process.env.TWILIO_sid;
const authToken = process.env.TWILIO_TOKEN;
const verifySid = process.env.TWILIO_VERIFY;
const client = require('twilio')(accountSid, authToken)

const register = async (req, res) => {
  try {
    // console.log(req.file.filename)
    const img = req.file.filename;
    const { name, email, password } = req.body;
    const isEmail = await User.findOne({ where: { email } })
    if (isEmail) {
      return res.status(400).json({ message: 'Email already exist' })
    }
    let { phone } = req.body;
    phone = Number(phone)
    const service = await client.verify.v2.services
      .create({ friendlyName: 'My First Verify Service' })
    console.log(service.sid);
    client.verify.v2.services(service.sid)
      .verifications
      .create({ to: `+91${phone}`, channel: 'sms' })
    const data = await User.create({ name, email, password, phone, img, otp: service.sid })
    if (!data) {
      res.status(400).json({ message: 'Some error occured' })
    } else {
      res.status(201).json({ message: 'Otp sent' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error })
  }
}


const verification = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const data = await User.findOne({ where: { email } })
    if (!data) {
      res.status(404).json({ message: "Email doesn't exist" })
      return
    }
    const json = data.toJSON()
    const verify = await client.verify.v2.services(json.otp)
      .verificationChecks
      .create({ to: `+91${json.phone}`, code: otp })
    if (verify.status === 'approved') {
      await User.update({ isVerified: true }, { where: { id: json.id } })
      res.status(200).json({ message: 'Your Account Verified' })
    } else { res.status(400).json({ message: "Invalid OTP" }) }
  } catch (error) {
    if (error.code === 20404) {
      res.status(400).json({ message: "Invalid OTP" })
    } else { res.status(500).json({ message: 'Internal Server Error', error }) }
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await User.findOne({ where: { email } })
    if (!data) {
      res.status(404).json({ message: "Email doesn't exist" })
      return
    }
    const json = data.toJSON();
    if (!json.isVerified) {
      return res.status(400).json({ message: 'This account is not verified' })
    }
    const isVallid = await bcrypt.compare(password, json.password);
    const payload = {
      id: json.id,
      name: json.name,
      email: json.email,
      phone: json.phone,
      img: json.img,
    }
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
    if (isVallid) {
      res.status(200).json({ ...payload, token })
    } else {
      res.status(400).json({ message: 'Invalid password' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

module.exports = { register, login, verification };