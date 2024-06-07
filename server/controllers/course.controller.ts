import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import { Request, Response, NextFunction } from 'express'
import ErrorHandler from '../utils/ErrorHandler'
import cloudinary from 'cloudinary'
import { createCourse } from '../services/course.services'
import { courseModel } from '../models/course.model'
import { redis } from '../utils/redis'
import mongoose from 'mongoose'

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
      const courseId = req.params.id

      const isCacheExists = await redis.get(courseId)

      if (isCacheExists) {
        const course = JSON.parse(isCacheExists)
        return res.status(200).json({
          success: true,
          course
        })
      } else {
        const course = await courseModel
          .findById(req.params.id)
          .populate(
            '-courseData.videoUrl -courseData.questions -courseData.suggestions -courseData.links'
          )

        await redis.set(courseId, JSON.stringify(course))

        res.status(200).json({
          success: true,
          course
        })
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }
  }
)

// get all courses!
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExists = await redis.get('allCourses')

      if (isCacheExists) {
        const courses = JSON.parse(isCacheExists)

        return res.status(200).json({
          success: true,
          courses
        })
      } else {
        const courses = await courseModel
          .find()
          .populate(
            '-courseData.videoUrl -courseData.questions -courseData.suggestions -courseData.links'
          )

        await redis.set('allCourses', JSON.stringify(courses))

        return res.status(200).json({
          success: true,
          courses
        })
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }
  }
)

// get course content  --only for valid user!
export const getCourseContent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get user course list!
      const userCourseList = req.user?.courses
      const courseId = req.params.id

      // check if course is in user course list!
      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      )

      // if the course not exists in the list , throw the error!
      if (!courseExists) {
        return next(
          new ErrorHandler('You are not enrolled in this course!', 401)
        )
      }

      const course = await courseModel.findById(courseId)

      const content = course?.courseData

      return res.status(200).json({
        success: true,
        content
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// add questions in course!
interface IAddQuestionData {
  question: string
  courseId: string
  contentId: string
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body

      const course = await courseModel.findById(courseId)

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler('Invalid content id!', 400))
      }

      const content = course?.courseData?.find((content: any) =>
        content._id.equals(contentId)
      )

      if (!content) {
        return next(new ErrorHandler('Invalid content id!', 400))
      }

      // create a new question object!
      const newQuestion = {
        user: req.user,
        question,
        questionReplies: []
      }

      // add this question to our course content!
      content.questions.push(newQuestion)

      // save in the db!
      await course?.save()

      res.status(200).json({
        success: true,
        message: 'Question added successfully!'
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)
