'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import { Heading } from '@/utils/Heading'
import { useState } from 'react'

interface Props {}
export default function Home ({}: Props) {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(0)

  const [route, setRoute] = useState('Login')

  return (
    <>
      <div className=''>
        <Heading
          title='Babu Learning'
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
        <Hero />
      </div>
    </>
  )
}
