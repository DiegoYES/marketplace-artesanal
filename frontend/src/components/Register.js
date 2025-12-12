import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario, reset } from '../redux/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'comprador' // Valor inicial
  });

  const { nombre, email, password, rol } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

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
    dispatch(registrarUsuario(datosUsuario));
  };

  if (isLoading) {
    return <h2>Cargando...</h2>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', background: 'white', borderRadius: '8px' }}>
      <h2>👤 Crear Cuenta</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="nombre"
          value={nombre}
          placeholder="Nombre completo"
          onChange={onChange}
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Correo electrónico"
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Contraseña"
          onChange={onChange}
          required
        />
        
        {/* --- SELECTOR DE ROL --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Quiero registrarme como:</label>
            <select name="rol" value={rol} onChange={onChange} style={{ padding: '10px', background: 'white' }}>
                <option value="comprador">🛒 Comprador (Quiero comprar)</option>
                <option value="vendedor">🎨 Vendedor (Soy artesano)</option>
            </select>
        </div>

        <button type="submit" style={{ background: '#282c34', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;