import mongoose from 'mongoose';

const alertaSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  ubicacion: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'En proceso', 'Completado'],
    default: 'Pendiente',
  },
  descripcion: {
    type: String,
    default: 'Alerta de limpieza',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Crear índice geoespacial
alertaSchema.index({ ubicacion: '2dsphere' });

const Alerta = mongoose.model('Alerta', alertaSchema);

export default Alerta;
