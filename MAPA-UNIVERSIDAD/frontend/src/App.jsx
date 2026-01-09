import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Mapa from './components/Mapa';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLoginSuccess = (usuarioData) => {
    setUsuario(usuarioData);
    setShowDashboard(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setShowDashboard(false);
  };

  const toggleDashboard = () => {
    // Solo admins pueden acceder al dashboard
    if (usuario.rol !== 'admin') {
      alert('Solo administradores pueden acceder al Dashboard');
      return;
    }
    setShowDashboard(!showDashboard);
  };

  if (!usuario) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {showDashboard ? (
        <Dashboard 
          usuario={usuario} 
          onLogout={handleLogout}
          onVolverMapa={() => setShowDashboard(false)}
        />
      ) : (
        <>
          <div className="mapa-container">
            <Mapa usuario={usuario} />
          </div>
          <div className="app-footer">
            {usuario.rol === 'admin' && (
              <button onClick={toggleDashboard} className="btn-dashboard">
                Dashboard
              </button>
            )}
            <button onClick={handleLogout} className="btn-logout-footer">
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
