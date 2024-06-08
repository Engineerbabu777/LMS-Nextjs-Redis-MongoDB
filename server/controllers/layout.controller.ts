import { NextFunction } from 'express'
import { CatchAsyncError } from '../middleware/catchAsyncErrors'
import { layoutModel } from '../models/layout.model'
import cloudinary from 'cloudinary'
import ErrorHandler from '../utils/ErrorHandler'

// create lauyout!
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body as any
      const isTypeExists = await layoutModel.findOne({ type })
      if (isTypeExists) {
        return next(new ErrorHandler('Type already exists!', 400))
      }
      if (type === 'Banner') {
        const { image, title, subTitle } = req.body as any

        // upload image to cloudinary!
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: 'layout'
        })

        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
          },
          title,
          subTitle
        }

        await layoutModel.create(banner)
      }

      if (type === 'FAQ') {
        const { faq } = req.body as any
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer
            }
          })
        )
        await layoutModel.create({ type: 'FAQ', faq: faqItems })
      }

      if (type === 'Categories') {
        const { categories } = req.body as any
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title
            }
          })
        )
        await layoutModel.create({ type: 'Categories', faq: categoriesItems })
      }

      res.status(200).json({
        success: true,
        message: 'Layout created successfully!'
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)
