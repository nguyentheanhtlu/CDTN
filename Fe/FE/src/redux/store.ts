import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { quickViewSlice, QuickViewState } from "./features/quickView-slice";
import cartReducer, { cart, CartState } from "./features/cart-slice";
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import { appMiddleware } from "./middleware/app.middleware";
import { wishlistSlice, WishlistState } from "./features/wishlist-slice";
import { productDetails, ProductState } from "./features/product-details";
import { authSlice, AuthSliceState } from "./features/authSlice";


const reducers = combineReducers({
  auth: authSlice.reducer,
  quickView: quickViewSlice.reducer,
  cart: cart.reducer,
  wishlist: wishlistSlice.reducer,
  productDetails: productDetails.reducer
})

const persistedReducer = persistReducer({
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
}, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).prepend(appMiddleware.middleware),
});

export const persistor = persistStore(store);

export type RootState = {
  auth: AuthSliceState;
  quickView: QuickViewState;
  cart: CartState;
  productDetails: ProductState;
  wishlist: WishlistState;
};

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
