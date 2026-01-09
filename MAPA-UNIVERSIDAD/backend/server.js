import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectMongoDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';
import alertaRoutes from './routes/alertaRoutes.js';
import contenedorRoutes from './routes/contenedorRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar bases de datos
const inicializarBaseDatos = async () => {
  try {
    // MongoDB
    await connectMongoDB();
    console.log('✅ MongoDB conectado exitosamente');

  } catch (error) {
    console.error('❌ Error al conectar bases de datos:', error.message);
    process.exit(1);
  }
};

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/contenedores', contenedorRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando correctamente' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error interno del servidor',
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;

const iniciar = async () => {
  await inicializarBaseDatos();
  
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

iniciar();

export default app;
