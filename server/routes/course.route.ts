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

const courseRouter = express.Router()

courseRouter.post(
  '/create-course',
  authorizeRoles('admin') as any,
  isAuthenticated,
  uploadCourse
)

courseRouter.post(
  '/edit-course/:id',
  authorizeRoles('admin') as any,
  isAuthenticated,
  editCourse
)

courseRouter.get('/get-course/:id', getSingleCourse)

courseRouter.get('/get-courses/', getAllCourses)

courseRouter.get('/get-course-content/:id', isAuthenticated, getCourseContent)

courseRouter.put('/add-question', isAuthenticated, addQuestion)
courseRouter.put('/add-answer', isAuthenticated, addReplyToQuestion)

courseRouter.put('/add-review/:id', isAuthenticated, addReview)
courseRouter.put(
  '/add-reply/:id',
  isAuthenticated,
  authorizeRoles('admin') as any,
  addReplyToReview
)


courseRouter.get(
  '/get-courses',
  isAuthenticated,
  authorizeRoles('admin') as any,
  getAllCourses
)

courseRouter.delete(
  '/delete-course/:id',
  isAuthenticated,
  authorizeRoles('admin') as any,
  deleteCourse
)
export default courseRouter
