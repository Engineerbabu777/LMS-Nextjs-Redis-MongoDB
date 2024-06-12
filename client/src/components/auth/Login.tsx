'use client'

import { styles } from '@/styles/styles'
import { useFormik } from 'formik'
import { useState } from 'react'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import * as yup from 'yup'

type Props = {
  setRoute: (route: string) => void
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required!'),
  password: yup.string().required('Password is required!')
})

export default function Login ({ setRoute }: Props) {
  const [show, setShow] = useState(false)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: schema,
    onSubmit: async values => {}
  })

  const { errors, touched, values, handleChange, handleSubmit } = formik

  return (
    <>
      <div className=''>
        <h1 className={`${styles.title}`}>Login with Babu Learning</h1>

        <form onSubmit={handleSubmit}>
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
                className='absolute bottom-3 right-2 2-1 cursor-pointer'
                size={20}
                onClick={() => setShow(true)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className='absolute bottom-3 right-2 2-1 cursor-pointer'
                size={20}
                onClick={() => setShow(true)}
              />
            )}
          </div>
        </form>
      </div>
    </>
  )
}
