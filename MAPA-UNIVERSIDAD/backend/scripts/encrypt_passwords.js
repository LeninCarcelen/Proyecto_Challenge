import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/UserMongo.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tu_basededatos';

async function encriptarPasswords() {
  await mongoose.connect(MONGO_URI);
  const usuarios = await User.find();
  for (const usuario of usuarios) {
    // Si la contraseña ya está encriptada, la longitud será mayor a 20 y tendrá caracteres especiales
    if (usuario.password.length < 20) {
      const salt = await bcryptjs.genSalt(10);
      usuario.password = await bcryptjs.hash(usuario.password, salt);
      await usuario.save();
      console.log(`Contraseña encriptada para: ${usuario.email}`);
    } else {
      console.log(`Ya encriptada: ${usuario.email}`);
    }
  }
  await mongoose.disconnect();
  console.log('Proceso finalizado.');
}

encriptarPasswords();
