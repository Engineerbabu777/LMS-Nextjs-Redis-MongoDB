import React, { useState } from 'react'
import SideBarProfile from './SideBarProfile'

type Props = {}

export default function Profile ({}: Props) {
  const [scroll, setScroll] = useState(false)

  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState(null);

  const logoutHandler = () => {

  }


  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 85) {
        setScroll(true)
      } else {
        setScroll(false)
      }
    })
  }
  return (
    <div className='w-[85%] flex mx-auto'>
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 border border-[#ffffff2d] dark:border-[#ffffffld] rounded-[5px] 
            shadow-xl dark:shadow-sm mt-[80px] mb-[80px] sticky 
            ${scroll ? 'top-[120px]' : 'top-[30px]'} left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logout}
        />
      </div>
    </div>
  )
}
