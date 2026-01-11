import express from 'express';
import {
  crearContenedor,
  getContenedores,
  getContenedorById,
  updateContenedor,
  deleteContenedor,
} from '../controllers/contenedorController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Solo admin puede crear contenedores
router.post('/', authenticate, authorize('admin'), crearContenedor);

// Todos los autenticados pueden ver contenedores
router.get('/', authenticate, getContenedores);
router.get('/:id', authenticate, getContenedorById);

// Solo admin puede actualizar y eliminar
router.put('/:id', authenticate, authorize('admin'), updateContenedor);
router.delete('/:id', authenticate, authorize('admin'), deleteContenedor);

export default router;
