import { createSlice } from '@reduxjs/toolkit';

/*
 * ------------------------------------------------------------------
 * ESTADO INICIAL Y PERSISTENCIA
 * ------------------------------------------------------------------
 * Intentamos recuperar el carrito del LocalStorage del navegador
 * para evitar que los datos se pierdan al recargar la página.
 */
const cartFromStorage = localStorage.getItem('cart') 
  ? JSON.parse(localStorage.getItem('cart')) 
  : [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: cartFromStorage, 
  },
  reducers: {
    /*
     * ACCIÓN: AGREGAR AL CARRITO
     * Verifica duplicados y actualiza el almacenamiento local.
     */
    addToCart: (state, action) => {
      const item = action.payload;
      
      // Verificamos existencia previa del producto
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Si existe, actualizamos el objeto (útil para cambios de precio/datos)
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // Si es nuevo, lo añadimos al array
        state.cartItems = [...state.cartItems, item];
      }

      // Sincronización con LocalStorage
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },

    /*
     * ACCIÓN: ELIMINAR DEL CARRITO
     * Filtra el array excluyendo el ID seleccionado.
     */
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },

    /*
     * ACCIÓN: VACIAR CARRITO
     * Limpieza total tras una compra exitosa o logout.
     */
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cart');
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;