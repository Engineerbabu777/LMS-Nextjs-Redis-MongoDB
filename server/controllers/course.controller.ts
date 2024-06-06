import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import { Request, Response, NextFunction } from 'express'
import ErrorHandler from '../utils/ErrorHandler'
import cloudinary from 'cloudinary'
import { createCourse } from '../services/course.services'
import { courseModel } from '../models/course.model'

// upload course!
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body
      const thumbnail = data.thumbnail
      const course = data.course

      // if thumnail is then upload to cloudinary!
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: 'courses'
        })

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        }
      }

      createCourse(data, res, next)
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }
  }
)

// edit course!
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body
      const thumbnail = data.thumbnail

      if (thumbnail) {
        // delete from cloudinary!

        await cloudinary.v2.uploader.destroy(data.course.thumbnail.public_id)

        // now upload new one and save!

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: 'courses'
        })

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        }
      }
      // get course id from params!
      const courseId = req.params.id

      const course = await courseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data
        },
        {
          new: true
        }
      )

      // return response!
      res.status(200).json({
        success: true,
        message: 'Course updated successfully!',
        course
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }
  }
)

// get single course --- without purchasing!
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await courseModel
        .findById(req.params.id)
        .populate(
          '-courseData.videoUrl -courseData.questions -courseData.suggestions -courseData.links'
        )

      res.status(200).json({
        success: true,
        course
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }
  }
)
