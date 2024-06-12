'use client'

import { styles } from '@/styles/styles'
import { useFormik } from 'formik'
import { useState } from 'react'
import { AiFillGithub, AiOutlineEyeInvisible } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import * as yup from 'yup'

type Props = {
  setRoute: (route: string) => void
}

const schema = yup.object().shape({
  name: yup.string().required('Please enter name'),
  email: yup.string().email('Invalid email').required('Email is required!'),
  password: yup.string().required('Password is required!')
})

export default function SignUp ({ setRoute }: Props) {
  const [show, setShow] = useState(false)
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: ''
    },
    validationSchema: schema,
    onSubmit: async values => {
        setRoute('Verification')
    }
  })

  const { errors, touched, values, handleChange, handleSubmit } = formik

  return (
    <>
      <div className=''>
        <h1 className={`${styles.title}`}>Join to Babu Learning</h1>

        <form onSubmit={handleSubmit}>
          {/* NAME! */}
          <div className='mt-3'>
            <label className={`${styles.label}`} htmlFor='name'>
              Enter Your Name
            </label>
            <input
              type='name'
              name='name'
              value={values.name}
              onChange={handleChange}
              id='name'
              placeholder='Doe'
              className={`${errors.name && touched.name && 'border-red-500'} ${
                styles.input
              }`}
            />
            {errors.name && touched.name && (
              <span className='text-red-500 pt-2 block'>{errors.name}</span>
            )}
          </div>
          {/* EMAIL! */}
          <label className={`${styles.label}`} htmlFor='email'>
            Enter Your Email
          </label>
          <input
            type='email'
            name='email'
            value={values.email}
            onChange={handleChange}
            id='email'
            placeholder='loginmail@gmail.com'
            className={`${errors.email && touched.email && 'border-red-500'} ${
              styles.input
            }`}
          />
          {errors.email && touched.email && (
            <span className='text-red-500 pt-2 block'>{errors.email}</span>
          )}
          {/* PASSWORD! */}
          <div className='w-full mt-5 relative mb-1'>
            <label className={`${styles.label}`} htmlFor='email'>
              {' '}
              Enter your password{' '}
            </label>
            <input
              type={!show ? 'password' : 'text'}
              name='password'
              value={values.password}
              onChange={handleChange}
              id='password'
              placeholder='password!@'
              className={`${
                errors.password && touched.password && 'border-red-500'
              } ${styles.input}`}
            />
            {!show ? (
              <AiOutlineEyeInvisible
                className='absolute bottom-1 right-2 z-1 cursor-pointer'
                size={20}
                onClick={() => setShow(!show)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className='absolute bottom-1 right-2 z-1 cursor-pointer'
                size={20}
                onClick={() => setShow(!show)}
              />
            )}
          </div>
          {errors.password && touched.password && (
            <span className='text-red-500 pt-2 block'>{errors.password}</span>
          )}

          <div className='w-full mt-5'>
            <button
              type='submit'
              value='Signup'
              className={`flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer min-h-[45px] w-full font-Poppins bg-[#2190ff] text-[16px] font-semibold`}
            >
              Register
            </button>
          </div>
          <br />
          <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
            Or Join With
          </h5>
          <div className='flex items-center justify-center my-3'>
            {' '}
            <FcGoogle size={30} className='cursor-pointer mr-2' />{' '}
            <AiFillGithub size={30} className='cursor-pointer ml-2' />
          </div>
          <h5 className='text-center pt-4 font-Poppins text-[14px}'>
            {' '}
            Not have any account?{''}
            <span
              I
              className='text-[#2190ff] pl-1 cursor-pointer'
              onClick={() => setRoute('Sign-Up')}
            >
              Sign up
            </span>
          </h5>
        </form>
        <br />
      </div>
    </>
  )
}
