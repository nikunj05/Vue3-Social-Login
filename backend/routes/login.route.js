let express = require('express')
require('dotenv').config()
let router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_APIKEY)

// Define model
let RegisterModel = require('../models/Register.js')

// Login route
router.route('/login').post(async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const user = await RegisterModel.findOne({ email })
    // const user = await RegisterModel.findByCredentials(email, password)
    console.log(user, 'user')
    if (!user) {
      return res
        .status(401)
        .send({ error: 'Login failed! Check authentication credentials' })
    } else if (!user.isVerified) {
      return res.status(401).send({
        error: 'Your Email has not been verified.',
      })
    } else {
      await bcrypt.compare(password, user.password)
      const token = await user.generateAuthToken()
      res
        .status(201)
        .json({ user, token, message: 'User successfully logged in.' })
    }
  } catch (err) {
    res.status(400).json({ err: err })
    console.log('error part', err)
  }
})

// Register route
router.route('/register').post(async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body

    RegisterModel.findOne({ email }).exec(async (err, user) => {
      if (user) {
        return res
          .status(400)
          .json({ error: 'User with this email already exists.' })
      }

      const token = jwt.sign({ email }, process.env.SECRET, {
        expiresIn: '1hr',
      })

      let transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: '766788b2d7f49e',
          pass: 'ee68a95b3f6878',
        },
      })

      let newUser = new RegisterModel({
        name,
        email,
        password,
        confirm_password,
        isVerified: true,
      })

      const msg = {
        from: 'hasti@coderscotch.com',
        to: email,
        subject: 'Verify your email',
        text: `
               Hello thanks for registering our site. Please copy and paste the address  below to verify your account.
               http://${process.env.CLIENT_URL}/verify-email
               `,
        html: `
               <h1> Hello </h1>
               <p>Thanks for registering on our site.</p>
               <p>Please click the link below to verify your account.</p>
               `,
      }
      try {
        await transport.sendMail(msg, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log(info)
          }
        })

        newUser.save()

        return res.json({
          newUser,
          token,
          message:
            'Thanks for regestering. please check your email to verify your account.',
        })
      } catch (err) {
        console.log(err, 'error')
      }
    })
  } catch (err) {
    res.status(400).json({ err: err })
  }
})

router.route('/password-reset').post(async (req, res) => {
  try {
    const email = req.body.email

    await RegisterModel.findOne({ email }).exec(async function(err, user) {
      if (!user) {
        return res
          .status(400)
          .json({ error: 'No account with that email address exists.' })
      }
      const token = await user.generateAuthToken()

      user.save(function(err) {
        console.log(err, 'err')
      })

      let transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: '766788b2d7f49e',
          pass: 'ee68a95b3f6878',
        },
      })

      const msg = {
        from: 'hasti@coderscotch.com',
        to: email,
        subject: ' Password Reset',
        html:
          'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' +
          req.headers.host +
          '/reset/' +
          token +
          '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      }
      await transport.sendMail(msg, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info)
        }
      })

      return res.status(201).json({ message: 'Password reset email sent.' })
    })
  } catch (err) {
    console.log(err, 'err')
    res.status(400).json({ err: err })
  }
})

router.route('/reset/:token').get(async (req, res) => {
  const { token } = req.params.token
  if (token) {
    await jwt.verify(token, process.env.SECRET, function(err, user) {
      if (err) {
        return res
          .status(400)
          .json({ error: 'Password reset token is invalid or has expired.' })
      }
      return res.render('reset', {
        user: user,
      })
    })
  }
})

router.route('/reset/:token').post(async (req, res) => {
  const token = req.params.token

  if (token) {
    await jwt.verify(token, process.env.SECRET, async function(err, user) {
      if (err) {
        return res
          .status(400)
          .json({ error: 'Password reset token is invalid or has expired.' })
      }

      user.password = req.body.password

      return res.status(201).json({ message: 'Password reset successfully' })
    })
  }
})

module.exports = router
