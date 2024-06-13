import { apiSlice } from '../api/apiSlice'
import { userRegistration } from './authSlice'

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
      query: ({ activation_token, activation_code }) => ({
        url: 'activate-user',
        method: 'POST',
        body: {
          activation_token,
          activation_code
        }
      })
    })
  })
})

export const { useRegisterMutation,useActivationMutation } = authApi
