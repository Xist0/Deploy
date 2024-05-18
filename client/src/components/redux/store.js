import { configureStore } from '@reduxjs/toolkit'
import regSlice from './regSlice'
import authSlice from './authSlice'

export const store = configureStore({
  reducer: {
    reg: regSlice,
    auth: authSlice
  },
})
