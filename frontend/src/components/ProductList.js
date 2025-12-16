import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import ChatComponent from './ChatComponent';

/*
 * ------------------------------------------------------------------
 * COMPONENTE: CATÁLOGO DE PRODUCTOS (HOME)
 * ------------------------------------------------------------------
 * Renderiza la grilla de artesanías disponibles.
 * Implementa lógica condicional para mostrar controles de Vendedor
 * o controles de Comprador según el dueño del ítem o rol de Admin.
 */
const ProductList = () => {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();
    
    // Acceso al estado global de autenticación
    const { user } = useSelector((state) => state.auth);

    const API_URL = 'http://150.136.20.54:5000/api/products';

    /*
     * CARGA DE DATOS (READ)
     */
    const fetchProducts = async () => {
        try {
            const res = await axios.get(API_URL);
            setProducts(res.data);
        } catch (error) {
            console.error('Error de conexión al cargar productos:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    /*
     * ELIMINAR PRODUCTO (DELETE)
     * Requiere token de seguridad.
     */
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta publicación permanentemente?')) {
            try {
                const config = { headers: { 'x-auth-token': user.token } };
                await axios.delete(`${API_URL}/${id}`, config);
                
                fetchProducts();
                alert('Producto eliminado correctamente');
            } catch (error) { 
                console.error(error);
                alert('Error al eliminar: No tienes permisos o el servidor falló.');
            }
        }
    };

    /*
     * AGREGAR AL CARRITO
     */
    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        alert(`${product.nombre} agregado al carrito 🛒`);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50', fontSize: '2rem' }}>
                📦 Marketplace Artesanal
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {products.map((product) => (
                    <div key={product._id} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s' }}>
                        
                        {/* IMAGEN */}
                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                            <img 
                                src={product.imagenUrl || 'https://via.placeholder.com/300'} 
                                alt={product.nombre} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                                {product.categoria}
                            </span>
                        </div>
                        
                        {/* CONTENIDO */}
                        <div style={{ padding: '20px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', color: '#34495e' }}>{product.nombre}</h3>
                                <p style={{ color: '#7f8c8d', fontSize: '0.95rem', lineHeight: '1.4' }}>{product.descripcion}</p>
                            </div>
                            
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0' }}>
                                    <span style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '1.4rem' }}>${product.precio}</span>
                                    <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>
                                        Por: {product.creador ? product.creador.nombre : 'Vendedor'}
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                    
                                    {/* * LÓGICA DE PERMISOS:
                                     * Se muestran controles de administración si:
                                     * 1. El usuario tiene rol 'admin'.
                                     * 2. El usuario es el creador del producto.
                                     */}
                                    {user && (
                                        (user.rol === 'admin') || 
                                        (product.creador && (user._id === product.creador._id || user.id === product.creador._id))
                                    ) ? (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Link 
                                                to={`/editar-producto/${product._id}`} 
                                                state={{ product }} 
                                                style={{ flex: 1, background: '#f1c40f', color: '#fff', padding: '10px', textAlign: 'center', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none' }}
                                            >
                                                ✏️ Editar
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product._id)} 
                                                style={{ flex: 1, background: '#e74c3c', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                🗑️ Borrar
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            style={{ width: '100%', background: '#3498db', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                                        >
                                            🛒 Agregar al Carrito
                                        </button>
                                    )}

                                    {/* CHAT */}
                                    {user && (
                                        <div style={{ marginTop: '20px' }}>
                                            <ChatComponent room={product._id} username={user.nombre} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;