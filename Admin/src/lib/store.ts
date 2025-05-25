import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { customerSlice } from './features/customers/customersSlice'
import { authSlice } from './features/auth/authSlice'


export const makeStore = () => {
  const reducers = combineReducers({
    auth: authSlice.reducer
  })

  return configureStore({
    reducer: reducers
  })
}


export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']