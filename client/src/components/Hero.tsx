import Link from 'next/link'
import React from 'react'
import { BiSearch } from 'react-icons/bi'

type Props = {}

export default function Hero ({}: Props) {
  return (
    <>
      <div className='w-full 1000px:flex items-center'>
        <div className='absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[50vh] w-[50vw] hero_animation ' />
        <div className='1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10'>
          {/* IMAGE! */}
          <img
            alt='something'
            src='https://edmy-react.hibootstrap.com/images/banner/banner-img-1.png'
            className='object-contain 1100px:max-w-[90%] w-[90%] 
            1500px:max-w-[85%] h-[auto] z-[10]'
          />
        </div>

        <div className='1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]'>
          <h2
            className='dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[70px] 
			  font-[600] font-Josefin py-2 1000px: leading-[75px] 1500px:w-[600px]'
          >
            Improve Your Learning Experience Better Instantly
          </h2>
          <br />
          <p className='dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]'>
            We have 40k+ Online courses & 500K+ Online registered student. Find
            your desired Courses from them.
          </p>
          <br />
          <br />
          <div className='1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative'>
            <input
              type='search'
              placeholder='Search Courses...'
              className='bg-transparent border dark:border-none dark:bg-[#575757] ■dark:placeholder:text-[#ffffffdd] 
			  rounded-[5px] p-2 w-full h-full outline-none text-[#000004e] dark:text-[#ffffffec] text-[20px] font-[500] font-Josefin'
            />
            <div
              className='absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 
			  bg-[#39c1f3] rounded-r-[5px]'
            >
              <BiSearch size={30} className='text-white cursor-pointer ' />
            </div>
          </div>
          <br />
          <br />
          <div className='1500px:w-[55%) 1100px:w-[78%] w-[90%] flex items-center'>
            <img
              src='https://edmy-react.hibootstrap.com/images/banner/client-3.jpg'
              alt='text-1'
              className='rounded-full'
            />
            <img
              src='https://edmy-react.hibootstrap.com/images/banner/client-1.jpg'
              alt='text-2'
              className='rounded-full ml-[-20px]'
            />
            <img
              src='https://edmy-react.hibootstrap.com/images/banner/client-2.jpg'
              alt='text-3'
              className='rounded-full ml-[-20px]'
            />

            <p className='font-Josef in dark: text-[#edfff4] text-[#000000b3] 1000px: pl-3 text-[18px] font-[600]'>
              500K+ People already trusted us.{' '}
              <Link
                href='/courses'
                className='dark: text-[#46e256] text-[crimson]'
              >
                View Courses{' '}
              </Link>{' '}
            </p>
          </div>
          <br />
        </div>
      </div>
    </>
  )
}
