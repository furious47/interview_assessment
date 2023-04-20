const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
    const data = await User.create({ name, email, password, phone, img })
    console.log(data)
    if (!data) {
      res.status(400).json({ message: 'Some error occured' })
    } else {
      res.status(201).json({ message: 'Data Saved Succesfully' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error })
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

module.exports = { register, login };