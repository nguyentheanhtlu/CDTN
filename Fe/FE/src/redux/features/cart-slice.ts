import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import apiService from "@/api/apiService";

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

type InitialState = {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
};

const initialState: InitialState = {
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
    }
  },
});

// Selectors
export const selectCart = (state: RootState) => state.cartReducer.cart;
export const selectCartLoading = (state: RootState) => state.cartReducer.loading;
export const selectCartError = (state: RootState) => state.cartReducer.error;

// Thêm các selector mới
export const selectCartItems = (state: RootState) => state.cartReducer.cart?.items || [];
export const selectTotalPrice = (state: RootState) => state.cartReducer.cart?.totalAmount || 0;

// Thunks
export const fetchCart = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await apiService.getCart();
    dispatch(setCart(response));
    dispatch(setError(null));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch cart'));
    dispatch(clearCart());
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const addToCart = (productId: string, quantity: number = 1) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    await apiService.addToCart(productId, quantity);
    // After adding, fetch the updated cart
    const cartResponse = await apiService.getCart();
    dispatch(setCart(cartResponse));
    dispatch(setError(null));
  } catch (error) {
    console.error('Error adding item to cart:', error);
    dispatch(setError(error instanceof Error ? error.message : 'Failed to add item to cart'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

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

export const { setCart, setLoading, setError, clearCart } = cart.actions;
export default cart.reducer;
