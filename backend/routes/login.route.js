let express = require('express')
require('dotenv').config()
let router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

    console.log('hi', user)
    if (!user) {
      return res
        .status(401)
        .send({ msg: 'Login failed! Check authentication credentials' })
    } else if (!user.isVerified) {
      return res.status(401).send({
        msg: 'Your Email has not been verified. Please click on resend',
      })
    } else {
      await bcrypt.compare(password, user.password)
      const token = await user.generateAuthToken()
      res.status(201).json({ user, token, msg: 'User successfully logged in.' })
    }
  } catch (err) {
    res.status(400).json({ err: err })
    console.log('error part', err)
  }
})

// Register route
router.route('/register').post(async (req, res) => {
  try {
    // const user = new RegisterModel({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    //   confirm_password: req.body.confirm_password,
    // })

    // here it is calling the method that we created in the model
    // const token = await user.generateAuthToken()
    const { name, email, password, confirm_password } = req.body

    RegisterModel.findOne({ name, email, password, confirm_password }).exec(
      async (err, user) => {
        if (user) {
          return res
            .status(400)
            .json({ error: 'User with this email already exists.' })
        }

        const token = jwt.sign({ email: user.email }, process.env.SECRET, {
          expiresIn: '1hr',
        })

        const msg = {
          from: 'hasti@coderscotch.com',
          to: user.email,
          subject: 'Verify your email',
          text: `
               Hello thanks for registering our site. Please copy and paste the address  below to verify your account.
               http://${process.env.CLIENT_URL}/verify-email?token=${token}
               `,
          html: `
               <h1> Hello </h1>
               <p>Thanks for registering on our site.</p>
               <p>Please click the link below to verify your account.</p>
               <p>Token : ${token}</p>
               <a href="http://${process.env.CLIENT_URL}/verify-email?token=${token}">Verify your account</a>
               `,
        }
        try {
          await sgMail.send(msg)

          // user.isVerified = true
          console.log(
            'Thanks for regestering. please check your email to verify your account.'
          )

          return res.json({
            message:
              'Thanks for regestering. please check your email to verify your account.',
          })
        } catch (err) {
          console.log(err, 'error')
        }

        // let data = await user.save()
        // res.status(201).json({
        //   data,
        //   token,
        //   msg: 'Registred successfully.',
        // })
      }
    )
  } catch (err) {
    res.status(400).json({ err: err })
  }
})

router.route('/verify-email').post(async (req, res) => {
  const { token } = req.body
  if (token) {
    jwt.verify(token, process.end.SECRET, function(err, decodedToken) {
      if (err) {
        return res.status(400).json({ error: 'Incorrect or Expired link' })
      }
      const { name, email, password, confirm_password } = decodedToken
      RegisterModel.findOne({ email }).exec((err, user) => {
        if (user) {
          return res
            .status(400)
            .json({ error: 'User with this email is exists.' })
        }
        let newUser = new RegisterModel({
          name,
          email,
          password,
          confirm_password,
        })
        newUser.save((err, success) => {
          if (err) {
            console.log('error in signup while account activation:', err)
            return res.status(400).json({ error: 'Error activating account' })
          }
          res.json({
            message: 'Signup sucess!',
          })
        })
      })
    })
  } else {
    return res.json({ error: 'Something went wrong!!!' })
  }
  // try {
  //   let user = await RegisterModel.findOne({ token: req.query.token })

  //   if (!user) {
  //     console.log('Token is invalid')
  //     return req.redirect('/register')
  //   }
  //   user.isVerified = true
  //   await user.save()
  //   res.redirect('/login')
  // } catch (error) {
  //   console.log(error)
  //   res.status(400).json({ err: error })
  // }
})

router.route('/confirmation/:email/:token').get(async (req, res) => {
  try {
    RegisterModel.findOne({ token: req.params.token }, function(err, token) {
      // token is not found into database i.e. token may have expired
      if (!token) {
        return res.status(400).send({
          msg:
            'Your verification link may have expired. Please click on resend for verify your Email.',
        })
      }

      // if token is found then check valid user
      else {
        RegisterModel.findOne(
          {
            _id: token._userId,
            email: req.params.email,
          },
          function(err, user) {
            // not valid user
            if (!user) {
              return res.status(401).send({
                msg:
                  'We were unable to find a user for this verification. Please SignUp!',
              })
            }
            // user is already verified
            else if (user.isVerified) {
              return res
                .status(200)
                .send('User has been already verified. Please Login')
            }
            // verify user
            else {
              // change isVerified to true
              user.isVerified = true
              user.save(function(err) {
                // error occur
                if (err) {
                  return res.status(500).send({ msg: err.message })
                }
                // account successfully verified
                else {
                  return res
                    .status(200)
                    .send('Your account has been successfully verified')
                }
              })
            }
          }
        )
      }
    })
  } catch (err) {
    console.log(err, 'err')
    res.status(400).json({ err: err })
  }
})

router.route('/password-reset').post(async (req, res) => {
  try {
    const email = req.body.email
    const user = await RegisterModel.findOne({ email })

    if (!user) {
      return res
        .status(401)
        .json({ error: 'User with this email does not exist.' })
    }
    const token = await user.generateAuthToken()

    res.status(201).json({ user, token })
  } catch (err) {
    console.log(err, 'err')
    res.status(400).json({ err: err })
  }
})

router.route('/password-reset/:userId/:token').post(async (req, res) => {
  try {
    const user = await RegisterModel.findById(req.params.userId)
    if (!user) return res.status(400).send('invalid link or expired')

    const token = await RegisterModel.findOne({
      userId: user._id,
      token: req.params.token,
    })
    if (!token) return res.status(400).send('Invalid link or expired')

    user.password = req.body.password
    await user.save()
    await token.delete()

    res.send('password reset sucessfully.')
  } catch (error) {
    res.send('An error occured')
    console.log(error)
  }
})

module.exports = router
