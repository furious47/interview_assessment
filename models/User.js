const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('assessment', 'root', 'kaneki', {
  dialect: 'mysql'
})

const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    // unique: true,
  },
  password: {
    type: DataTypes.STRING,
    set(value) {
      const salt = bcrypt.genSaltSync(5);
      const hash = bcrypt.hashSync(value, salt)
      this.setDataValue('password', hash)
    }
  },
  phone: {
    type: DataTypes.BIGINT,
  },
  img: {
    type: DataTypes.STRING,
  }
})

module.exports = { sequelize, User }