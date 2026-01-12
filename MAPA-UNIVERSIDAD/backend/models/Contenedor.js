import mongoose from 'mongoose';

const contenedorSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['negro', 'verde', 'azul', 'rosa', 'amarillo'],
    required: [true, 'El tipo es obligatorio'],
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
  createdBy: {
    type: String,
    required: [true, 'El campo createdBy es obligatorio'],
    minlength: [5, 'El createdBy debe tener al menos 5 caracteres'],
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    minlength: [5, 'La descripción debe tener al menos 5 caracteres'],
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
