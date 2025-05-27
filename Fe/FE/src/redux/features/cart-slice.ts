import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, store } from "../store";
import apiService from "@/api/apiService";
import { addToCart, loadCart } from "../actions/cart.action";
import { stat } from "node:fs";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
};

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCart: (state) => {
      state.cart = null;
    },
    updateItemQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      if (state.cart) {
        const item = state.cart.items.find(item => item._id === action.payload.itemId);
        if (item) {
          item.quantity = action.payload.quantity;
          // Cập nhật tổng tiền
          state.cart.totalAmount = state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadCart.pending, (state, action) => {
        state.loading = true
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false
      })
      .addCase(loadCart.rejected, (state, action) => {
        console.log(action.payload)
        state.loading = false
      })
      .addCase(addToCart.pending, (state, action) => {
        state.loading = true
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false
        state.error = null
      })
      .addCase(addToCart.rejected, (state, action) => {
        console.log(action.payload)
        state.loading = false
      })
  }
});

// Selectors
export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;

// Thêm các selector mới
export const selectCartItems = (state: RootState) => state.cart.cart?.items || [];
export const selectTotalPrice = (state: RootState) => state.cart.cart?.totalAmount || 0;

export const removeItemFromCart = (itemId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const updatedCart = await apiService.removeFromCart(itemId);
    dispatch(setCart(updatedCart));
    dispatch(setError(null));
  } catch (error) {
    console.error('Error removing item from cart:', error);
    dispatch(setError(error instanceof Error ? error.message : 'Failed to remove item from cart'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setCart, setLoading, setError, clearCart, updateItemQuantity } = cart.actions;
export default cart.reducer;
