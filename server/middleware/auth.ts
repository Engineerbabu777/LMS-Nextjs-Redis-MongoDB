import { NextFunction, Request } from 'express'
import { CatchAsyncError } from './catchAsyncErrors'
import ErrorHandler from '../utils/ErrorHandler'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redis } from '../utils/redis'

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token
    if (!access_token) {
      return next(new ErrorHandler('Please Login to access this resource', 401))
    }
    const decodedData = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN!
    ) as JwtPayload

    // if no decodedData return error!
    if (!decodedData) {
      return next(new ErrorHandler('access token is not valid', 401))
    }

    const user = await redis.get(decodedData.id)

    if (!user) {
      return next(new ErrorHandler('user not found', 400))
    }

    req.user = JSON.parse(user)
    next()
  }
)
