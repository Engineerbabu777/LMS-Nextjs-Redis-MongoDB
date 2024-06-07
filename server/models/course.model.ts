import mongoose, { Schema, Document, Model } from 'mongoose'
import { IUser } from './user.model'

interface IComment extends Document {
  question: string
  user: IUser
  questionReplies: [object]
}

interface IReview extends Document {
  user: object
  rating: number
  comment: string
  commentReplies: IComment[]
}

interface ILink extends Document {
  title: string
  url: string
}

interface ICourseData extends Document {
  title: string
  description: string
  videoUrl: string
  videoThumbnail: object
  videSection: string
  videoLength: number
  videoPlayer: string
  links: ILink[]
  suggestion: string
  questions: IComment[]
}

interface ICourse extends Document {
  name: string
  description: string
  price: number
  estimatedPrice?: number
  thumbnail: object
  ratings?: number
  purchased?: number
  reviews: IReview[]
  courseData: ICourseData
  demoUrl: string
  level: string
  tags: string
  benefits: { title: string }[]
  prerequisites: { title: string }[]
}

const reviewSchema = new Schema<IReview>({
  comment: String,
  user: Object,
  rating: {
    type: Number,
    default: 0
  }
})

//link schema!
const linkSchema = new Schema<ILink>({
  title: String,
  url: String
})

// comment schema!
const commentSchema = new Schema<IComment>({
  question: String,
  user: Object,
  questionReplies: [Object]
})

// course data schema!
const courseDataSchema = new Schema<ICourseData>({
  title: String,
  description: String,
  videoUrl: String,
  videSection: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema]
})

// course schema!
const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    estimatedPrice: {
      type: Number
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String
      }
    },
    tags: {
      required: true,
      type: String
    },
    level: {
      type: String,
      required: true
    },
    demoUrl: {
      type: String,
      required: true
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      default: 0
    },
    purchased: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export const courseModel: Model<ICourse> = mongoose.model(
  'Course',
  courseSchema
)
