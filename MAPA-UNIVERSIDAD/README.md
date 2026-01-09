# 🗺️ APLICACIÓN DE MAPEO DE LA UNIVERSIDAD PUCE

Aplicación full-stack para gestionar alertas de limpieza y contenedores en el campus de la Universidad PUCE.

## 📋 Características

### Por Rol de Usuario:

**👤 Usuario (Estudiante/Profesor)**
- Ver mapa interactivo del campus
- Reportar alertas de limpieza haciendo click en el mapa
- Ver contenedores de reciclaje ubicados en el campus

**🧹 Equipo de Limpieza**
- Ver todas las alertas de limpieza reportadas
- Actualizar estado de alertas (Pendiente → En proceso → Completado)
- Eliminar alertas completadas
- Ver ubicación de alertas en el mapa

**🔐 Administrador**
- Gestionar usuarios (crear, editar, eliminar)
- Crear y eliminar contenedores de reciclaje
- Colocar contenedores en el mapa (amarillo, azul, verde)
- Ver todas las alertas y contenedores
- Acceso total a la plataforma

##  Stack Tecnológico

### Backend
- **Node.js** + **Express.js** - Servidor API
- **PostgreSQL** - Base de datos relacional (Usuarios)
- **MongoDB** - Base de datos NoSQL (Alertas y Contenedores)
- **JWT** - Autenticación
- **Sequelize** - ORM para PostgreSQL
- **Mongoose** - ODM para MongoDB

### Frontend
- **React 18** - Librería UI
- **React Leaflet** - Mapas interactivos
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos

##  Instalación y Setup

### Requisitos Previos
- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

### 1. Clonar o descargar el proyecto

```bash
cd MAPA-UNIVERSIDAD
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env con las variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de base de datos
```

**Variables de .env:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mapauniversidad
DB_USER=postgres
DB_PASSWORD=tu_password_aqui

MONGODB_URI=mongodb://localhost:27017/mapauniversidad

JWT_SECRET=tu_secret_aqui_cambia_en_produccion
JWT_EXPIRE=7d

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Crear bases de datos

**PostgreSQL:**
```sql
CREATE DATABASE mapauniversidad;
```

**MongoDB:**
```javascript
// Ejecutar en mongo shell
use mapauniversidad
```

### 4. Cargar datos de prueba

```bash
cd backend
npm run seed
```

Esto creará:
- 3 usuarios de prueba (admin, limpieza, usuario)
- 3 contenedores de prueba
- 1 alerta de prueba

### 5. Iniciar Backend

```bash
cd backend
npm run dev
```

El servidor estará en: `http://localhost:5000`

### 6. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env (opcional)
# REACT_APP_API_URL=http://localhost:5000/api
```

### 7. Iniciar Frontend

```bash
cd frontend
npm start
```

La aplicación abrirá en: `http://localhost:3000`

##  Cuentas de Prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@puce.edu.ec | admin123 | Admin |
| limpieza@puce.edu.ec | limpieza123 | Limpieza |
| usuario@puce.edu.ec | usuario123 | Usuario |

##  Cómo Usar

### Para Usuarios
1. Login con tu cuenta de usuario
2. En el mapa, haz click en cualquier punto para reportar una alerta de limpieza
3. Confirma tu reporte
4. El equipo de limpieza verá tu alerta

### Para Equipo de Limpieza
1. Login con tu cuenta de limpieza
2. Visualiza todas las alertas en el mapa
3. Haz click en una alerta para:
   - Marcarla como "En proceso"
   - Marcarla como "Completado"
   - Eliminarla

### Para Administradores
1. Login con tu cuenta de admin
2. En el Dashboard:
   - Crear nuevos usuarios
   - Eliminar usuarios
3. En el Mapa:
   - Selecciona el tipo de contenedor (Amarillo, Azul, Verde)
   - Haz click en el mapa para colocar el contenedor
4. Ver todas las alertas y contenedores

##  Estructura del Proyecto

```
MAPA-UNIVERSIDAD/
├── backend/
│   ├── config/
│   │   ├── database.js (PostgreSQL)
│   │   └── mongodb.js (MongoDB)
│   ├── models/
│   │   ├── User.js (Sequelize)
│   │   ├── Alerta.js (Mongoose)
│   │   └── Contenedor.js (Mongoose)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── alertaController.js
│   │   └── contenedorController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── alertaRoutes.js
│   │   └── contenedorRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.css
│   │   │   ├── Mapa.jsx
│   │   │   └── Mapa.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
└── README.md
```

##  Seguridad

- **JWT Tokens** para autenticación
- **Bcrypt** para hashear contraseñas
- **CORS** configurado para el dominio del frontend
- **Validación** de roles en todas las rutas protegidas

##  Deployment

### Backend (Heroku/Railway)
1. Crear variables de entorno en la plataforma
2. Conectar base de datos PostgreSQL y MongoDB
3. Deploy

### Frontend (Vercel/Netlify)
1. Configurar REACT_APP_API_URL con el URL del backend
2. Deploy

##  Troubleshooting

**Error de conexión a PostgreSQL:**
- Verificar que PostgreSQL está corriendo
- Verificar credenciales en .env
- Crear la base de datos `mapauniversidad`

**Error de conexión a MongoDB:**
- Verificar que MongoDB está corriendo
- Verificar URI de conexión en .env

**Errores en el frontend:**
- Limpiar cache: `npm cache clean --force`
- Reinstalar node_modules: `rm -rf node_modules && npm install`
- Verificar que el backend está corriendo en puerto 5000

##  API Endpoints

### Auth
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/usuarios` - Listar usuarios (Admin)
- `PUT /api/auth/usuarios/:id` - Actualizar usuario (Admin)
- `DELETE /api/auth/usuarios/:id` - Eliminar usuario (Admin)

### Alertas
- `POST /api/alertas` - Crear alerta
- `GET /api/alertas` - Listar alertas
- `GET /api/alertas/:id` - Obtener alerta
- `PUT /api/alertas/:id` - Actualizar alerta
- `DELETE /api/alertas/:id` - Eliminar alerta

### Contenedores
- `POST /api/contenedores` - Crear contenedor (Admin)
- `GET /api/contenedores` - Listar contenedores
- `PUT /api/contenedores/:id` - Actualizar contenedor (Admin)
- `DELETE /api/contenedores/:id` - Eliminar contenedor (Admin)

## 📞 Soporte

Para problemas o sugerencias, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para la PUCE**
