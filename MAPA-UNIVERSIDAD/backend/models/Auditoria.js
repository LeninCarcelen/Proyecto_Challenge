import mongoose from 'mongoose';

const auditoriaSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  operacion: { type: String, required: true }, // CREATE, UPDATE, DELETE
  entidad: { type: String, required: true }, // Ej: 'User', 'Alerta', etc.
  entidadId: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  detalles: { type: Object },
});

const Auditoria = mongoose.model('Auditoria', auditoriaSchema);

export default Auditoria;
