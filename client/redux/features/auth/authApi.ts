import { apiSlice } from '../api/apiSlice'
import { userLoggedIn, userRegistration } from './authSlice'

type RegistrationResponse = {
  message: string
  activationToken: string
}

type RegistrationData = {
  // Define the required fields for registration here
  email: string
  password: string
  // Add other fields as necessary
}

type ActivationData = {
  activation_token: string
  activation_code: string
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: data => ({
        url: 'registration',
        method: 'POST',
        body: data,
        credentials: 'include' as const
      }),
      async onQueryStarted (arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled
          dispatch(
            userRegistration({
              token: result.data.activationToken
            })
          )
        } catch (error: any) {
          console.log(error)
        }
      }
    }),
    activation: builder.mutation<RegistrationResponse, ActivationData>({
      query: (data:ActivationData) => ({
        url: 'activate-user',
        method: 'POST',
        credentials: 'include' as const,
        body: data
      })
    }),
    login: builder.mutation<any, any>({
      query: data => ({
        url: 'login',
        method: 'POST',
        body: data,
        credentials: 'include' as const
      }),
      async onQueryStarted (arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user
            })
          )
        } catch (error: any) {
          console.log(error)
        }
      }
    }),

  })
})

export const { useRegisterMutation,useActivationMutation, useLoginMutation } = authApi
