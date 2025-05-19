import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/api/apiService";

type InitialState = {
  value: Product | null;
};

const initialState: InitialState = {
  value: null,
};

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (state, action: PayloadAction<Product>) => {
      state.value = action.payload;
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;
