import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { alertaService, contenedorService } from '../services/api';
import './Mapa.css';

// Iconos
import amarilloIcon from '../assets/amarillo.svg';
import azulIcon from '../assets/azul.svg';
import verdeIcon from '../assets/verde.svg';
import negroIcon from '../assets/negro.svg';
import rosaIcon from '../assets/rosa.svg';
import rojoIcon from '../assets/rojo.svg';

const iconBase = {
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
};

const iconos = {
  amarillo: new L.Icon({ iconUrl: amarilloIcon, ...iconBase }),
  azul: new L.Icon({ iconUrl: azulIcon, ...iconBase }),
  verde: new L.Icon({ iconUrl: verdeIcon, ...iconBase }),
  negro: new L.Icon({ iconUrl: negroIcon, ...iconBase }),
  rosa: new L.Icon({ iconUrl: rosaIcon, ...iconBase }),
};

const alertaIcon = new L.Icon({
  iconUrl: rojoIcon,
  ...iconBase,
});

// Componente para captar clicks de usuarios
function ClickAlerta({ enabled, onConfirm }) {
  useMapEvents({
    click(e) {
      if (!enabled) return;
      const confirmado = window.confirm(
        '¿Desea registrar una alerta de limpieza en este punto?'
      );
      if (confirmado) {
        onConfirm(e.latlng);
      }
    },
  });
  return null;
}

// Componente para captar clicks de admin
function ClickContenedor({ enabled, tipo, onAdd }) {
  useMapEvents({
    click(e) {
      if (!enabled || !tipo) return;
      onAdd(e.latlng);
    },
  });
  return null;
}

