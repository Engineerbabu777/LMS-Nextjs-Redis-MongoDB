import {
  editCourse,
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
export default courseRouter
