import { Response } from 'express'
import { redis } from '../utils/redis'

// get user by id!
export const getUserById = async (id: string, res: Response) => {
  const userJSON = await redis.get(id)

  if (!userJSON) {
    throw new Error('User not found')
  }

  res.status(200).json({ user: JSON.parse(userJSON), success: true })
}
