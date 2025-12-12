import { createSlice } from '@reduxjs/toolkit';

// Intentamos leer el carrito del almacenamiento local por si refrescan la página
const cartFromStorage = localStorage.getItem('cart') 
  ? JSON.parse(localStorage.getItem('cart')) 
  : [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: cartFromStorage, 
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      // Verificamos si ya existe el producto en el carrito
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Si ya existe, actualizamos (por ejemplo si cambiara la cantidad)
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // Si no existe, lo agregamos
        state.cartItems = [...state.cartItems, item];
      }

      // Guardamos en el navegador para no perderlo al recargar
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      // Filtramos para quitar el producto que tenga ese ID
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cart');
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;