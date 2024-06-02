import { NextFunction, Request, Response } from 'express'
import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import ErrorHandler from '../utils/ErrorHandler'
import { IUser, userModel } from '../models/user.model'
import jwt from 'jsonwebtoken'
import ejs from 'ejs'
import path from 'path'
import sendMail from '../utils/sendMail'

interface IRegistrationBody {
  name: string
  email: string
  password: string
  avatar?: any
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(1)
      const { name, email, password } = req.body
      const isEmailExists = await userModel.findOne({ email })
      if (isEmailExists) {
        return next(new ErrorHandler('Email already exists', 400))
      }
      const user: IRegistrationBody = await userModel.create({
        name,
        email,
        password
      })

      const activationToken = createActivationToken(user)

      const activationCode = activationToken.activationCode
      const data = { user: { name: user.name }, activationCode }
      const html = ejs.renderFile(
        path.join(__dirname, '../mails/activation-mail.ejs'),
        data
      )

      try {
        await sendMail({
          email: user.email,
          subject: 'Activate your account!',
          data,
          template: 'activate-mail.ejs'
        })

        res.status(201).json({
          success: true,
          message:
            'User registered successfully, check your email to activate your account!!',
          activationToken: activationToken.token
        })
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

interface IActivationToken {
  token: string
  activationCode: string
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET!,
    {
      expiresIn: '5m'
    }
  )

  return { token, activationCode }
}
