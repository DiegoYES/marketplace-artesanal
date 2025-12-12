import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import axios from 'axios'; // <--- Importamos Axios para conectar con el Backend

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  
  const { user } = useSelector((state) => state.auth);

  // Calcular Total
  const total = cartItems.reduce((acc, item) => acc + item.precio, 0);

  // URL del Backend (Tu IP o Dominio)
  const API_URL = 'http://150.136.20.54:5000/api/orders';

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // --- LÓGICA DE PAGO REAL ---
  const checkoutHandler = async () => {
    if (!user) {
      alert('Debes iniciar sesión para comprar');
      navigate('/login');
      return;
    }

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': user.token // Enviamos el token para que sepa quién compra
            }
        };

        // Preparamos los datos como los pide el Backend (Order.js)
        const orderData = {
            items: cartItems.map(item => ({
                producto: item._id, // El ID del producto
                nombre: item.nombre,
                precio: item.precio,
                cantidad: 1 // Por ahora manejamos cantidad 1
            })),
            total: total
        };

        // ¡ENVIAMOS LA ORDEN!
        await axios.post(API_URL, orderData, config);

        alert('✅ ¡Compra realizada con éxito! Tu orden ha sido guardada.');
        
        // Limpiamos el carrito y redirigimos
        dispatch(clearCart());
        navigate('/');

    } catch (error) {
        console.error(error);
        alert('❌ Error al procesar la compra. Intenta de nuevo.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>🛒 Tu Carrito de Compras</h2>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px' }}>
          <h3>Tu carrito está vacío 😢</h3>
          <Link to="/" style={{ color: '#61dafb', textDecoration: 'none', fontWeight: 'bold' }}>Ir a comprar</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* LISTA DE ITEMS */}
            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                {cartItems.map((item) => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img src={item.imagenUrl || 'https://via.placeholder.com/50'} alt={item.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div>
                                <h4 style={{ margin: '0 0 5px 0' }}>{item.nombre}</h4>
                                <span style={{ color: '#888', fontSize: '0.9rem' }}>{item.categoria}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <span style={{ fontWeight: 'bold' }}>${item.precio}</span>
                            <button 
                                onClick={() => removeFromCartHandler(item._id)}
                                style={{ background: '#ff7675', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* RESUMEN DE PAGO */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'right', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h3>Total ({cartItems.length} productos): <span style={{ color: '#27ae60', fontSize: '1.5rem' }}>${total}</span></h3>
                <button 
                    onClick={checkoutHandler}
                    style={{ background: '#2ecc71', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: 'background 0.3s' }}
                >
                    Pagar Ahora 💳
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;