import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

interface QuickViewState {
  product: Product | null;
}

const initialState: QuickViewState = {
  product: null,
};

const quickViewSlice = createSlice({
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
export default quickViewSlice.reducer;
