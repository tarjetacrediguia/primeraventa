# Backend Sistema de Gestión de Créditos

Este proyecto es un backend desarrollado en TypeScript utilizando una arquitectura hexagonal (también conocida como puertos y adaptadores) para un sistema de gestión de créditos.

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o pnpm
- PostgreSQL
- MongoDB (opcional, dependiendo de la configuración)

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd backend
```

2. Instalar dependencias:
```bash
npm install
# o
pnpm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_base_datos
DB_USER=usuario
DB_PASSWORD=contraseña

# Configuración de JWT
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=24h

# Configuración de servicios externos
VERAZ_API_KEY=tu_api_key_veraz
IA_API_KEY=tu_api_key_ia
```

4. Compilar el proyecto:
```bash
npm run build
# o
pnpm build
```

5. Iniciar el servidor:
```bash
npm start
# o
pnpm start
```

Para desarrollo:
```bash
npm run dev
# o
pnpm dev
```

## Estructura del Proyecto

```
src/
├── application/         # Casos de uso y lógica de negocio
├── domain/             # Entidades y reglas de negocio
├── infrastructure/     # Adaptadores y configuración
│   ├── adapters/      # Implementaciones concretas
│   ├── config/        # Configuraciones
│   ├── routes/        # Rutas y controladores
│   └── server/        # Configuración del servidor
└── scripts/           # Scripts utilitarios
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `POST /api/auth/reset-password` - Restablecer contraseña

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Administradores
- `GET /api/administradores` - Listar administradores
- `GET /api/administradores/:id` - Obtener administrador por ID
- `POST /api/administradores` - Crear administrador
- `PUT /api/administradores/:id` - Actualizar administrador
- `DELETE /api/administradores/:id` - Eliminar administrador

### Analistas
- `GET /api/analistas` - Listar analistas
- `GET /api/analistas/:id` - Obtener analista por ID
- `POST /api/analistas` - Crear analista
- `PUT /api/analistas/:id` - Actualizar analista
- `DELETE /api/analistas/:id` - Eliminar analista

### Comerciantes
- `GET /api/comerciantes` - Listar comerciantes
- `GET /api/comerciantes/:id` - Obtener comerciante por ID
- `POST /api/comerciantes` - Crear comerciante
- `PUT /api/comerciantes/:id` - Actualizar comerciante
- `DELETE /api/comerciantes/:id` - Eliminar comerciante

### Solicitudes
#### Solicitudes Iniciales
- `GET /api/solicitudes-iniciales` - Listar solicitudes iniciales
- `GET /api/solicitudes-iniciales/:id` - Obtener solicitud inicial por ID
- `POST /api/solicitudes-iniciales` - Crear solicitud inicial
- `PUT /api/solicitudes-iniciales/:id` - Actualizar solicitud inicial
- `GET /api/solicitudes-iniciales/estado/:estado` - Filtrar por estado
- `GET /api/solicitudes-iniciales/fecha/:fecha` - Filtrar por fecha

#### Solicitudes Formales
- `GET /api/solicitudes-formales` - Listar solicitudes formales
- `GET /api/solicitudes-formales/:id` - Obtener solicitud formal por ID
- `POST /api/solicitudes-formales` - Crear solicitud formal
- `PUT /api/solicitudes-formales/:id` - Actualizar solicitud formal
- `POST /api/solicitudes-formales/:id/aprobar` - Aprobar solicitud formal
- `GET /api/solicitudes-formales/estado/:estado` - Filtrar por estado
- `GET /api/solicitudes-formales/fecha/:fecha` - Filtrar por fecha

### Contratos
- `GET /api/contratos/:id` - Obtener contrato por ID
- `POST /api/contratos/generar` - Generar contrato
- `GET /api/contratos/:id/descargar` - Descargar contrato

### Permisos
- `GET /api/permisos` - Listar permisos
- `POST /api/permisos` - Crear permiso
- `POST /api/permisos/asignar` - Asignar permiso

### Configuraciones
- `GET /api/configuraciones` - Obtener configuraciones
- `PUT /api/configuraciones` - Actualizar configuraciones

### Estadísticas
- `GET /api/estadisticas` - Obtener estadísticas del sistema

## Scripts Disponibles

- `npm run build` - Compilar el proyecto
- `npm start` - Iniciar el servidor en modo producción
- `npm run dev` - Iniciar el servidor en modo desarrollo
- `npm test` - Ejecutar pruebas
- `npm run test:unit` - Ejecutar pruebas unitarias
- `npm run test:integration` - Ejecutar pruebas de integración
- `npm run test:e2e` - Ejecutar pruebas end-to-end

## Tecnologías Utilizadas

- TypeScript
- Express.js
- PostgreSQL
- JWT para autenticación
- Jest para pruebas
- Arquitectura Hexagonal
- Docker (opcional)

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.