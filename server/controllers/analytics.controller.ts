import { Request, Response, NextFunction } from 'express'
import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import ErrorHandler from '../utils/ErrorHandler'
import { generateLast12MonthsData } from '../utils/analytics.generator'
import { userModel } from '../models/user.model'
import { courseModel } from '../models/course.model'
import { orderModel } from '../models/order.model'

// get users analytics!
export const getUserAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData(userModel as any);

        // send back response!
        res.status(200).json({
            success: true,
            users
        })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)


// get courses analytics!
export const getCoursesAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
          const courses = await generateLast12MonthsData(courseModel as any);
  
          // send back response!
          res.status(200).json({
              success: true,
              courses
          })
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
      }
    }
  )

  
// get orders analytics!
export const getOrderAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
          const orders = await generateLast12MonthsData(orderModel as any);
  
          // send back response!
          res.status(200).json({
              success: true,
              orders
          })
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
      }
    }
  )
  