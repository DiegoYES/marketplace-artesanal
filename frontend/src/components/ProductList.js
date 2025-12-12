import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice'; // Importamos la acción

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch(); // Para disparar acciones
  
  const { user } = useSelector((state) => state.auth);

  // TU IP / DOMINIO
  const API_URL = 'http://150.136.20.54:5000/api/products';

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar?')) {
        try {
            const config = { headers: { 'x-auth-token': user.token } };
            await axios.delete(`${API_URL}/${id}`, config);
            fetchProducts();
            alert('Producto eliminado');
        } catch (error) { console.error(error); }
    }
  };

  // FUNCIÓN PARA AGREGAR AL CARRITO
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`${product.nombre} agregado al carrito 🛒`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>📦 Marketplace Artesanal</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {products.map((product) => (
          <div key={product._id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ height: '220px', overflow: 'hidden' }}>
              <img src={product.imagenUrl || 'https://via.placeholder.com/300'} alt={product.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div style={{ padding: '20px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.25rem' }}>{product.nombre}</h3>
                  <p style={{ color: '#666', fontSize: '0.95rem' }}>{product.descripcion}</p>
              </div>
              
              <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '1.2rem' }}>${product.precio}</span>
                      <span style={{ background: '#e0f7fa', color: '#006064', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>{product.categoria}</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#95a5a6', fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                      Vendido por: {product.creador ? product.creador.nombre : 'Anónimo'}
                  </div>

                  {/* --- LÓGICA DE BOTONES SEGÚN ROL --- */}
                  
                  {/* CASO 1: SOY EL DUEÑO (Vendedor) -> Editar/Borrar */}
                  {user && product.creador && (user._id === product.creador._id || user.id === product.creador._id) ? (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <Link to={`/editar-producto/${product._id}`} state={{ product }} style={{ flex: 1, background: '#f1c40f', color: '#2c3e50', padding: '8px', textAlign: 'center', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none' }}>✏️ Editar</Link>
                          <button onClick={() => handleDelete(product._id)} style={{ flex: 1, background: '#e74c3c', color: 'white', padding: '8px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>🗑️ Borrar</button>
                      </div>
                  ) : (
                      /* CASO 2: SOY COMPRADOR O VISITANTE -> Agregar al Carrito */
                      <button 
                        onClick={() => handleAddToCart(product)}
                        style={{ marginTop: '15px', width: '100%', background: '#2980b9', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        🛒 Agregar al Carrito
                      </button>
                  )}

              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;