import { configureStore } from '@reduxjs/toolkit';
// CAMBIO: Quitamos el "/redux/" porque ya estamos dentro de esa carpeta
import authReducer from './authSlice'; 
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});