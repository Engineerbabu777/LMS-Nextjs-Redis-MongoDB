import express from 'express'
import { registrationUser } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.post('/registration', registrationUser)

userRouter.get('/test', async (req, res, next) => {
  res.status(200).json('ok')
})

export default userRouter
