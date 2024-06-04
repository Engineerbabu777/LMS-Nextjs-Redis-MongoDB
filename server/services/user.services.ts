import { Response } from 'express'
import { userModel } from '../models/user.model'

// get user by id!
export const getUserById = async (id: string, res: Response) => {
  const user = await userModel.findById(id)

  if (!user) {
    throw new Error('User not found')
  }

  res.status(200).json({ user, success: true })
}
