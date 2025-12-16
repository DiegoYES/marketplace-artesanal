import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

/*
 * ------------------------------------------------------------------
 * COMPONENTE: EDICIÓN DE PRODUCTO
 * ------------------------------------------------------------------
 * Formulario para modificar las características de una artesanía.
 * Optimización: Carga datos iniciales desde el estado de navegación
 * para evitar latencia innecesaria.
 */
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
    const location = useLocation();
    const { id } = useParams();
    
    // Acceso al token de seguridad desde Redux
    const { user } = useSelector((state) => state.auth);

    const API_URL = `http://150.136.20.54:5000/api/products/${id}`;

    /*
     * EFECTO DE PRE-CARGA
     * Verifica si se recibieron datos a través de la navegación (state)
     * para pre-llenar el formulario instantáneamente.
     */
    useEffect(() => {
        if (location.state && location.state.product) {
            setFormData(location.state.product);
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };

    /*
     * ACTUALIZACIÓN DEL RECURSO (PUT)
     * Envía los datos modificados al backend, adjuntando el token
     * para validar la propiedad del producto.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { 'x-auth-token': user.token }
            };
            
            await axios.put(API_URL, formData, config);
            
            alert('¡Producto actualizado correctamente!');
            navigate('/');

        } catch (error) {
            console.error(error);
            alert('Error al actualizar: Verifica que tengas permisos para editar este ítem.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>✏️ Editar Producto</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <input 
                    type="text" 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    placeholder="Nombre" 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                
                <textarea 
                    name="descripcion" 
                    value={formData.descripcion} 
                    onChange={handleChange} 
                    placeholder="Descripción" 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '80px' }}
                />
                
                <input 
                    type="number" 
                    name="precio" 
                    value={formData.precio} 
                    onChange={handleChange} 
                    placeholder="Precio" 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                
                <select 
                    name="categoria" 
                    value={formData.categoria} 
                    onChange={handleChange}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                    <option value="Textiles">Textiles</option>
                    <option value="Cerámica">Cerámica</option>
                    <option value="Madera">Madera</option>
                    <option value="Joyería">Joyería</option>
                    <option value="Pintura">Pintura</option>
                    <option value="Otros">Otros</option>
                </select>

                <input 
                    type="text" 
                    name="imagenUrl" 
                    value={formData.imagenUrl} 
                    onChange={handleChange} 
                    placeholder="URL Imagen" 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                
                <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleChange} 
                    placeholder="Stock" 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />

                <button 
                    type="submit" 
                    style={{ 
                        background: '#f39c12', 
                        color: 'white', 
                        padding: '12px', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
};

export default EditProduct;