import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardLimpieza from './components/DashboardLimpieza';
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
    // Admin o limpieza pueden acceder a su dashboard
    if (usuario.rol === 'admin' || usuario.rol === 'limpieza') {
      setShowDashboard(!showDashboard);
    } else {
      alert('Solo administradores o limpieza pueden acceder al Dashboard');
    }
  };

  if (!usuario) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {showDashboard ? (
        usuario.rol === 'admin' ? (
          <Dashboard 
            usuario={usuario} 
            onLogout={handleLogout}
            onVolverMapa={() => setShowDashboard(false)}
          />
        ) : usuario.rol === 'limpieza' ? (
          <DashboardLimpieza
            usuario={usuario}
            onLogout={handleLogout}
            onVolverMapa={() => setShowDashboard(false)}
          />
        ) : null
      ) : (
        <>
          <div className="mapa-container">
            <Mapa usuario={usuario} />
          </div>
          <div className="app-footer">
            {(usuario.rol === 'admin' || usuario.rol === 'limpieza') && (
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
