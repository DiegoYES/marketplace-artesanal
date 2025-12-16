import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; 
import cartReducer from './cartSlice';

/*
 * ------------------------------------------------------------------
 * STORE (ALMACÉN GLOBAL)
 * ------------------------------------------------------------------
 * Configuración central de Redux.
 * Combina los diferentes "slices" (rebanadas de estado) en una
 * única fuente de verdad para toda la aplicación.
 */
export const store = configureStore({
    reducer: {
        // Estado de sesión (Usuario, Token, Errores)
        auth: authReducer,
        
        // Estado de compras (Items, Total)
        cart: cartReducer,
    },
});