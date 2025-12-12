import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditProduct = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    imagenUrl: '',
    stock: 0
  });

  const navigate = useNavigate();
  const location = useLocation(); // Recibimos los datos del producto desde el botón "Editar"
  const { id } = useParams(); // El ID de la URL
  const { user } = useSelector((state) => state.auth);

  // Tu IP Pública
  const API_URL = `http://150.136.20.54:5000/api/products/${id}`;

  useEffect(() => {
    // Si venimos del botón "Editar", ya traemos los datos en location.state
    if (location.state && location.state.product) {
      setFormData(location.state.product);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 'x-auth-token': user.token }
      };
      await axios.put(API_URL, formData, config);
      alert('¡Producto actualizado!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar (¿Eres el dueño?)');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}>
      <h2>✏️ Editar Producto</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" required />
        <input type="number" name="precio" value={formData.precio} onChange={handleChange} placeholder="Precio" required />
        
        <select name="categoria" value={formData.categoria} onChange={handleChange}>
          <option value="Textiles">Textiles</option>
          <option value="Cerámica">Cerámica</option>
          <option value="Madera">Madera</option>
          <option value="Joyería">Joyería</option>
          <option value="Pintura">Pintura</option>
          <option value="Otros">Otros</option>
        </select>

        <input type="text" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder="URL Imagen" />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" />

        <button type="submit" style={{ background: '#ffc107', color: 'black' }}>Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditProduct;