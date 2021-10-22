const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let registerSchema = mongoose.Schema({
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
})

// converting password into hash

registerSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
    user.confirm_password = await bcrypt.hash(user.confirm_password, 8)
  }
  next()
})

// generating tokens

registerSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id }, 'secret')
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

//this method search for a user by email and password.
registerSchema.statics.findByCredentials = async (email, password) => {
  const user = await Register.findOne({ email })

  if (!user) {
    throw new Error({ error: 'Invalid login details' })
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login details' })
  }
  return user
}

const Register = mongoose.model('Register', registerSchema)
module.exports = Register
