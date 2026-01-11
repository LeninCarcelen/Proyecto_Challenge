import React, { useEffect, useState } from 'react';
import { alertaService } from '../services/api';
import './Dashboard.css';

const DashboardLimpieza = ({ usuario, onLogout, onVolverMapa }) => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarAlertas = async () => {
    try {
      setLoading(true);
      const response = await alertaService.getAlertas();
      setAlertas(response.data);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
      alert('Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario.rol === 'limpieza') {
      cargarAlertas();
    }
  }, [usuario]);

  const actualizarEstado = async (id, estado) => {
    try {
      await alertaService.updateAlerta(id, estado, '');
      cargarAlertas();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const eliminarAlerta = async (id) => {
    if (!window.confirm('¿Eliminar esta alerta?')) return;
    try {
      await alertaService.deleteAlerta(id);
      cargarAlertas();
    } catch (error) {
      alert('Error al eliminar alerta');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Panel de Limpieza</h1>
        <div className="user-info">
          <span>{usuario.nombre} ({usuario.email})</span>
          <button onClick={onLogout} className="btn-logout">Cerrar sesión</button>
          <button onClick={onVolverMapa} className="btn-volver-header">Ver Mapa</button>
        </div>
      </div>
      <h2>Alertas de Limpieza</h2>
      {loading ? (
        <p>Cargando alertas...</p>
      ) : (
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map((a) => (
              <tr key={a._id}>
                <td>{a.ubicacion?.coordinates?.join(', ')}</td>
                <td>{a.estado}</td>
                <td>{a.descripcion}</td>
                <td>
                  <button onClick={() => actualizarEstado(a._id, 'En proceso')} className="btn-primary">En proceso</button>
                  <button onClick={() => actualizarEstado(a._id, 'Completado')} className="btn-primary">Completado</button>
                  <button onClick={() => eliminarAlerta(a._id)} className="btn-delete">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardLimpieza;
