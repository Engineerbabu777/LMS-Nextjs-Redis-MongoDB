import { redirect } from 'next/navigation'
import UserAuth from './userAuth'
import React from 'react'
import { useSelector } from 'react-redux'

export default function AdminProtected ({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: any) => state.auth)
  const isAdmin = user?.role === 'admin'

  return isAuthenticated ? children : redirect('/')
}
