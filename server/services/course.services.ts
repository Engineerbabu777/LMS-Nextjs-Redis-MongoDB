import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import { courseModel } from '../models/course.model'
import { Response } from 'express'

// create course!
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await courseModel.create(data)

    // return response back!
    res.status(200).json({
      success: true,
      message: 'Course created successfully!',
      course
    })
  }
)

// Get all courses!
export const getAllCoursesService = async (res: Response) => {
  // from mongodb!
  const courses = await courseModel.find().sort({ createdAt: -1 })

  // send back response!
  res.status(201).json({
    success: true,
    courses
  })
}
