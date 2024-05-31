import mongoose from 'mongoose'
require('dotenv').config()

const dbURL = process.env.DB_URL!

export const connectDB = async () => {
  try {
    await mongoose.connect(dbURL).then(() => {
      console.log('Connect Database!')
    })
  } catch (error: any) {
    console.log(error.message)
    setTimeout(() => {
      connectDB()
    }, 5000)
  }
}
