import mongoose from 'mongoose';

const alertaSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'El userId es obligatorio'],
    minlength: [5, 'El userId debe tener al menos 5 caracteres'],
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
      validate: {
        validator: function(arr) {
          return arr.length === 2 && arr.every(coord => typeof coord === 'number');
        },
        message: 'Las coordenadas deben ser un arreglo de dos números',
      },
    },
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'En proceso', 'Completado'],
    default: 'Pendiente',
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    minlength: [5, 'La descripción debe tener al menos 5 caracteres'],
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