const Mapa = ({ usuario }) => {
  const mapRef = useRef(null);
  const [contenedores, setContenedores] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);

  const isAdmin = usuario.rol === 'admin';
  const isLimpieza = usuario.rol === 'limpieza';
  const isUsuario = usuario.rol === 'usuario';

  const centerPUCE = [-0.209918, -78.490692];

  const campusPolygon = [
    [-0.210314, -78.493558],
    [-0.210731, -78.493552],
    [-0.211404, -78.492892],
    [-0.210809, -78.49235],
    [-0.211044, -78.490714],
    [-0.209481, -78.490255],
    [-0.208604, -78.489006],
    [-0.20814, -78.49022],
  ];

  // Función para verificar si un punto está dentro del polígono
  const estaEntroDeCampus = (lat, lng) => {
    const x = lng;
    const y = lat;
    let inside = false;

    for (let i = 0, j = campusPolygon.length - 1; i < campusPolygon.length; j = i++) {
      const xi = campusPolygon[i][1];
      const yi = campusPolygon[i][0];
      const xj = campusPolygon[j][1];
      const yj = campusPolygon[j][0];

      const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  };

  // Cargar contenedores
  const cargarContenedores = async () => {
    try {
      const response = await contenedorService.getContenedores();
      setContenedores(response.data);
    } catch (error) {
      console.error('Error al cargar contenedores:', error);
    }
  };

  // Cargar alertas
  const cargarAlertas = async () => {
    try {
      const response = await alertaService.getAlertas();
      setAlertas(response.data);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    }
  };

  // Crear nueva alerta
  const crearAlerta = async (latlng) => {
    // Validar que la alerta esté dentro del campus
    if (!estaEntroDeCampus(latlng.lat, latlng.lng)) {
      alert('Por favor, marque dentro del área del campus');
      return;
    }

    try {
      const ubicacion = {
        coordinates: [latlng.lng, latlng.lat],
      };
      await alertaService.crearAlerta(usuario.id, ubicacion, 'Alerta creada por usuario');
      alert('Alerta registrada correctamente');
      cargarAlertas();
    } catch (error) {
      console.error('Error al crear alerta:', error);
      alert('Error al registrar alerta');
    }
  };

  // Crear nuevo contenedor
  const crearContenedor = async (latlng) => {
    // Validar que el contenedor esté dentro del campus
    if (!estaEntroDeCampus(latlng.lat, latlng.lng)) {
      alert('Por favor, coloque el contenedor dentro del área del campus');
      return;
    }

    try {
      const ubicacion = {
        coordinates: [latlng.lng, latlng.lat],
      };
      await contenedorService.crearContenedor(
        tipoSeleccionado,
        ubicacion,
        usuario.id,
        `Contenedor ${tipoSeleccionado}`
      );
      alert('Contenedor agregado correctamente');
      setTipoSeleccionado('');
      cargarContenedores();
    } catch (error) {
      console.error('Error al crear contenedor:', error);
      alert('Error al crear contenedor');
    }
  };

  // Actualizar estado de alerta
  const actualizarEstadoAlerta = async (id, nuevoEstado) => {
    try {
      await alertaService.updateAlerta(id, nuevoEstado, '');
      cargarAlertas();
    } catch (error) {
      console.error('Error al actualizar alerta:', error);
      alert('Error al actualizar alerta');
    }
  };

  // Eliminar alerta
  const eliminarAlerta = async (id) => {
    try {
      const confirmado = window.confirm(
        '¿Está seguro de que desea eliminar esta alerta?'
      );
      if (confirmado) {
        await alertaService.deleteAlerta(id);
        cargarAlertas();
      }
    } catch (error) {
      console.error('Error al eliminar alerta:', error);
      alert('Error al eliminar alerta');
    }
  };

  // Eliminar contenedor
  const eliminarContenedor = async (id) => {
    try {
      const confirmado = window.confirm(
        '¿Está seguro de que desea eliminar este contenedor?'
      );
      if (confirmado) {
        await contenedorService.deleteContenedor(id);
        alert('Contenedor eliminado correctamente');
        cargarContenedores();
      }
    } catch (error) {
      console.error('Error al eliminar contenedor:', error);
      alert('Error al eliminar contenedor');
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await Promise.all([cargarContenedores(), cargarAlertas()]);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 200);
    }
  }, []);

  if (loading) {
    return <div className="mapa-loading">Cargando mapa...</div>;
  }

  return (
    <div className="mapa-wrapper">
      {isAdmin && (
        <div className="admin-controls">
          <h3>Panel de Control - Admin</h3>
          <div className="tipo-selector">
            <label>Selecciona tipo de contenedor:</label>
            <select
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
            >
              <option value="">-- Selecciona un tipo --</option>
              <option value="negro">Negro (Común)</option>
              <option value="verde">Verde (Punto de Reciclaje)</option>
              <option value="azul">Azul (Plástico)</option>
              <option value="rosa">Rosa (No Orgánico)</option>
              <option value="amarillo">Amarillo (Cartón)</option>
            </select>
            <p className="info-text">
              {tipoSeleccionado
                ? 'Haz click en el mapa para agregar un contenedor'
                : 'Selecciona un tipo primero'}
            </p>
          </div>
        </div>
      )}

      <MapContainer
        ref={mapRef}
        center={centerPUCE}
        zoom={18}
        minZoom={17}
        maxZoom={18}
        dragging={true}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        maxBounds={campusPolygon}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Manejadores de clicks */}
        {isUsuario && <ClickAlerta enabled={true} onConfirm={crearAlerta} />}
        {isAdmin && (
          <ClickContenedor
            enabled={tipoSeleccionado !== ''}
            tipo={tipoSeleccionado}
            onAdd={crearContenedor}
          />
        )}

        {/* Límite del campus */}
        <Polygon
          positions={campusPolygon}
          pathOptions={{
            color: 'red',
            weight: 2,
            fillOpacity: 0.05,
          }}
        />

        {/* Contenedores */}
        {contenedores.map((c) => (
          <Marker
            key={c._id}
            position={[c.ubicacion.coordinates[1], c.ubicacion.coordinates[0]]}
            icon={iconos[c.tipo]}
          >
            <Popup>
              <strong>Contenedor {c.tipo}</strong>
              <br />
              {c.descripcion}
              {isAdmin && (
                <>
                  <br />
                  <button
                    onClick={() => eliminarContenedor(c._id)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </Popup>
          </Marker>
        ))}

        {/* Alertas */}
        {alertas.map((a) => (
          <Marker
            key={a._id}
            position={[a.ubicacion.coordinates[1], a.ubicacion.coordinates[0]]}
            icon={alertaIcon}
          >
            <Popup className="alerta-popup">
              <strong>Alerta de Limpieza</strong>
              <br />
              <strong>Estado:</strong> {a.estado}
              <br />
              <strong>Descripción:</strong> {a.descripcion}
              <br />
              {isLimpieza && (
                <>
                  <button
                    onClick={() => actualizarEstadoAlerta(a._id, 'En proceso')}
                    className="btn-estado"
                  >
                    En proceso
                  </button>
                  <button
                    onClick={() => actualizarEstadoAlerta(a._id, 'Completado')}
                    className="btn-estado"
                  >
                    Completado
                  </button>
                  <button
                    onClick={() => eliminarAlerta(a._id)}
                    className="btn-eliminar"
                  >
                    ❌ Eliminar
                  </button>
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Mapa;
