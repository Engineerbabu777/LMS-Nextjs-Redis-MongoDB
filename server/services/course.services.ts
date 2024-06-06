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
