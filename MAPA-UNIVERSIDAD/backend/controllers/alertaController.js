import Alerta from '../models/Alerta.js';
import Auditoria from '../models/Auditoria.js';

export const crearAlerta = async (req, res) => {
  try {
    const { userId, ubicacion, descripcion } = req.body;

    if (!userId || !ubicacion || !ubicacion.coordinates) {
      return res.status(400).json({ 
        mensaje: 'userId y ubicacion son requeridos' 
      });
    }

    const nuevaAlerta = new Alerta({
      userId,
      ubicacion: {
        type: 'Point',
        coordinates: ubicacion.coordinates, // [lng, lat]
      },
      descripcion,
    });

    await nuevaAlerta.save();
    // Auditoría: registro de creación de alerta
    await Auditoria.create({
      usuario: userId,
      operacion: 'CREATE',
      entidad: 'Alerta',
      entidadId: nuevaAlerta._id.toString(),
      detalles: { ubicacion, descripcion },
    });
    res.status(201).json({
      mensaje: 'Alerta creada exitosamente',
      alerta: nuevaAlerta,
    });
  } catch (error) {
    console.error('Error al crear alerta:', error);
    res.status(500).json({ mensaje: 'Error al crear alerta' });
  }
};

export const getAlertas = async (req, res) => {
  try {
    const alertas = await Alerta.find();
    res.json(alertas);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ mensaje: 'Error al obtener alertas' });
  }
};

export const getAlertaById = async (req, res) => {
  try {
    const { id } = req.params;
    const alerta = await Alerta.findById(id);

    if (!alerta) {
      return res.status(404).json({ mensaje: 'Alerta no encontrada' });
    }

    res.json(alerta);
  } catch (error) {
    console.error('Error al obtener alerta:', error);
    res.status(500).json({ mensaje: 'Error al obtener alerta' });
  }
};

export const updateAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, descripcion } = req.body;

    const alerta = await Alerta.findByIdAndUpdate(
      id,
      { 
        estado, 
        descripcion,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!alerta) {
      return res.status(404).json({ mensaje: 'Alerta no encontrada' });
    }

    // Auditoría: registro de actualización de alerta
    await Auditoria.create({
      usuario: alerta.userId,
      operacion: 'UPDATE',
      entidad: 'Alerta',
      entidadId: alerta._id.toString(),
      detalles: { estado, descripcion },
    });
    res.json({
      mensaje: 'Alerta actualizada exitosamente',
      alerta,
    });
  } catch (error) {
    console.error('Error al actualizar alerta:', error);
    res.status(500).json({ mensaje: 'Error al actualizar alerta' });
  }
};

export const deleteAlerta = async (req, res) => {
  try {
    const { id } = req.params;

    const alerta = await Alerta.findByIdAndDelete(id);

    if (!alerta) {
      return res.status(404).json({ mensaje: 'Alerta no encontrada' });
    }

    // Auditoría: registro de eliminación de alerta
    await Auditoria.create({
      usuario: alerta.userId,
      operacion: 'DELETE',
      entidad: 'Alerta',
      entidadId: alerta._id.toString(),
      detalles: {},
    });
    res.json({ mensaje: 'Alerta eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar alerta:', error);
    res.status(500).json({ mensaje: 'Error al eliminar alerta' });
  }
};

export const getAlertasPorUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    const alertas = await Alerta.find({ userId });
    res.json(alertas);
  } catch (error) {
    console.error('Error al obtener alertas del usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener alertas' });
  }
};
