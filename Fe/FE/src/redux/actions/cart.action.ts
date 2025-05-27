import apiService from "@/api/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../store";
import { RootState } from "../store";

export const loadCart = createAsyncThunk('load/cart', async (_, thunkApi) => {
  try {
    return await apiService.getCart();
  } catch (error) {
    thunkApi.rejectWithValue({ message: 'Failed to fetch cart' })
  }
})

export const addToCart = createAsyncThunk<
  any,
  { productId: string, quantity: number }
>('cart/add', async ({ productId, quantity = 1 }, thunkApi) => {
  try {
    await apiService.addToCart(productId, quantity);
    return await apiService.getCart();
  } catch (error) {
    thunkApi.rejectWithValue({ message: 'Failed to add item to cart' })
  }
})