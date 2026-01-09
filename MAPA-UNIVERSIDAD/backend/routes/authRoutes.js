import express from 'express';
import { 
  register, 
  login, 
  getUsuarios, 
  updateUsuario, 
  deleteUsuario 
} from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Solo admin puede ver, actualizar y eliminar usuarios
router.get('/usuarios', authenticate, authorize('admin'), getUsuarios);
router.put('/usuarios/:id', authenticate, authorize('admin'), updateUsuario);
router.delete('/usuarios/:id', authenticate, authorize('admin'), deleteUsuario);

export default router;
