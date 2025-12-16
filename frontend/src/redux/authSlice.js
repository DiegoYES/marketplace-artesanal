import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Configuración del Endpoint de Autenticación
const API_URL = 'http://150.136.20.54:5000/api/auth/';

/*
 * ------------------------------------------------------------------
 * THUNKS ASÍNCRONOS (ACCIONES)
 * ------------------------------------------------------------------
 * Funciones que manejan la comunicación con la API y el almacenamiento local.
 */

// 1. REGISTRO DE USUARIO
export const registrarUsuario = createAsyncThunk(
  'auth/registrar',
  async (datosUsuario, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + 'registro', datosUsuario);
      
      // Si el registro es exitoso, guardamos la sesión inmediatamente
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

// 2. INICIO DE SESIÓN (LOGIN)
export const loginUsuario = createAsyncThunk(
  'auth/login',
  async (datosUsuario, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + 'login', datosUsuario);
      
      // Persistencia de sesión en LocalStorage
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

/*
 * ------------------------------------------------------------------
 * SLICE DE AUTENTICACIÓN
 * ------------------------------------------------------------------
 * Define el estado inicial y cómo reacciona la aplicación a las
 * acciones de registro, login y logout.
 */

// Recuperación de sesión persistente
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
    // Limpieza de estados de error/éxito (Feedback UI)
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    // Cierre de sesión
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- CICLO DE VIDA: REGISTRO ---
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
      
      // --- CICLO DE VIDA: LOGIN ---
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