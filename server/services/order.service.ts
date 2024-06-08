// create new order!

import { NextFunction, Response } from 'express'
import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import { orderModel } from '../models/order.model'

export const newOrder = CatchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await orderModel.create(data)
    return res.status(201).json({
      success: true,
      order: order
    })
  }
)

// Get all users!
export const getAllOrdersService = async (res: Response) => {
  // from mongodb!
  const orders = await orderModel.find().sort({ createdAt: -1 })

  // send back response!
  res.status(201).json({
    success: true,
    orders
  })
}
