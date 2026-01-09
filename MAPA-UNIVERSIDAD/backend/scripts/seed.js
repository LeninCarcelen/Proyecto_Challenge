import connectMongoDB from '../config/mongodb.js';
import User from '../models/UserMongo.js';
import Alerta from '../models/Alerta.js';
import Contenedor from '../models/Contenedor.js';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  try {
    // Conectar a MongoDB
    await connectMongoDB();
    console.log('✅ MongoDB conectado');

    // Limpiar datos anteriores
    await User.deleteMany({});
    await Alerta.deleteMany({});
    await Contenedor.deleteMany({});
    console.log('🗑️  Datos anteriores eliminados');

    // Crear usuarios de prueba
    const admin = await User.create({
      nombre: 'Admin Usuario',
      email: 'admin@puce.edu.ec',
      password: 'admin123',
      rol: 'admin',
    });

    const usuarioLimpieza = await User.create({
      nombre: 'Juan Limpieza',
      email: 'limpieza@puce.edu.ec',
      password: 'limpieza123',
      rol: 'limpieza',
    });

    const usuarioNormal = await User.create({
      nombre: 'María Usuario',
      email: 'usuario@puce.edu.ec',
      password: 'usuario123',
      rol: 'usuario',
    });

    console.log('👥 Usuarios creados:');
    console.log('   - Admin:', admin.email);
    console.log('   - Limpieza:', usuarioLimpieza.email);
    console.log('   - Usuario:', usuarioNormal.email);

    // Crear contenedores de muestra
    const contenedores = await Contenedor.insertMany([
      {
        tipo: 'negro',
        ubicacion: {
          type: 'Point',
          coordinates: [-78.4938, -0.3597],
        },
        createdBy: admin._id,
        descripcion: 'Contenedor negro - Residuos comunes, Entrada principal',
        activo: true,
      },
      {
        tipo: 'verde',
        ubicacion: {
          type: 'Point',
          coordinates: [-78.4945, -0.3605],
        },
        createdBy: admin._id,
        descripcion: 'Punto de reciclaje verde - Cafetería',
        activo: true,
      },
      {
        tipo: 'azul',
        ubicacion: {
          type: 'Point',
          coordinates: [-78.4925, -0.3590],
        },
        createdBy: admin._id,
        descripcion: 'Contenedor azul - Plástico, Biblioteca',
        activo: true,
      },
      {
        tipo: 'rosa',
        ubicacion: {
          type: 'Point',
          coordinates: [-78.4920, -0.3600],
        },
        createdBy: admin._id,
        descripcion: 'Contenedor rosa - No orgánico',
        activo: true,
      },
      {
        tipo: 'amarillo',
        ubicacion: {
          type: 'Point',
          coordinates: [-78.4930, -0.3580],
        },
        createdBy: admin._id,
        descripcion: 'Contenedor amarillo - Cartón',
        activo: true,
      },
    ]);
    console.log('📦 Contenedores creados:', contenedores.length);

    // Crear alerta de muestra
    const alerta = await Alerta.create({
      userId: usuarioNormal._id,
      ubicacion: {
        type: 'Point',
        coordinates: [-78.4938, -0.3597],
      },
      estado: 'Pendiente',
      descripcion: 'Basura acumulada en entrada principal',
    });
    console.log('🚨 Alerta de muestra creada');

    console.log('\n✅ SEED COMPLETADO CON ÉXITO');
    console.log('\n📋 Datos de prueba cargados:');
    console.log('   - 3 usuarios (admin, limpieza, usuario)');
    console.log('   - 3 contenedores de reciclaje');
    console.log('   - 1 alerta de limpieza pendiente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    process.exit(1);
  }
};

seed();
