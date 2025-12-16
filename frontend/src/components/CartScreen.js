import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import axios from 'axios';

/*
 * ------------------------------------------------------------------
 * COMPONENTE: PANTALLA DE CARRITO Y CHECKOUT
 * ------------------------------------------------------------------
 * Gestiona la visualización de items seleccionados, cálculo de totales
 * y la transacción final de compra comunicándose con la API.
 */
const CartScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Obtención de estado global (Carrito y Sesión)
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const { user } = useSelector((state) => state.auth);

    // Cálculo dinámico del total
    const total = cartItems.reduce((acc, item) => acc + item.precio, 0);

    const API_URL = 'http://150.136.20.54:5000/api/orders';

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    /*
     * PROCESO DE CHECKOUT (PAGO)
     * 1. Valida autenticación.
     * 2. Estructura el payload según el modelo de datos del Backend.
     * 3. Envía la orden y limpia el carrito tras el éxito.
     */
    const checkoutHandler = async () => {
        if (!user) {
            alert('Debes iniciar sesión para completar la compra');
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': user.token // Autenticación de la transacción
                }
            };

            // Mapeo de items para coincidir con Schema de Mongoose
            const orderData = {
                items: cartItems.map(item => ({
                    producto: item._id,
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: 1
                })),
                total: total
            };

            // Transacción HTTP
            await axios.post(API_URL, orderData, config);

            alert('✅ ¡Compra realizada con éxito! Tu orden ha sido guardada.');
            
            // Limpieza de estado y redirección
            dispatch(clearCart());
            navigate('/');

        } catch (error) {
            console.error(error);
            alert('❌ Error al procesar la compra. Por favor intenta nuevamente.');
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>🛒 Tu Carrito de Compras</h2>

            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#555' }}>Tu carrito está vacío 😢</h3>
                    <Link to="/" style={{ color: '#0984e3', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Volver al catálogo
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* LISTA DE ITEMS */}
                    <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        {cartItems.map((item) => (
                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <img 
                                        src={item.imagenUrl || 'https://via.placeholder.com/60'} 
                                        alt={item.nombre} 
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                                    />
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.nombre}</h4>
                                        <span style={{ color: '#888', fontSize: '0.9rem', background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px' }}>
                                            {item.categoria}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#2d3436' }}>${item.precio}</span>
                                    <button 
                                        onClick={() => removeFromCartHandler(item._id)}
                                        style={{ background: '#ff7675', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', transition: '0.3s' }}
                                        title="Eliminar producto"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RESUMEN DE PAGO */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: '8px', textAlign: 'right', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 15px 0' }}>
                            Total ({cartItems.length} productos): <span style={{ color: '#27ae60', fontSize: '1.8rem' }}>${total}</span>
                        </h3>
                        <button 
                            onClick={checkoutHandler}
                            style={{ 
                                background: '#2ecc71', 
                                color: 'white', 
                                padding: '15px 40px', 
                                border: 'none', 
                                borderRadius: '8px', 
                                fontSize: '1.2rem', 
                                fontWeight: 'bold', 
                                cursor: 'pointer', 
                                boxShadow: '0 4px 6px rgba(46, 204, 113, 0.3)'
                            }}
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