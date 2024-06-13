require('dotenv').config()

import jwt from 'jsonwebtoken'
import { redis } from './redis'
import { Request, Response } from 'express'
import { IUser } from '../models/user.model'

interface ITokenOptions {
  expired: Date
  maxAge: number
  httpOnly: boolean
  sameSite: 'lax' | 'strict' | 'none' | undefined
  secure?: boolean
}

//parse env variables to integrate fallback values!
export const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE! || '500',
  10
)
export const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE! || '1200',
  10
)

// option for cookies!
export const accessTokenOptions: ITokenOptions = {
  expired: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax'
}

export const refreshTokenOptions: ITokenOptions = {
  expired: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax'
}

// send Token!
export const sendToken = async (user: IUser, statusCode: number, res: Response) => {
  // get access and refresh tokens!
  const accessToken =  user.SignAccessToken()
  const refreshToken = user.SignRefreshToken()

  console.log({accessToken,refreshToken})

  // upload session to redis!
  redis.set(user.id, JSON.stringify(user))

  // if we rae in production1
  if (process.env.NODE_ENV === 'production') {
    accessTokenOptions.secure = true
  }

  //  set both in cookies!
  res.cookie('refresh_token', refreshToken, refreshTokenOptions)
  res.cookie('access_token', accessToken, accessTokenOptions)

  // send back the response!
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
    refreshToken
  })
}
