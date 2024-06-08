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
        await layoutModel.create(faq)
      }

      if (type === 'Categories') {
        const { categories } = req.body as any
        await layoutModel.create(categories)
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
