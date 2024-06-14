'use client'

import Header from '@/components/Header'
import Profile from '@/components/Profile/Profile'
import Protected from '@/hooks/useProtected'
import { Heading } from '@/utils/Heading'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

type Props = {}

export default function Page ({}: Props) {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(0)

  const [route, setRoute] = useState('Login')
const {user} = useSelector(state => state?.auth)
  return (
    <>
      <div>
        <Protected>
          <Heading
            title={`${user.name} | Profile`}
            description='Platform to become a Software Engineer'
            keywords='Programming,MERN,Redux'
          />
          <Header
            setRoute={setRoute}
            route={route}
            open={open}
            activeItem={activeItem}
            setOpen={setOpen}
          />
          {/* PROFILE */}
          <Profile 
         user={user} 
          />
        </Protected>
      </div>
    </>
  )
}
