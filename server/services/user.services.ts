import { Response } from 'express'
import { redis } from '../utils/redis'
import { userModel } from '../models/user.model'

// get user by id!
export const getUserById = async (id: string, res: Response) => {
  console.log({id})
  const userJSON = await redis.get(id)
console.log({userJSON})
  if (!userJSON) {
    throw new Error('User not found')
  }

  res.status(200).json({ user: JSON.parse(userJSON), success: true })
}

// Get all users!
export const getAllUsersService = async (res: Response) => {
  // from mongodb!
  const users = await userModel.find().sort({ createdAt: -1 })

  // send back response!
  res.status(201).json({
    success: true,
    users
  })
}

export const updateUserRoleService = async (
  res: Response,
  id: string,
  role: string
) => {
  // update user role!
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true })

  // return response!
  res.status(200).json({
    success: true,
    user
  })
}

