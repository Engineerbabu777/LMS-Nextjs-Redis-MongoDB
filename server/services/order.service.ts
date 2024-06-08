// create new order!

import { NextFunction } from 'express'
import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import { orderModel } from '../models/order.model'

export const newOrder = CatchAsyncError(
  async (data: any, next: NextFunction) => {
    const order = await orderModel.create(data)
    next(order)
  }
)
