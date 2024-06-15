import { apiSlice } from '../api/apiSlice'

export const userApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    updateAvatar: builder.mutation({
      query: avatar => ({
        url: 'update-user-avatar',
        method: 'PUT',
        body: { avatar },
        credentials: 'include' as const
      })
    }),
    editProfile: builder.mutation({
        query: ({name,email}) => ({
          url: 'update-user-info',
          method: 'PUT',
          body: { name,email },
          credentials: 'include' as const
        })
      }),
      updatePassword: builder.mutation({
        query: ({newPassword,oldPassword}) => ({
          url: 'update-user-password',
          method: 'PUT',
          body: { newPassword,oldPassword },
          credentials: 'include' as const
        })
      })
  })
})
export const { useUpdateAvatarMutation,useEditProfileMutation } = userApi
