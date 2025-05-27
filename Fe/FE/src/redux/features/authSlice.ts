import { createSlice } from "@reduxjs/toolkit";

export interface AuthSliceState {
  loggedIn: boolean;
  user?: any;
}

const initialState: AuthSliceState = {
  loggedIn: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.loggedIn = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.loggedIn = false
      state.user = null
    }
  }
})

export const { setLogin, setUser, logout } = authSlice.actions
