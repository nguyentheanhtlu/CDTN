import { Customer } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface CustomerState {
  customers: Customer[]
}

const initialState: CustomerState = {
  customers: []
}

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {

  },


})