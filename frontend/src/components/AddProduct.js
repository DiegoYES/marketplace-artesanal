import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // <--- 1. Importar useSelector

const AddProduct = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'Otros',
    imagenUrl: '',
    stock: 1
  });

  const navigate = useNavigate();
  
  // 2. Obtener el usuario (y su token) desde Redux
  const { user } = useSelector((state) => state.auth);

  const API_URL = 'http://150.136.20.54:5000/api/products';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. Verificamos si hay usuario antes de enviar
    if (!user || !user.token) {
      alert('Debes iniciar sesión para publicar');
      navigate('/login');
      return;
    }

    try {
      // 4. Preparamos el header con el token
      const config = {
        headers: {
          'x-auth-token': user.token
        }
      };

      // 5. Enviamos los datos Y la configuración (token)
      await axios.post(API_URL, formData, config);
      
      alert('¡Producto creado con éxito!');
      navigate('/');
    } catch (error) {
      console.error(error);
      const msg = error.response && error.response.data && error.response.data.msg 
                  ? error.response.data.msg 
                  : 'Hubo un error al crear el producto';
      alert(msg);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>➕ Nuevo Producto</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <input type="text" name="nombre" placeholder="Nombre del producto" onChange={handleChange} required style={{padding: '8px'}} />
        
        <textarea name="descripcion" placeholder="Descripción detallada" onChange={handleChange} required />
        
        <input type="number" name="precio" placeholder="Precio ($)" onChange={handleChange} required />
        
        <select name="categoria" onChange={handleChange}>
          <option value="Otros">Selecciona Categoría</option>
          <option value="Textiles">Textiles</option>
          <option value="Cerámica">Cerámica</option>
          <option value="Madera">Madera</option>
          <option value="Joyería">Joyería</option>
          <option value="Pintura">Pintura</option>
        </select>

        <input type="text" name="imagenUrl" placeholder="URL de la imagen" onChange={handleChange} />
        
        <input type="number" name="stock" placeholder="Cantidad en Stock" onChange={handleChange} />

        <button type="submit" style={{ background: '#282c34', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
          Publicar Artesanía
        </button>
      </form>
    </div>
  );
};

export default AddProduct;