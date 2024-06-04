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

// send Token!
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  // get access and refresh tokens!
  const accessToken = user.SignAccessToken()
  const refreshToken = user.SignRefreshToken()

  // upload session to redis!
  redis.set(user.id, refreshToken);

  //parse env variables to integrate fallback values!
  const accessTokenExpire = parseInt(
    process.env.ACCESS_TOKEN_EXPIRE! || '500',
    10
  )
  const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRE! || '1200',
    10
  )

  // option for cookies!
  const accessTokenOptions: ITokenOptions = {
    expired: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }

  const refreshTokenOptions: ITokenOptions = {
    expired: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }

  // if we rae in production1
  if (process.env.NODE_ENV === 'production') {
    accessTokenOptions.secure = true
  }

  //  set both in cookies!
  res.cookie('access_token', accessToken, accessTokenOptions)
  res.cookie('access_token', accessToken, accessTokenOptions)

  // send back the response!
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
    refreshToken
  })
}
