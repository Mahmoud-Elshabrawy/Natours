const nodemailer = require('nodemailer')
const pug = require('pug')
const {convert} = require('html-to-text')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = 'Mahmoud Elshabrawy <mahmoudwaell391@gmail.com>'
  }

  newTransport() {
    if(process.env.NODE_ENV==='production'){
      return nodemailer.createTransport({
              host: process.env.SENDGRID_HOST,
              port: process.env.SENDGRID_PORT,
              auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD,
              },
            })
    } 
    // console.log('NODE_ENV:', process.env.NODE_ENV);
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: "ec89105f88af06",
        pass: "727dafc5cd9961"
      }
    })
  }
  async send(template, subject) {

    // Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url
    })

    // Define mail options
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html)
    }
    // Sent the mail
    await this.newTransport().sendMail(emailOptions)
  }


  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!')
  }

  async passwordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)')
  }
}
