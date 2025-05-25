import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  token: {
    accessToken: string;
    refreshToken: string;
  }
}

const initialState: AuthState = {
  token: {
    accessToken: '',
    refreshToken: ''
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token.accessToken = action.payload
    }
  },
})

export const { setToken } = authSlice.actions