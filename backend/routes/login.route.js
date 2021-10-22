let express = require('express')
let dotenv = require('dotenv')
let router = express.Router()

dotenv.config()

let RegisterModel = require('../models/Register.js')

router.route('/login').post(async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const user = await RegisterModel.findByCredentials(email, password)
    if (!user) {
      return res
        .status(401)
        .json({ error: 'Login failed! Check authentication credentials' })
    }
    const token = await user.generateAuthToken()

    res.status(201).json({ user, token })
  } catch (err) {
    res.status(400).json({ err: err })
    console.log('error part', err)
  }
})

router.route('/register').post(async (req, res) => {
  try {
    const user = new RegisterModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
    })

    let data = await user.save()

    const token = await user.generateAuthToken() // here it is calling the method that we created in the model

    res.status(201).json({ data, token })
  } catch (err) {
    res.status(400).json({ err: err })
  }
})

module.exports = router
