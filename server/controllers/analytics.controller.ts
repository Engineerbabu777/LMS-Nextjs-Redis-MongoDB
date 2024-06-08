import { Request, Response, NextFunction } from 'express'
import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import ErrorHandler from '../utils/ErrorHandler'
import { generateLast12MonthsData } from '../utils/analytics.generator'
import { userModel } from '../models/user.model'

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
