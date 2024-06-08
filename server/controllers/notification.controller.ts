import { NextFunction, Request, Response } from 'express'
import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import { notificationModel } from '../models/notification.model'
import ErrorHandler from '../utils/ErrorHandler'
import cron from 'node-cron'

// get notifications!
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await notificationModel
        .find()
        .sort({ createdAt: -1 })

      res.status(201).json({
        success: true,
        notifications
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// update notification status -- only admin!
export const updateNotificationStatus = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await notificationModel.findById(req.params.id)
      notification?.status
        ? (notification.status = 'read')
        : notification?.status

      // if(!notification){

      // }else{

      // }

      await notification?.save()

      const notifications = await notificationModel
        .find()
        .sort({ createdAt: -1 })

      // return response back!
      res.status(200).json({
        success: true,
        notifications
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// delete notifications!
cron.schedule('*0 0 0 * * *', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  await notificationModel.deleteMany({
    status: 'read',
    createdAt: { $lt: thirtyDaysAgo }
  })
})
