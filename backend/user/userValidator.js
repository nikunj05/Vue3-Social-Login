const code = require('../constants').http_codes
const msg = require('../constants').messages
const userdao = require('../user/userDao')

async function validateSignUp(req, res, next) {
  if (
    req.body.name &&
    req.body.email &&
    req.body.password &&
    req.body.confirm_password
  ) {
    var name = req.body.name.trim(),
      email = req.body.email.trim(),
      password = req.body.password.trim(),
      confirm_password = req.body.confirm_password.trim()
    if (name && email && password && confirm_password) {
      let query = { email: email }
      if (await userdao.findone(query)) {
        return res.json({
          code: code.badRequest,
          message: msg.emailAlreadyRegistered,
        })
      } else {
        if (email) {
          return res.json({
            code: code.badRequest,
            message: msg.invalidEmail,
          })
        } else if (true != password) {
          return res.json({
            code: code.badRequest,
            message: password,
          })
        } else if (true != confirm_password) {
          return res.json({
            code: code.badRequest,
            message: confirm_password,
          })
        } else {
          next()
        }
      }
    } else {
      return res.json({ code: code.badRequest, message: msg.invalidBody })
    }
  } else {
    return res.json({ code: code.badRequest, message: msg.invalidBody })
  }
}

async function validateLogin(req, res, next) {
  const { email, password } = req.body
  if (email && password) {
    next()
  } else {
    return res.json({ code: code.badRequest, message: msg.invalidBody })
  }
}

module.exports = {
  validateSignUp,
  validateLogin,
}
