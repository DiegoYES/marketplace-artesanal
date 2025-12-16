import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from './redux/authSlice';

// Importación de Componentes (Vistas)
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import Register from './components/Register';
import Login from './components/Login';
import EditProduct from './components/EditProduct';
import CartScreen from './components/CartScreen';

import './App.css';

function App() {
  const dispatch = useDispatch();
  
  // Suscripción a Estados Globales (Sesión y Carrito)
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart); 

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
  };

  return (
    <Router>
      <div className="App">
        
        {/* ------------------------------------------------------------------
         * BARRA DE NAVEGACIÓN (NAVBAR)
         * ------------------------------------------------------------------ */}
        <nav style={{ background: '#2c3e50', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
          
          {/* LOGOTIPO */}
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🎨</span>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Marketplace Equipo K</h1>
          </Link>
          
          {/* MENÚ DERECHO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            
            {/* ÍCONO DE CARRITO (CON CONTADOR DINÁMICO) */}
            <Link to="/carrito" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1.2rem', position: 'relative' }}>
                🛒 
                {cartItems.length > 0 && (
                    <span style={{ 
                        background: '#e74c3c', 
                        color: 'white', 
                        borderRadius: '50%', 
                        padding: '2px 6px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        position: 'absolute',
                        top: '-8px',
                        right: '-10px',
                        minWidth: '18px',
                        textAlign: 'center'
                    }}>
                        {cartItems.length}
                    </span>
                )}
            </Link>

            {/* LÓGICA DE USUARIO LOGUEADO VS INVITADO */}
            {user ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '10px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{user.nombre}</span> 
                    <span style={{ background: '#f1c40f', color: '#2c3e50', padding: '1px 6px', borderRadius: '4px', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      {user.rol}
                    </span>
                </div>
                
                <button 
                    onClick={onLogout} 
                    style={{ background: 'transparent', border: '1px solid #bdc3c7', color: '#bdc3c7', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', transition: '0.3s' }}
                >
                  Salir
                </button>

                {/* BOTÓN EXCLUSIVO PARA VENDEDORES */}
                {user.rol === 'vendedor' && (
                  <Link to="/crear-producto" style={{ background: '#61dafb', color: '#282c34', padding: '8px 15px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', border: '1px solid #61dafb' }}>
                    + Vender
                  </Link>
                )}
              </>
            ) : (
              // MENU PARA VISITANTES
              <>
                <Link to="/registro" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: '500' }}>Registrarse</Link>
                <Link to="/login" style={{ background: 'white', color: '#2c3e50', padding: '6px 15px', textDecoration: 'none', borderRadius: '20px', fontWeight: 'bold' }}>Login</Link>
              </>
            )}

          </div>
        </nav>
        
        {/* ------------------------------------------------------------------
         * DEFINICIÓN DE RUTAS
         * ------------------------------------------------------------------ */}
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/crear-producto" element={<AddProduct />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/editar-producto/:id" element={<EditProduct />} />
          <Route path="/carrito" element={<CartScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;