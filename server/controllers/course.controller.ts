import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import { Request, Response, NextFunction } from 'express'
import ErrorHandler from '../utils/ErrorHandler'
import cloudinary from 'cloudinary'
import { createCourse, getAllCoursesService } from '../services/course.services'
import { courseModel } from '../models/course.model'
import { redis } from '../utils/redis'
import mongoose from 'mongoose'
import path from 'path'
import ejs from 'ejs'
import sendMail from '../utils/sendMail'
import { countReset } from 'console'
import { notificationModel } from '../models/notification.model'

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

      // here!
      await notificationModel.create({
        user: req?.user?._id,
        message: `You have a new question in ${content?.title}`,
        title: 'New Question Received'
      })

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

// add reply to question!
interface IAddAnswerData {
  answer: string
  courseId: string
  contentId: string
  questionId: string
}
export const addReplyToQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, contentId, courseId, questionId }: IAddAnswerData =
        req.body

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

      const question = content.questions.find((item: any) =>
        item._id.equals(questionId)
      )

      if (!question) {
        return next(new ErrorHandler('Invalid question id!', 400))
      }

      // create new answer object!
      const newAnswer: any = {
        user: req.user,
        answer
      }

      // add this answer to our question!
      question.questionReplies.push(newAnswer)

      // save in the db!
      await course?.save()

      if (req?.user?._id === question?.user?._id) {
        // create notification
        // here!
        await notificationModel.create({
          user: req?.user?._id,
          message: `You have a new question in ${content?.title}`,
          title: 'New Question Received'
        })
      } else {
        // send email!
        const data = {
          name: question.user.name,
          title: content.title
        }

        const html = await ejs.renderFile(
          path.join(__dirname, '../mails/question-reply.ejs'),
          data
        )

        try {
          await sendMail({
            email: question.user.email,
            subject: 'Question Reply',
            template: 'question-reply.ejs',
            data
          })
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400))
        }
      }

      // res.status(200).json({
      //   success: true,
      //   message: 'Answer added successfully!'
      // })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// add review in course!
interface IAddReviewData {
  review: string
  rating: number
  userId: string
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req?.user?.courses

      const courseId = req.params.id

      // check if course id already exists in user course list!
      const courseExists = userCourseList.some(
        (course: any) => course._id.toString() === courseId.toString()
      )

      if (!courseExists) {
        return next(new ErrorHandler('Not eligible for this course!', 400))
      }

      const course = await courseModel.findById(courseId)

      const { review, rating } = req.body as IAddReviewData
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating
      }

      course?.reviews.push(reviewData)

      let avg = 0

      course?.reviews.forEach((rev: any) => (avg += rev.rating))

      if (course) {
        course.ratings = avg / course.reviews.length
      }

      await course?.save()

      const notification = {
        title: 'New Review Received',
        message: `${req.user?.name} has given a review in ${course?.name}`
      }

      // create notifications!

      res.status(200).json({
        success: true,
        message: 'Review added successfully!',
        course
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// add reply in review!
interface IAddReviewData {
  comment: string
  courseId: string
  reviewId: string
}
export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData

      const course = await courseModel.findById(courseId)

      // if course not exists!
      if (!course) {
        return next(new ErrorHandler('Course Not found!!', 404))
      }

      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      )

      if (!review) {
        return next(new ErrorHandler('Review Not found!!', 404))
      }

      const replyData: any = {
        user: req.user,
        comment
      }

      if (!review.commentReplies) {
        review.commentReplies = []
      }

      review.commentReplies?.push(replyData)

      await course?.save()

      res.status(200).json({
        success: true,
        course
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// get all courses
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res)
    } catch (err: any) {
      next(new ErrorHandler(err.message, 400))
    }
  }
)

// delete course!
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const user = await courseModel.findById(id)

      if (!user) {
        // user not found!
        return next(new ErrorHandler('course not found', 400))
      }

      // delete user!
      await courseModel.findByIdAndDelete(id)
      // delete from redis!
      await redis.del(id)

      // return back th response!
      res.status(200).json({
        success: true,
        message: 'course deleted Success!'
      })
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400))
    }
  }
)
