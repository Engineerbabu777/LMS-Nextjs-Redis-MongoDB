import mongoose, { Schema } from 'mongoose'

interface FaqItem extends Document {
  question: string
  answer: string
}

interface Category extends Document {
  title: string
}

interface BannerImage extends Document {
  public_id: string
  url: string
}

interface Layout extends Document {
  type: string
  faq: string
  categories: string
  banner: {
    image: BannerImage
    title: string
    subTitle: string
  }
}

const faqSchema = new Schema<FaqItem>({
  question: {
    type: String
  },
  answer: {
    type: String
  }
})

const categorySchema = new Schema<Category>({
  title: {
    type: String
  }
})

const bannerSchema = new Schema<BannerImage>({
  public_id: {
    type: String
  },
  url: {
    type: String
  }
})

const layoutSchema = new Schema<Layout>({
  type: String,
  faq: [faqSchema],
  categories: [categorySchema],
  banner: {
    image: bannerSchema,
    title: String,
    subTitle: String
  }
})

export const layoutModel = mongoose.model<Layout>('Layout', layoutSchema)
