import path from 'path'
import ejs from 'ejs'
import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import { IOrder } from '../models/order.model'
import { userModel } from '../models/user.model'
import { NextFunction, Request } from 'express'

// create order!
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder

      const user = await userModel.findById(req.user._id)

      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      )
    } catch (error) {}
  }
)
