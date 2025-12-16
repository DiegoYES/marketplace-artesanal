import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';

/*
 * ------------------------------------------------------------------
 * PUNTO DE ENTRADA (BOOTSTRAPPING)
 * ------------------------------------------------------------------
 * Renderiza la aplicación React en el DOM.
 * Configura el 'Provider' de Redux para inyectar el estado global (Store)
 * en toda la jerarquía de componentes.
 */

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* * PROVIDER:
      * Conecta React con Redux.
      * Hace que el 'store' esté disponible para cualquier componente
      * que utilice el hook useSelector() o useDispatch().
      */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);