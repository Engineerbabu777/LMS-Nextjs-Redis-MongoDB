import express from 'express'
import { authorizeRoles, isAuthenticated } from '../middleware/auth'
import { getNotifications, updateNotificationStatus } from '../controllers/notification.controller'

export const notificationRouter = express.Router()

notificationRouter.get(
  '/get-all-notifications',
  isAuthenticated,
  authorizeRoles('admin') as any,
  getNotifications
)


notificationRouter.get(
    '/update-notification/:id',
    isAuthenticated,
    authorizeRoles('admin') as any,
    updateNotificationStatus
  )




