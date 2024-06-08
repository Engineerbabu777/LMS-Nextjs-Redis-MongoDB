import express from 'express'
import {
  activateUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updateUserInfo,
  updateUserPassword,
  updateUserProfilePicture
} from '../controllers/user.controller'
import { authorizeRoles, isAuthenticated } from '../middleware/auth'

const userRouter = express.Router()

userRouter.post('/registration', registrationUser)
userRouter.post('/activate', activateUser)

userRouter.post('/login', loginUser)

userRouter.get('/logout', isAuthenticated, logoutUser)

userRouter.get('/refresh', updateAccessToken)

userRouter.get('/me', isAuthenticated, getUserInfo)

userRouter.post('/social-auth', socialAuth)

userRouter.put('/update-user-info', isAuthenticated, updateUserInfo)

userRouter.put('/update-user-password', isAuthenticated, updateUserPassword)

userRouter.put('/update-user-avatar', isAuthenticated, updateUserProfilePicture)

userRouter.get(
  '/get-users',
  isAuthenticated,
  authorizeRoles('admin') as any,
  getAllUsers
)

export default userRouter
