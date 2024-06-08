import { getUserAnalytics } from '../controllers/analytics.controller'
import {
  addQuestion,
  addReplyToQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCourses,
  getCourseContent,
  getSingleCourse,
  uploadCourse
} from '../controllers/course.controller'
import { authorizeRoles, isAuthenticated } from '../middleware/auth'
import express from 'express'

const analyticsRouter = express.Router()

analyticsRouter.get(
  '/get-users/',
  isAuthenticated,
  authorizeRoles('admin') as any,
  getUserAnalytics
)

analyticsRouter.get(
    '/get-orders/',
    isAuthenticated,
    authorizeRoles('admin') as any,
    getUserAnalytics
  )

  analyticsRouter.get(
    '/get-courses/',
    isAuthenticated,
    authorizeRoles('admin') as any,
    getUserAnalytics
  )


export default analyticsRouter
