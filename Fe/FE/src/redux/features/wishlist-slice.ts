import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

export interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItemToWishlist: (state, action: PayloadAction<Product>) => {
      const item = action.payload;
      if (!state.items.find(i => i._id === item._id)) {
        state.items.push(item);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { addItemToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
