import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ usuario, onLogout, onVolverMapa }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario',
  });

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await authService.getUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario.rol === 'admin') {
      cargarUsuarios();
    }
  }, [usuario]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authService.register(
        formData.nombre,
        formData.email,
        formData.password,
        formData.rol
      );
      alert('Usuario creado exitosamente');
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'usuario',
      });
      setShowForm(false);
      cargarUsuarios();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert(error.response?.data?.mensaje || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        setLoading(true);
        await authService.deleteUsuario(id);
        alert('Usuario eliminado exitosamente');
        cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario');
      } finally {
        setLoading(false);
      }
    }
  };

  // Permite al admin actualizar rol o estado activo/inactivo
  const handleUpdateUser = async (id, data) => {
    try {
      setLoading(true);
      await authService.updateUsuario(id, data);
      cargarUsuarios();
    } catch (error) {
      alert('Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard - {usuario.nombre}</h1>
        <div className="user-info">
          <span>Rol: <strong>{usuario.rol}</strong></span>
          <button onClick={() => onVolverMapa?.()} className="btn-volver-header">
            Volver al Mapa
          </button>
          <button onClick={onLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {usuario.rol === 'admin' && (
          <>
            <div className="section-title">
              <h2>Gestión de Usuarios</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary"
              >
                {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="user-form">
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Contraseña:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Rol:</label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="limpieza">Equipo de Limpieza</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </button>
              </form>
            )}

            {loading ? (
              <p>Cargando usuarios...</p>
            ) : (
              <table className="usuarios-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u._id}>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.rol}
                          onChange={e => handleUpdateUser(u._id, { rol: e.target.value })}
                          disabled={u._id === usuario._id || loading}
                        >
                          <option value="usuario">Usuario</option>
                          <option value="limpieza">Equipo de Limpieza</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={u.activo ? 'activo' : 'inactivo'}
                          onChange={e => handleUpdateUser(u._id, { activo: e.target.value === 'activo' })}
                          disabled={u._id === usuario._id || loading}
                        >
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="btn-delete"
                          disabled={u._id === usuario._id}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {usuario.rol !== 'admin' && (
          <p className="info-message">
            {usuario.rol === 'usuario'
              ? 'Puedes hacer click en el mapa para reportar alertas de limpieza que necesiten atención.'
              : 'Puedes actualizar el estado de las alertas de limpieza reportadas por los usuarios.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
