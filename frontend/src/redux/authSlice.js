import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL de tu Backend
// ASEGÚRATE DE QUE ESTA IP SEA LA TUYA
const API_URL = 'http://150.136.20.54:5000/api/auth/';

// --- ACCIONES (Thunks) ---

// 1. Acción para Registrarse
export const registrarUsuario = createAsyncThunk(
  'auth/registrar',
  async (datosUsuario, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + 'registro', datosUsuario);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.msg) || error.message;
      return thunkAPI.rejectWithValue({ msg: message });
    }
  }
);

// 2. Acción para Login (ESTA ES LA QUE TE FALTABA)
export const loginUsuario = createAsyncThunk(
  'auth/login',
  async (datosUsuario, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + 'login', datosUsuario);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.msg) || error.message;
      return thunkAPI.rejectWithValue({ msg: message });
    }
  }
);

// --- SLICE (Estado y Reducers) ---

const user = JSON.parse(localStorage.getItem('user'));

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Casos de REGISTRO
      .addCase(registrarUsuario.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registrarUsuario.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(registrarUsuario.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.msg;
        state.user = null;
      })
      // Casos de LOGIN
      .addCase(loginUsuario.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUsuario.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginUsuario.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.msg;
        state.user = null;
      });
  }
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;