
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({
        baseUrl: 'http://localhost:4000/api/v1/'
    }),
    endpoints:(builder) => ({
        refreshToken: builder.query({
            query:() => ({
                url:"refresh",
                method:"GET",
                credentials: "include" as const
            })
        }),
        loadUser: builder.query({
            query:() => ({
                url:"refresh",
                method:"GET",
                credentials: "include" as const
            }),
            async onQueryStarted (arg, { queryFulfilled, dispatch }) {
                try {
                  const result = await queryFulfilled
                  dispatch(
                    userLoggedIn({
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


export const {} = apiSlice

