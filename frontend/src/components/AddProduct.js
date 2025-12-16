import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/*
 * ------------------------------------------------------------------
 * COMPONENTE: FORMULARIO DE ALTA DE PRODUCTOS
 * ------------------------------------------------------------------
 * Permite a los usuarios con rol de Vendedor crear nuevas publicaciones.
 * Requiere autenticación activa para firmar la petición con el Token.
 */
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
    
    // Obtención del usuario y token desde el Estado Global (Redux)
    const { user } = useSelector((state) => state.auth);

    const API_URL = 'http://150.136.20.54:5000/api/products';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    /*
     * MANEJO DEL ENVÍO DEL FORMULARIO
     * Construye la petición POST inyectando el JWT en los headers.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de sesión local antes de llamar a la API
        if (!user || !user.token) {
            alert('Debes iniciar sesión para publicar');
            navigate('/login');
            return;
        }

        try {
            // Configuración del Header de Autorización
            const config = {
                headers: {
                    'x-auth-token': user.token
                }
            };

            // Petición al Backend (Datos + Token)
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
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>➕ Nuevo Producto</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <input 
                    type="text" 
                    name="nombre" 
                    placeholder="Nombre del producto" 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} 
                />
                
                <textarea 
                    name="descripcion" 
                    placeholder="Descripción detallada" 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '80px' }}
                />
                
                <input 
                    type="number" 
                    name="precio" 
                    placeholder="Precio ($)" 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                
                <select 
                    name="categoria" 
                    onChange={handleChange}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                    <option value="Otros">Selecciona Categoría</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Cerámica">Cerámica</option>
                    <option value="Madera">Madera</option>
                    <option value="Joyería">Joyería</option>
                    <option value="Pintura">Pintura</option>
                </select>

                <input 
                    type="text" 
                    name="imagenUrl" 
                    placeholder="URL de la imagen (opcional)" 
                    onChange={handleChange} 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                
                <input 
                    type="number" 
                    name="stock" 
                    placeholder="Cantidad en Stock" 
                    onChange={handleChange} 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />

                <button 
                    type="submit" 
                    style={{ 
                        background: '#282c34', 
                        color: 'white', 
                        padding: '12px', 
                        border: 'none', 
                        cursor: 'pointer',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                    }}
                >
                    Publicar Artesanía
                </button>
            </form>
        </div>
    );
};

export default AddProduct;