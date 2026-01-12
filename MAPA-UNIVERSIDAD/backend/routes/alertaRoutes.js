import express from 'express';
import {
  crearAlerta,
  getAlertas,
  getAlertaById,
  updateAlerta,
  deleteAlerta,
  getAlertasPorUsuario,
} from '../controllers/alertaController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Usuarios pueden crear alertas
router.post('/', authenticate, authorize('usuario', 'admin'), crearAlerta);

// Todos los autenticados pueden ver alertas
router.get('/', authenticate, getAlertas);
router.get('/:id', authenticate, getAlertaById);
router.get('/usuario/:userId', authenticate, getAlertasPorUsuario);

// Limpieza puede actualizar estado
router.put('/:id', authenticate, authorize('limpieza', 'admin'), updateAlerta);

// Limpieza y admin pueden eliminar
router.delete('/:id', authenticate, authorize('limpieza', 'admin'), deleteAlerta);

export default router;
