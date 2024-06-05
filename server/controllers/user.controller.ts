import { NextFunction, Request, Response } from 'express'
import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import ErrorHandler from '../utils/ErrorHandler'
import { IUser, userModel } from '../models/user.model'
import jwt, { JwtPayload } from 'jsonwebtoken'
import ejs from 'ejs'
import path from 'path'
import sendMail from '../utils/sendMail'
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken
} from '../utils/jwt'
import { redis } from '../utils/redis'
import { getUserById } from '../services/user.services'

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
      const user: IRegistrationBody = {
        name,
        email,
        password
      }

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
          template: 'activation-mail.ejs'
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

// activate user!
interface IActivationRequest {
  activation_token: string
  activation_code: string
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } =
        req.body as IActivationRequest
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_code,
        process.env.ACTIVATION_SECRET!
      ) as { user: IUser; activationCode: string }

      if (newUser.activationCode != activation_code) {
        return next(new ErrorHandler('Invalid activation code!', 400))
      }

      const { name, email, password } = newUser.user

      const existUser = await userModel.findOne({ email })

      if (existUser) {
        return next(new ErrorHandler('User already exists!', 400))
      }

      await userModel.create({
        name,
        email,
        password
      })

      // send response!
      res.status(201).json({
        success: true,
        message: 'User activated successfully!'
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// login user!
interface ILoginRequest {
  email: string
  password: string
}
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest

      if (!password || !email) {
        // return error!
        return next(new ErrorHandler('Please enter email and password!', 400))
      }

      const user = await userModel.findOne({ email }).select('+password')

      // if no user return error!
      if (!user) {
        return next(new ErrorHandler('Invalid email or password!', 400))
      }

      // match password!
      const passwordMatch = await user.comparePassword(password)

      // if password not match return error!
      if (!passwordMatch) {
        return next(new ErrorHandler('Invalid email or password!', 400))
      }

      sendToken(user, 200, res)
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// logout user!
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie('access_token', null, {
        maxAge: 1
      })
      res.cookie('refresh_token', null, {
        maxAge: 1
      })

      const userId = req?.user?._id || ''
      redis.del(userId)

      res.status(200).json({
        success: true,
        message: 'Logged out successfully!'
      })
    } catch (err: any) {
      next(new ErrorHandler(err.message, 400))
    }
  }
)

// update access token!!
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_Token = req.cookies.refresh_token
      if (!refresh_Token) {
        return next(new ErrorHandler('could not refresh token!', 400))
      }
      // decode refresh token!
      const decoded = jwt.verify(
        refresh_Token,
        process.env.REFRESH_TOKEN!
      ) as JwtPayload

      // no decoded err!
      if (!decoded) {
        return next(new ErrorHandler('could not refresh token!', 400))
      }

      // check session!
      const session = await redis.get(decoded.id as string)

      // if no session!
      if (!session) {
        return next(new ErrorHandler('could not refresh token!', 400))
      }

      const user = JSON.parse(session)

      // create new access token!
      const accessToken = jwt.sign(
        {
          id: user._id
        },
        process.env.ACCESS_TOKEN!,
        {
          expiresIn: '5m'
        }
      )

      // refresh token
      const refreshToken = jwt.sign(
        {
          id: user._id
        },
        process.env.REFRESH_TOKEN!,
        {
          expiresIn: '5d'
        }
      )

      req.user = user;

      // set refresh token in cookie!
      res.cookie('refresh_token', refreshToken, refreshTokenOptions)

      // set access token!
      res.cookie('access_token', accessToken, accessTokenOptions)

      // send response!
      res.status(200).json({
        success: true,
        message: 'Access token updated successfully!',
        accessToken
      })
    } catch (err: any) {
      next(new ErrorHandler(err.message, 400))
    }
  }
)

// get user info!
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getUserById(req?.user?.id, res)
    } catch (err: any) {
      next(new ErrorHandler(err.message, 400))
    }
  }
)

interface ISocialAuth {
  email: string
  avatar: string
  name: string
}
// social auth!
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocialAuth

      const user = await userModel.findOne({ email })

      if (!user) {
        const newUser = await userModel.create({ email, avatar, name })
        sendToken(newUser, 200, res)
      } else {
        sendToken(user, 200, res)
      }
    } catch (error: any) {
      next(new ErrorHandler(error.message, 400))
    }
  }
)

// update user info!
interface IUserUpdate {
  name?: string
  email?: string
}

// update user details!
export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body

      // find user by id!
      const user = await userModel.findById(req.user?._id)

      if (user && email) {
        // check if email exists!
        const isEmailExists = await userModel.findOne({ email })
        if (isEmailExists) {
          return next(new ErrorHandler('Email already exists', 400))
        }
        user.email = email
      }
      if (name && user) {
        user.name = name
      }

      await user?.save()

      // update redis cash Data!
      await redis.set(req?.user?._id, JSON.stringify(user))

      // return response back!
      res.status(201).json({
        success: true,
        user
      })
    } catch (error:any) {
      next(new ErrorHandler(error.message, 400))
    }
  }
)
