import Alerta from '../models/Alerta.js';
import express from 'express';
const router = express.Router();

// Reporte: cantidad de alertas por estado
router.get('/reporte/alertas-por-estado', async (req, res) => {
  try {
    const resultado = await Alerta.aggregate([
      { $group: { _id: '$estado', total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al generar reporte', error });
  }
});

export default router;
