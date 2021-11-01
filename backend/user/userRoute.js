const userRouter = require('express').Router()
const actions = require('./userAction')
const validate = require('./userValidator')

userRouter
  .route('/register')
  .post([validate.validateSignUp], (req, res, next) => {
    actions.registerUser(req, res, next)
  })

userRouter.route('/login').post([validate.validateLogin], (req, res, next) => {
  actions.loginUser(req, res, next)
})

userRouter.route('/forgotPassword').post([], (req, res) => {
  actions.forgotPassword(req, res)
})

userRouter.route('/reset/:token').get([], (req, res) => {
  actions.getresetpassword(req, res)
})

userRouter.route('/reset/:token').post([], (req, res) => {
  actions.resetpassword(req, res)
})

userRouter.route('/validateemail/:id').get([], (req, res) => {
  actions.getvalidateemail(req, res)
})

userRouter.route('/validateemail/:id').post([], (req, res) => {
  actions.validateemail(req, res)
})

module.exports = userRouter
