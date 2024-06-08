// createLayout

import express from 'express'
import { authorizeRoles, isAuthenticated } from '../middleware/auth'

import { createLayout, editLayout } from '../controllers/layout.controller'

export const layoutRouter = express.Router()

layoutRouter.get(
  '/get-all-notifications',
  isAuthenticated,
  authorizeRoles('admin') as any,
  createLayout
)

layoutRouter.get(
  '/get-all-notifications',
  isAuthenticated,
  authorizeRoles('admin') as any,
  editLayout
)
