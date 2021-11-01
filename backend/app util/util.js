const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

async function sendEmail(receiverid, data) {
  var tansporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '766788b2d7f49e',
      pass: 'ee68a95b3f6878',
    },
  })

  var mailoption = {
    from: `hasti@coderscotch.com`,
    to: receiverid,
    subject: data.subject,
    html: data.html,
  }

  return new Promise(function(resolve, reject) {
    tansporter.sendMail(mailoption, (err) => {
      err ? reject(err) : resolve(true)
    })
  })
}

function generateToken(data, secret, expires_in) {
  let obj = {
    id: data._id,
    email: data.email,
  }
  return jwt.sign(obj, secret, { expiresIn: expires_in })
}

module.exports = {
  sendEmail,
  generateToken,
}
