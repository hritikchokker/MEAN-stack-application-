const nodemailer = require('nodemailer');

const sendEmail =async  options =>{

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const emailOptions = {
    from: 'Hritik chokker <hchokker7@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  transporter.sendMail(mainOptions)
}
module.exports = sendEmail;
