import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  token: '',
  user: '',
  accessToken:""
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userRegistration: (state, action) => {
      state.token = action.payload.token
    },
    userLoggedIn: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
    },
    userLoggedOut: state => {
      state.accessToken = ''
      state.user = ''
    }
  }
})

export const { userRegistration, userLoggedIn, userLoggedOut } =
  authSlice.actions
  export default authSlice.reducer
