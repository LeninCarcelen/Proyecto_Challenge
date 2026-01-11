import mongoose from 'mongoose';

const contenedorSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['negro', 'verde', 'azul', 'rosa', 'amarillo'],
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
  createdBy: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    default: '',
  },
  activo: {
    type: Boolean,
    default: true,
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
contenedorSchema.index({ ubicacion: '2dsphere' });

const Contenedor = mongoose.model('Contenedor', contenedorSchema);

export default Contenedor;
