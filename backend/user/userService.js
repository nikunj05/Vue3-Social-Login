const util = require('../app util/util')
const bcrypt = require('bcrypt')
const user = require('../schema/user')
const userdao = require('../user/userDao')
const code = require('../constants').http_codes
const msg = require('../constants').messages
const crypto = require('crypto')

async function registerUser(req, res) {
  const passwordHash = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  )
  req.body.password = passwordHash
  const confirmPwdHash = bcrypt.hashSync(
    req.body.confirm_password,
    bcrypt.genSaltSync(10)
  )
  req.body.confirm_password = confirmPwdHash

  const data = req.body

  return userdao
    .create(data)
    .then(async (result) => {
      let link =
        'https://' +
        process.env.DOMAIN_NAME +
        '/api/user/validateemail/' +
        result._id
      let data = {
        username: result.firstname,
        subject: 'Squad XYZ: Validate Your EmailID for SQUAD',
        html: `Hi ${result.firstname} <br /> 
                Please click on here:<a href="${link}"> Squad XYZ</a> to Validate Your EmailID. <br /><br /> 
                If you did not request this, please ignore this email.<br /> <br />Best Regards,<br />Squad XYZ Team`,
      }
      await util.sendEmail(result.email, data).then((data) => {
        data == true
          ? res.json({ code: code.ok, message: `Link send on ${result.email}` })
          : res.json({ code: code.notImplemented, message: msg.mailNotSent })
        res.json({
          code: code.created,
          message:
            msg.registered + ' ' + `Validation Link send on ${result.email}`,
        })
      })

      if (data == true) {
        let tokn = util.generateToken(result, process.env.USER_SECRET)
        var dataresponse = {
          _id: result._id,
          name: result.name,
          email: result.email,
          token: tokn,
        }
      }

      res.json({
        code: code.created,
        message: msg.registered,
        data: dataresponse,
      })
    })
    .catch((err) => {
      console.log('createUser -> err', err)
      res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}

function validateemail(req, res) {
  let query = { _id: req.params.id },
    update = { emailvalidate: true }
  userdao
    .findOneAndUpdate(query, update)
    .then((user) => {
      if (!user) return res.json({ code: code.notFound, message: msg.notFound })
      else res.json({ code: code.ok, message: msg.emailvalidate })
    })
    .catch((err) => {
      res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}

function getvalidateemail(req, res) {
  let query = { _id: req.params.id }
  userdao
    .findone(query)
    .then((user) => {
      if (!user)
        return res.send(
          '<style>*{transition:all .6s}html{height:100%}body{font-family:Lato,sans-serif;color:#888;margin:0}#main{display:table;width:100%;height:100vh;text-align:center}.fof{display:table-cell;vertical-align:middle}.fof h1{font-size:50px;display:inline-block;padding-right:12px;animation:type .5s alternate infinite}@keyframes type{from{box-shadow:inset -3px 0 0 #888}to{box-shadow:inset -3px 0 0 transparent}}</style><div id="main"><div class="fof"><h1>Your Requested Link is Expired</h1></div></div>'
        )
      else {
        console.log('h-----------------------------')
        res.render('validateemail.jade', { user })
      }
    })
    .catch((err) => {
      console.log('getresetpassword -> err', err)
      res.send(
        '<style>*{transition:all .6s}html{height:100%}body{font-family:Lato,sans-serif;color:#888;margin:0}#main{display:table;width:100%;height:100vh;text-align:center}.fof{display:table-cell;vertical-align:middle}.fof h1{font-size:50px;display:inline-block;padding-right:12px;animation:type .5s alternate infinite}@keyframes type{from{box-shadow:inset -3px 0 0 #888}to{box-shadow:inset -3px 0 0 transparent}}</style><div id="main"><div class="fof"><h1>Your Requested Link is Expired</h1></div></div>'
      )
    })
}

function loginUser(req, res) {
  return user
    .findOne({ email: req.body.email })
    .then(async (result) => {
      if (result) {
        if (result.active == false) {
          return res.json({ code: code.forbidden, message: msg.deacacc })
        }

        const match = await bcrypt.compare(req.body.password, result.password)

        if (match) {
          let tokn = util.generateToken(result, process.env.SECRET, '720hr')
          var data = {
            _id: result._id,
            name: result.name,
            email: result.email,
            token: tokn,
          }
          if (result.emailvalidate == true) {
            return res.json({ code: code.ok, data: data })
          } else if (result.emailvalidate == false) {
            let link =
              'https://' +
              process.env.DOMAIN_NAME +
              '/api/user/validateemail/' +
              result._id
            let data = {
              username: result.firstname,
              subject: 'Squad XYZ: Validate Your EmailID for SQUAD',
              html: `Hi ${result.firstname} <br /> 
                        Please click on here:<a href="${link}"> Squad XYZ</a> to Validate Your EmailID. <br /><br /> 
                        If you did not request this, please ignore this email.<br /> <br />Best Regards,<br />Squad XYZ Team`,
            }
            await util.sendEMail(result.email, data).then((data) => {
              data == true
                ? res.json({
                    code: '400',
                    message: `Please verify your account first. Verification link sent to ${result.email}`,
                  })
                : res.json({
                    code: code.notImplemented,
                    message: msg.mailNotSent,
                  })
              res.json({
                code: code.created,
                message:
                  msg.registered +
                  ' ' +
                  `Validation Link send on ${result.email}`,
              })
            })
          } else {
            return res.json({
              code: code.badRequest,
              message: msg.incorrectpass,
            })
          }
        }
      } else {
        return res.json({ code: code.notFound, message: msg.notFound })
      }
    })
    .catch((err) => {
      console.log('login -> err=>', err)
      res.json({ code: code.ineternalError, message: msg.internalServerError })
    })
}

function forgotPassword(req, res) {
  let query = { email: req.body.email }
  userdao.findone(query).then((result) => {
    if (!result) return res.json({ code: code.notFound, message: msg.notFound })
    else {
      let token = crypto.randomBytes(20).toString('hex'),
        expiry = Date.now() + 3600000,
        query = { email: req.body.email },
        update = {
          $set: {
            resetPasswordToken: token,
            resetPasswordExpires: expiry,
          },
        },
        options = { new: true }
      userdao.findOneAndUpdate(query, update, options).then(async (user) => {
        let link =
          'https://' +
          process.env.DOMAIN_NAME +
          '/api/user/reset/' +
          user.resetPasswordToken

        let data = {
          username: user.firstname,
          subject: 'Reset password',
          html: `Hello ${user.firstname}! <br>
                    Someone has requested to change your password.
                    You can do this through the link below. <br>
                   
                    here: <a href="${link}">Reset Password</a> <br>
                    If you didn't request this, please ignore this email. <br>
                    Your password won't change until you access the link above and create a new one. <br /><br />Best Regards.`,
        }
        await util.sendEMail(user.email, data).then((data) => {
          return data == true
            ? res.json({
                code: code.ok,
                message: `Link send on ${result.email}`,
              })
            : res.json({
                code: code.notImplemented,
                message: msg.mailNotSent,
              })
        })
      })
    }
  })
}

function getresetpassword(req, res) {
  let query = {
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  }

  userdao
    .findone(query)
    .then((user) => {
      if (!user)
        return res.send(
          '<style>*{transition:all .6s}html{height:100%}body{font-family:Lato,sans-serif;color:#888;margin:0}#main{display:table;width:100%;height:100vh;text-align:center}.fof{display:table-cell;vertical-align:middle}.fof h1{font-size:50px;display:inline-block;padding-right:12px;animation:type .5s alternate infinite}@keyframes type{from{box-shadow:inset -3px 0 0 #888}to{box-shadow:inset -3px 0 0 transparent}}</style><div id="main"><div class="fof"><h1>Your Requested Link is Expired</h1></div></div>'
        )
      else {
        console.log(
          'getresetpassword -> user.resetPasswordToken',
          user.resetPasswordToken
        )
      }
    })
    .catch((err) => {
      console.log('getresetpassword -> err', err)
      // res.json({ code: code.ineternalError, message: msg.internalServerError })
      res.send(
        '<style>*{transition:all .6s}html{height:100%}body{font-family:Lato,sans-serif;color:#888;margin:0}#main{display:table;width:100%;height:100vh;text-align:center}.fof{display:table-cell;vertical-align:middle}.fof h1{font-size:50px;display:inline-block;padding-right:12px;animation:type .5s alternate infinite}@keyframes type{from{box-shadow:inset -3px 0 0 #888}to{box-shadow:inset -3px 0 0 transparent}}</style><div id="main"><div class="fof"><h1>Your Requested Link is Expired</h1></div></div>'
      )
    })
}

function resetpassword(req, res) {
  let query = {
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  }
  userdao
    .findone(query)
    .then((result) => {
      if (!result)
        return res.json({
          code: code.unAuthorized,
          message: msg.tokeninvalidorexpire,
        })
      else {
        const { password, confirm_password } = req.body
        let pwdHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          confirmPwdHash = bcrypt.hashSync(
            confirm_password,
            bcrypt.genSaltSync(10)
          ),
          query = { resetPasswordToken: req.params.token },
          update = {
            $set: {
              password: pwdHash,
              confirm_password: confirmPwdHash,
              resetPasswordToken: '',
              resetPasswordExpires: '',
            },
          },
          options = { new: true }
        userdao.findOneAndUpdate(query, update, options).then(async (user) => {
          let data = {
            username: user.firstname,
            subject: 'Your Password has been changed',
            html: `Hi ${user.firstname} <br /><br /> 
                     This is a confirmation that the password for your account ${user.email} has just been changed.<br /><br />Best Regards.`,
          }
          await util.sendEMail(user.email, data).then((data) => {
            return data == true
              ? res.json({ code: code.ok, message: msg.passwordChanged })
              : res.json({
                  code: code.notImplemented,
                  message: msg.mailNotSent,
                })
          })
        })
      }
    })
    .catch((err) => {
      console.error({ err })
    })
}

module.exports = {
  registerUser,
  validateemail,
  loginUser,
  forgotPassword,
  getresetpassword,
  resetpassword,
  getvalidateemail,
}
