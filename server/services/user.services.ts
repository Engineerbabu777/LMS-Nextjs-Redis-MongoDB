import { Response } from 'express'
import { redis } from '../utils/redis'
import { userModel } from '../models/user.model'

// get user by id!
export const getUserById = async (id: string, res: Response) => {
  const userJSON = await redis.get(id)

  if (!userJSON) {
    throw new Error('User not found')
  }

  res.status(200).json({ user: JSON.parse(userJSON), success: true })
}

// Get all users!
export const getAllUsers = async (res: Response) => {
  // from mongodb!
  const users = await userModel.find().sort({ createdAt: -1 })

  // send back response!
  res.status(201).json({
    success: true,
    users
  })
}
