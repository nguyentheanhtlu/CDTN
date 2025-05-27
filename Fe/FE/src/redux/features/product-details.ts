import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/api/apiService";
 
export interface ProductState {
  value: Product | null;
};

const initialState: ProductState = {
  value: null,
};

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
