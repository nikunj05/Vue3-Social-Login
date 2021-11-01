const mongoose = require('mongoose')
const schema = mongoose.Schema

let registerSchema = new schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  confirm_password: {
    type: String,
  },
  emailvalidate: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
})

const Register = mongoose.model('Register', registerSchema)

module.exports = Register
