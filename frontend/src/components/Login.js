import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUsuario, reset } from '../redux/authSlice';

/*
 * ------------------------------------------------------------------
 * COMPONENTE: INICIO DE SESIÓN
 * ------------------------------------------------------------------
 * Gestiona la autenticación de usuarios mediante Redux.
 * Observa el estado global (auth) para manejar redirecciones o errores.
 */
const Login = () => {
    // Estado local del formulario
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Suscripción al Estado Global de Autenticación
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    /*
     * EFECTO DE CAMBIO DE ESTADO
     * Reacciona a los cambios en el ciclo de vida de la petición de login.
     * - Error: Notifica al usuario.
     * - Éxito: Redirige al Dashboard/Inicio.
     */
    useEffect(() => {
        if (isError) {
            alert(message); 
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset()); // Limpieza de estados transitorios
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // Despacho de la acción asíncrona a Redux
        dispatch(loginUsuario({ email, password }));
    };

    if (isLoading) {
        return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Iniciando sesión...</h2>;
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: 'white' }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>🔐 Iniciar Sesión</h2>
            
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                
                <button 
                    type="submit" 
                    style={{ 
                        background: '#61dafb', 
                        color: '#000', 
                        padding: '12px', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '16px', 
                        fontWeight: 'bold',
                        borderRadius: '5px',
                        marginTop: '10px',
                        transition: 'background 0.3s'
                    }}
                >
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;