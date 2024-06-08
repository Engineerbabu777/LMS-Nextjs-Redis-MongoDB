// createLayout

import express from 'express'
import { authorizeRoles, isAuthenticated } from '../middleware/auth'

import {
  createLayout,
  editLayout,
  getLayout
} from '../controllers/layout.controller'

export const layoutRouter = express.Router()

layoutRouter.post(
  '/create-layout',
  isAuthenticated,
  authorizeRoles('admin') as any,
  createLayout
)

layoutRouter.put(
  '/edit-layout',
  isAuthenticated,
  authorizeRoles('admin') as any,
  editLayout
)

layoutRouter.put('/get-layout', getLayout)
