import mongoose, { Document, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
require('dotenv').config()

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface IUser extends Document {
  email: string
  password: string
  name: string
  avatar: {
    public_id: string
    url: string
  }
  role: string
  isVerified: boolean
  courses: Array<{ courseId: string }>
  comparePassword: (password: string) => Promise<boolean>
  SignAccessToken: () => string
  SignRefreshToken: () => string
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    // add all!
    name: {
      type: String,
      required: [true, 'Please enter name!']
    },
    email: {
      type: String,
      required: [true, 'Please enter email!'],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value)
        },
        message: 'Please enter a valid email'
      },
      unique: true
    },
    password: {
      type: String,
      minLength: [6, 'Password must contain 6 letters!'],
      select: false
    },
    avatar: {
      public_id: String,
      url: String
    },
    role: {
      type: String,
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    courses: [
      {
        courseId: String
      }
    ]
  },
  {
    timestamps: true
  }
)

// Hash password!
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// compare password!
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password)
}

// sign access token!
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN!)
}

// sign refresh token!
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN!)
}

export const userModel: Model<IUser> = mongoose.model<IUser>('User', userSchema)
