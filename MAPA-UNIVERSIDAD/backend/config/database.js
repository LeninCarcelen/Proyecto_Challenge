import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      integratedSecurity: true,
    },
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize;

<Marker
  key={c._id}
  position={[c.ubicacion.coordinates[1], c.ubicacion.coordinates[0]]}
  icon={iconos[c.tipo]}
>
  <Popup>
    <div style={{marginBottom:4}}>
      <strong>Contenedor {c.tipo.charAt(0).toUpperCase() + c.tipo.slice(1)}</strong>
    </div>
    <div style={{fontWeight:400}}>{c.descripcion}</div>
    {/* ...botones y lógica extra... */}
  </Popup>
</Marker>
