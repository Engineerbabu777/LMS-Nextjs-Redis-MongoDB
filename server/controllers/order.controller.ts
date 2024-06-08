import path from 'path'
import ejs from 'ejs'
import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import { IOrder } from '../models/order.model'
import { userModel } from '../models/user.model'
import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/ErrorHandler'
import { courseModel } from '../models/course.model'
import { newOrder } from '../services/order.service'
import sendMail from '../utils/sendMail'
import { notificationModel } from '../models/notification.model'

// create order!
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder

      const user = await userModel.findById(req?.user?._id)

      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      )

      if (courseExistInUser) {
        return next(
          new ErrorHandler('You have already purchased this course', 400)
        )
      }

      const course = await courseModel.findById(courseId)

      if (!course) {
        return next(new ErrorHandler('Course not found!', 404))
      }
      const data: any = {
        courseId: course?._id,
        userId: user?._id
      }

      newOrder(data, res, next)

      const mailData = {
        order: {
          _id: course?._id?.slice(0, 6),
          name: course.name,
          price: course.price,
          data: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }
      }

      const html = await ejs.renderFile(
        path.join(__dirname, '../mails/order-confirmation.ejs'),
        { order: mailData }
      )

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: 'Order Confirmation',
            template: 'order-confirmation.ejs',
            data: mailData
          })
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
      }

      user?.courses.push(course?._id)

      await user?.save()

      // create notification!
      await notificationModel.create({
        user: user?._id,
        message: `You have purchased ${course?.name}`,
        title: 'New Order'
      })

      // send reponse back!
      return res.status(201).json({
        success: true,
        order: course
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)
