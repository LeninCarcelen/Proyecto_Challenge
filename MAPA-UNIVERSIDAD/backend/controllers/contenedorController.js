import Contenedor from '../models/Contenedor.js';

export const crearContenedor = async (req, res) => {
  try {
    const { tipo, ubicacion, createdBy, descripcion } = req.body;

    if (!tipo || !ubicacion || !ubicacion.coordinates || !createdBy) {
      return res.status(400).json({ 
        mensaje: 'tipo, ubicacion y createdBy son requeridos' 
      });
    }

    if (!['amarillo', 'azul', 'verde', 'rojo'].includes(tipo)) {
      return res.status(400).json({ 
        mensaje: 'tipo debe ser: amarillo, azul, verde o rojo' 
      });
    }

    const nuevoContenedor = new Contenedor({
      tipo,
      ubicacion: {
        type: 'Point',
        coordinates: ubicacion.coordinates, // [lng, lat]
      },
      createdBy,
      descripcion,
    });

    await nuevoContenedor.save();

    res.status(201).json({
      mensaje: 'Contenedor creado exitosamente',
      contenedor: nuevoContenedor,
    });
  } catch (error) {
    console.error('Error al crear contenedor:', error);
    res.status(500).json({ mensaje: 'Error al crear contenedor' });
  }
};

export const getContenedores = async (req, res) => {
  try {
    const contenedores = await Contenedor.find({ activo: true });
    res.json(contenedores);
  } catch (error) {
    console.error('Error al obtener contenedores:', error);
    res.status(500).json({ mensaje: 'Error al obtener contenedores' });
  }
};

export const getContenedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const contenedor = await Contenedor.findById(id);

    if (!contenedor) {
      return res.status(404).json({ mensaje: 'Contenedor no encontrado' });
    }

    res.json(contenedor);
  } catch (error) {
    console.error('Error al obtener contenedor:', error);
    res.status(500).json({ mensaje: 'Error al obtener contenedor' });
  }
};

export const updateContenedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, descripcion, activo } = req.body;

    const contenedor = await Contenedor.findByIdAndUpdate(
      id,
      { 
        tipo, 
        descripcion,
        activo,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!contenedor) {
      return res.status(404).json({ mensaje: 'Contenedor no encontrado' });
    }

    res.json({
      mensaje: 'Contenedor actualizado exitosamente',
      contenedor,
    });
  } catch (error) {
    console.error('Error al actualizar contenedor:', error);
    res.status(500).json({ mensaje: 'Error al actualizar contenedor' });
  }
};

export const deleteContenedor = async (req, res) => {
  try {
    const { id } = req.params;

    const contenedor = await Contenedor.findByIdAndDelete(id);

    if (!contenedor) {
      return res.status(404).json({ mensaje: 'Contenedor no encontrado' });
    }

    res.json({ mensaje: 'Contenedor eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar contenedor:', error);
    res.status(500).json({ mensaje: 'Error al eliminar contenedor' });
  }
};
