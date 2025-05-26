import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

export interface QuickViewState {
  product: Product | null;
}

const initialState: QuickViewState = {
  product: null,
};

export const quickViewSlice = createSlice({
  name: "quickView",
  initialState,
  reducers: {
    updateQuickView: (state, action: PayloadAction<Product>) => {
      state.product = action.payload;
    },

    clearQuickView: (state) => {
      state.product = null;
    },
  },
});

export const { updateQuickView, clearQuickView } = quickViewSlice.actions;
