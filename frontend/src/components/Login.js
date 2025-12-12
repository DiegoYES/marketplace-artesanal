import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUsuario, reset } from '../redux/authSlice'; // Usamos la acción de LOGIN

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message); // Mostrar error si contraseña está mal
    }
    if (isSuccess || user) {
      navigate('/'); // Ir al inicio si entra bien
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
    dispatch(loginUsuario({ email, password }));
  };

  if (isLoading) {
    return <h2>Iniciando sesión...</h2>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>🔐 Iniciar Sesión</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Correo electrónico"
          onChange={onChange}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Contraseña"
          onChange={onChange}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ background: '#61dafb', color: '#000', padding: '12px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;