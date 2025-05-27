import { createSlice } from "@reduxjs/toolkit";

export interface AuthSliceState {
  loggedIn: boolean;
}

const initialState = {
  loggedIn: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.loggedIn = action.payload
    }
  }
})

export const { setLogin } = authSlice.actions