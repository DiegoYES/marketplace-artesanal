import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from './redux/authSlice';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import Register from './components/Register';
import Login from './components/Login';
import EditProduct from './components/EditProduct';
import CartScreen from './components/CartScreen';

function App() {
  const dispatch = useDispatch();
  
  // Traemos al usuario y al carrito desde Redux
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart); 

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
  };

  return (
    <Router>
      <div className="App">
        {/* BARRA DE NAVEGACIÓN */}
        <nav style={{ background: '#282c34', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🎨 Marketplace Equipo K</h1>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* --- AQUÍ ESTÁ EL ENLACE AL CARRITO --- */}
            <Link to="/carrito" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                🛒 
                {/* Mostramos contador rojo si hay cosas */}
                {cartItems.length > 0 && (
                    <span style={{ background: '#e74c3c', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {cartItems.length}
                    </span>
                )}
            </Link>
            {/* -------------------------------------- */}

            {user ? (
              <>
                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  Hola, {user.nombre} 
                  <span style={{ background: '#444', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    {user.rol}
                  </span>
                </span>
                
                <button onClick={onLogout} style={{ width: 'auto', background: 'transparent', border: '1px solid white', color: 'white', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '0.8rem' }}>
                  Salir
                </button>

                {/* SOLO EL VENDEDOR VE ESTO */}
                {user.rol === 'vendedor' && (
                  <Link to="/crear-producto" style={{ background: '#61dafb', color: 'black', padding: '8px 15px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                    + Vender
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/registro" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Registro</Link>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
              </>
            )}

          </div>
        </nav>
        
        {/* RUTAS DE LA APP */}
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