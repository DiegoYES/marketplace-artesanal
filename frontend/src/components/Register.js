import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario, reset } from '../redux/authSlice';

/*
 * ------------------------------------------------------------------
 * COMPONENTE: REGISTRO DE USUARIO
 * ------------------------------------------------------------------
 * Formulario de creación de cuenta.
 * Permite al usuario definir su ROL (Comprador vs Vendedor) desde el inicio,
 * lo cual determinará sus permisos en la plataforma.
 */
const Register = () => {
    // Estado local para los campos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'comprador' // Valor por defecto
    });

    const { nombre, email, password, rol } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Conexión con el estado global de Redux (Auth)
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    /*
     * GESTIÓN DE ESTADOS DE LA PETICIÓN
     * Redirige al Home si el registro es exitoso.
     * Muestra alertas si hay errores (ej. email duplicado).
     */
    useEffect(() => {
        if (isError) {
            alert(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const datosUsuario = { nombre, email, password, rol };
        
        // Despacho de la acción para crear usuario en Backend
        dispatch(registrarUsuario(datosUsuario));
    };

    if (isLoading) {
        return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Creando cuenta...</h2>;
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', background: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>👤 Crear Cuenta</h2>
            
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <input
                    type="text"
                    name="nombre"
                    value={nombre}
                    placeholder="Nombre completo"
                    onChange={onChange}
                    required
                    style={{ padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                
                <input
                    type="email"
                    name="email"
                    value={email}
                    placeholder="Correo electrónico"
                    onChange={onChange}
                    required
                    style={{ padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                
                <input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Contraseña"
                    onChange={onChange}
                    required
                    style={{ padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                
                {/* --- SELECCIÓN DE ROL CRÍTICA --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#555' }}>Quiero registrarme como:</label>
                    <select 
                        name="rol" 
                        value={rol} 
                        onChange={onChange} 
                        style={{ padding: '12px', background: '#f9f9f9', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }}
                    >
                        <option value="comprador">🛒 Comprador (Quiero comprar)</option>
                        <option value="vendedor">🎨 Vendedor (Soy artesano)</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    style={{ 
                        background: '#2c3e50', 
                        color: 'white', 
                        padding: '12px', 
                        borderRadius: '5px', 
                        marginTop: '15px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background 0.3s'
                    }}
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;