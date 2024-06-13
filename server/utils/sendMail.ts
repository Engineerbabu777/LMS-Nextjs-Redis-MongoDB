import nodemailer, { Transporter } from 'nodemailer'
import ejs from 'ejs'

import path from 'path'

require('dotenv').config()

interface EmailOptions {
  email: string
  subject: string
  template: string
  data: { [key: string]: any }
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  console.log('ENTRING')
  const transporter = nodemailer.createTransport({
    // CONFIGURATION!
    service: 'gmail',
    auth: {
      user: 'projectbase999@gmail.com',
      pass: 'yjrf hpvb zoyd ijmd'
    }
  })

  // COMPOSE THE EMAIL MESSAGE!
  const mailOptions = {
    from: 'projectbase999@gmail.com',
    to: options.email,
    subject: 'Reset Your Password',
    html:options.template
  }

  // SEND EMAIL!
  try {
    console.log('Sending mail...')
    const email = await transporter.sendMail(mailOptions)
    console.log('mail sent')
    console.log('Email Data', email)
  } catch (error) {
    console.log('Error while sending email!')
  }
}

export default sendMail
