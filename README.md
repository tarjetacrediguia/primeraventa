# Backend Sistema de Gestión de Créditos - Documentación Completa

## 📋 Tabla de Contenidos
- Introducción
- Instalación y Configuración
- Autenticación
- Gestión de Usuarios
- Solicitudes de Crédito
- Compras y Contratos
- Sistema y Configuración
- Estadísticas
- Tasas y Configuración Financiera

## 🚀 Introducción
Sistema backend para gestión integral de créditos desarrollado en TypeScript con arquitectura hexagonal. Provee APIs RESTful para administración completa del ciclo de vida de créditos.

### Características Principales
- **Arquitectura Hexagonal**: Diseño modular y mantenible
- **Autenticación JWT**: Sistema seguro con múltiples roles
- **Gestión Completa de Créditos**: Desde solicitud hasta contrato
- **Integración con Servicios Externos**: Veraz/Nosis para scoring crediticio
- **Generación de PDFs**: Contratos automáticos
- **Sistema de Notificaciones**: Comunicación en tiempo real

## ⚙️ Instalación y Configuración

### Requisitos Previos
```bash
Node.js 16+
PostgreSQL 12+
npm 6+ o pnpm
Variables de Entorno (.env)
env
# Servidor
PORT=3000
NODE_ENV=development
VERSION=1.0.0

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=creditos_db
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=tu_clave_super_secreta
JWT_EXPIRES_IN=24h

# Servicios Externos
NOSIS_AUTO=true
MODO_TEST=false
API_KEY=tu_api_key_nosis

# Configuraciones del Sistema
EMAIL_SERVICE=true
NOTIFICATIONS_ENABLED=true
Instalación
bash
# Clonar repositorio
git clone [url-repositorio]
cd backend

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Compilar y ejecutar
npm run build
npm start

# Modo desarrollo
npm run dev
🔐 Autenticación
POST /API/v1/auth/login
Inicia sesión en el sistema.

Body:

json
{
  "email": "usuario@empresa.com",
  "password": "contraseñaSegura123"
}
Respuesta Exitosa (200):

json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "usuario@empresa.com",
    "rol": "comerciante"
  }
}
Errores:

400: Campos obligatorios faltantes

401: Credenciales inválidas

POST /API/v1/auth/logout
Cierra la sesión del usuario.

Headers:

text
Authorization: Bearer [token]
Respuesta Exitosa (200):

json
{
  "message": "Sesión cerrada exitosamente"
}
POST /API/v1/auth/reset-password
Restablece la contraseña del usuario.

Body:

json
{
  "token": "token_de_reseteo",
  "newPassword": "nuevaContraseña123"
}
Respuesta Exitosa (200):

json
{
  "message": "Contraseña restablecida exitosamente"
}
👥 Gestión de Usuarios
Administradores
POST /API/v1/administradores
Crea un nuevo administrador (requiere rol administrador).

Headers:

text
Authorization: Bearer [token]
Body:

json
{
  "nombre": "Admin",
  "apellido": "Principal",
  "email": "admin@empresa.com",
  "password": "contraseñaSegura123",
  "telefono": "+5491112345678"
}
Respuesta Exitosa (201):

json
{
  "id": 1,
  "nombre": "Admin",
  "apellido": "Principal",
  "email": "admin@empresa.com",
  "telefono": "+5491112345678",
  "rol": "administrador",
  "fechaCreacion": "2024-01-15T10:30:00.000Z"
}
GET /API/v1/administradores
Lista todos los administradores.

PUT /API/v1/administradores/:id
Actualiza un administrador.

Body:

json
{
  "nombre": "Admin",
  "apellido": "Actualizado",
  "telefono": "+5491112345678"
}
DELETE /API/v1/administradores/:id
Elimina un administrador.

Analistas
POST /API/v1/analistas
Crea un nuevo analista.

Body:

json
{
  "nombre": "Analista",
  "apellido": "Crediticio",
  "email": "analista@empresa.com",
  "password": "contraseñaSegura123",
  "telefono": "+5491112345678"
}
GET /API/v1/analistas
Lista todos los analistas.

PUT /API/v1/analistas/:id
Actualiza un analista.

Comerciantes
POST /API/v1/comerciantes
Crea un nuevo comerciante.

Body:

json
{
  "nombre": "Comerciante",
  "apellido": "Ejemplo",
  "email": "comerciante@empresa.com",
  "password": "contraseñaSegura123",
  "telefono": "+5491112345678",
  "nombreComercio": "Mi Comercio SA",
  "cuil": "20-12345678-9",
  "direccionComercio": "Av. Siempre Viva 123"
}
GET /API/v1/comerciantes/:id
Obtiene un comerciante específico.

PUT /API/v1/comerciantes/:id
Actualiza un comerciante.

📋 Solicitudes de Crédito
Solicitudes Iniciales
POST /API/v1/solicitudes/solicitudes-iniciales
Crea una nueva solicitud inicial.

Headers:

text
Authorization: Bearer [token]
Body:

json
{
  "dniCliente": "35123456",
  "cuilCliente": "20-35123456-9"
}
Respuesta Exitosa (201):

json
{
  "id": 1,
  "dniCliente": "35123456",
  "cuilCliente": "20-35123456-9",
  "comercianteId": 1,
  "estado": "pendiente",
  "fechaSolicitud": "2024-01-15T10:30:00.000Z",
  "nosisData": {
    "score": 650,
    "estado": "APROBADO",
    "deudaTotal": 15000,
    "cantidadCreditos": 2
  },
  "motivoRechazo": null,
  "reglasFallidas": []
}
GET /API/v1/solicitudes/solicitudes-iniciales
Lista solicitudes iniciales (filtrable por estado).

Query Params:

estado: pendiente, aprobada, rechazada (opcional)

PUT /API/v1/solicitudes/solicitudes-iniciales/:id/aprobar
Aprueba una solicitud inicial.

Body:

json
{
  "comentario": "Cliente cumple con los requisitos"
}
PUT /API/v1/solicitudes/solicitudes-iniciales/:id/rechazar
Rechaza una solicitud inicial.

Body:

json
{
  "comentario": "Score crediticio insuficiente"
}
Solicitudes Formales
POST /API/v1/solicitudes/solicitudes-formales
Crea una solicitud formal.

Body:

json
{
  "idSolicitudInicial": 1,
  "cliente": {
    "nombreCompleto": "Juan Carlos",
    "apellido": "Pérez",
    "telefono": "+5491112345678",
    "email": "juan@email.com",
    "recibo": "base64_del_recibo_jpg",
    "aceptaTarjeta": true,
    "fechaNacimiento": "1985-05-15",
    "domicilio": "Av. Libertador 1234",
    "numeroDomicilio": "1234",
    "sexo": "M",
    "codigoPostal": "1425",
    "localidad": "CABA",
    "provincia": "Buenos Aires",
    "barrio": "Palermo"
  },
  "referentes": [
    {
      "nombreCompleto": "María García",
      "apellido": "Gómez",
      "vinculo": "Familiar",
      "telefono": "+5491154321098"
    },
    {
      "nombreCompleto": "Carlos Rodríguez",
      "apellido": "López",
      "vinculo": "Amigo",
      "telefono": "+5491165432109"
    }
  ],
  "importeNeto": 50000,
  "solicitaAmpliacionDeCredito": false,
  "comentarioInicial": "Cliente estable laboralmente",
  "datosEmpleador": {
    "razonSocialEmpleador": "Empresa SA",
    "cuitEmpleador": "30-12345678-9",
    "cargoEmpleador": "Gerente",
    "sectorEmpleador": "Administración",
    "codigoPostalEmpleador": "1425",
    "localidadEmpleador": "CABA",
    "provinciaEmpleador": "Buenos Aires",
    "telefonoEmpleador": "+5491111223344"
  },
  "archivosAdjuntos": [
    {
      "nombre": "documento_identidad.pdf",
      "tipo": "application/pdf",
      "contenido": "base64_del_archivo"
    }
  ]
}
PUT /API/v1/solicitudes/solicitudes-formales/:id/aprobar
Aprueba una solicitud formal.

Body:

json
{
  "comentario": "Documentación completa y veraz"
}
PUT /API/v1/solicitudes/solicitudes-formales/:id/rechazar
Rechaza una solicitud formal.

Body:

json
{
  "comentario": "Falta documentación requerida"
}
GET /API/v1/solicitudes/solicitudes-formales
Lista solicitudes formales.

Query Params:

estado: pendiente, aprobada, rechazada (opcional)

fecha: 2024-01-15 (opcional)

GET /API/v1/solicitudes/solicitud-formal-comerciante/:idSolicitudInicial
Obtiene solicitud formal por ID de solicitud inicial.

💰 Compras y Contratos
Gestión de Compras
POST /API/v1/compra
Crea una nueva compra.

Body:

json
{
  "solicitudFormalId": 1,
  "descripcion": "Compra de electrodomésticos",
  "cantidadCuotas": 12,
  "montoTotal": 120000
}
Respuesta Exitosa (201):

json
{
  "id": 1,
  "solicitudFormalId": 1,
  "descripcion": "Compra de electrodomésticos",
  "cantidadCuotas": 12,
  "montoTotal": 120000,
  "estado": "pendiente",
  "fechaCreacion": "2024-01-15T10:30:00.000Z",
  "comercianteId": 1
}
POST /API/v1/compra/:id/aprobar
Aprueba una compra.

Body:

json
{
  "numeroAutorizacion": "AUTH123456",
  "numeroCuenta": "CUENTA789012"
}
POST /API/v1/compra/:id/rechazar
Rechaza una compra.

Body:

json
{
  "motivo": "Límite de crédito excedido"
}
GET /API/v1/compra
Lista todas las compras (analistas) o compras del comerciante.

GET /API/v1/compra/compraporcomerciante-solicitudformal/:idSolicitudFormal
Obtiene compra por solicitud formal.

Contratos PDF
POST /API/v1/contratos/compra/:id/contrato-descarga
Genera y descarga contrato PDF.

Respuesta: Archivo PDF directamente en la respuesta.

⚙️ Sistema y Configuración
Configuración del Sistema
GET /API/v1/configuracion
Obtiene toda la configuración del sistema.

Respuesta:

json
[
  {
    "clave": "LIMITE_CREDITO_BASE",
    "valor": "50000",
    "descripcion": "Límite de crédito base para nuevos clientes"
  },
  {
    "clave": "DIAS_VENCIMIENTO_SOLICITUD",
    "valor": "30",
    "descripcion": "Días para vencimiento de solicitudes"
  }
]
PUT /API/v1/configuracion
Actualiza configuración.

Body:

json
{
  "clave": "LIMITE_CREDITO_BASE",
  "valor": "75000"
}
POST /API/v1/configuracion
Crea nueva configuración.

Body:

json
{
  "clave": "TASA_INTERES_DEFAULT",
  "valor": "0.15",
  "descripcion": "Tasa de interés por defecto"
}
Permisos
POST /API/v1/permisos
Crea un nuevo permiso.

Body:

json
{
  "nombre": "aprobar_solicitudes_grandes",
  "descripcion": "Permite aprobar solicitudes de más de $100,000"
}
PUT /API/v1/permisos/rol/:rol
Asigna permisos a un rol.

Body:

json
{
  "permisos": ["crear_solicitudes", "ver_reportes", "aprobar_solicitudes"]
}
PUT /API/v1/permisos/asignar-permisos/:id
Asigna permisos a un usuario.

Body:

json
{
  "permisos": ["permiso_especial_1", "permiso_especial_2"]
}
Notificaciones
GET /API/v1/notificaciones
Obtiene notificaciones del usuario.

Respuesta:

json
[
  {
    "id": 1,
    "titulo": "Solicitud Aprobada",
    "mensaje": "Su solicitud #123 ha sido aprobada",
    "leida": false,
    "fechaCreacion": "2024-01-15T10:30:00.000Z",
    "tipo": "aprobacion"
  }
]
PUT /API/v1/notificaciones/:id/leida
Marca notificación como leída.

Sistema
GET /API/v1/sistema/version
Obtiene versión del sistema.

Respuesta:

json
{
  "version": "1.0.0"
}
📊 Estadísticas
GET /API/v1/estadisticas/solicitudes-iniciales
Estadísticas de solicitudes iniciales.

Query Params:

desde: 2024-01-01 (opcional)

hasta: 2024-01-31 (opcional)

Respuesta:

json
{
  "total": 150,
  "aprobadas": 120,
  "rechazadas": 25,
  "pendientes": 5,
  "tasaAprobacion": 0.8,
  "periodo": {
    "desde": "2024-01-01",
    "hasta": "2024-01-31"
  }
}
GET /API/v1/estadisticas/solicitudes-formales
Estadísticas de solicitudes formales.

GET /API/v1/estadisticas/tiempos-aprobacion
Tiempos promedio de aprobación.

GET /API/v1/estadisticas/tasa-conversion
Tasa de conversión entre solicitudes.

GET /API/v1/estadisticas/comerciantes
Estadísticas por comerciante.

GET /API/v1/estadisticas/analistas
Estadísticas por analista.

💵 Tasas y Configuración Financiera
Conjuntos de Tasas
POST /API/v1/tasas/conjuntos
Crea un nuevo conjunto de tasas.

Body:

json
{
  "nombre": "Tasas Promocionales Q1 2024",
  "descripcion": "Tasas especiales para primer trimestre",
  "activo": true,
  "tasas": {
    "TASA_BASE": {
      "valor": 0.12,
      "descripcion": "Tasa base de interés"
    },
    "TASA_MORA": {
      "valor": 0.24,
      "descripcion": "Tasa por mora"
    }
  }
}
PUT /API/v1/tasas/conjuntos/:id
Actualiza conjunto de tasas.

GET /API/v1/tasas/conjuntos
Lista todos los conjuntos de tasas.

POST /API/v1/tasas/conjuntos/:conjuntoId/tasas
Agrega tasa a un conjunto.

Body:

json
{
  "codigo": "TASA_ESPECIAL",
  "valor": 0.08,
  "descripcion": "Tasa especial para clientes premium"
}
🔄 Flujos de Trabajo Comunes
Flujo de Aprobación de Crédito
Solicitud Inicial

bash
POST /API/v1/solicitudes/solicitudes-iniciales
# → Verificación automática con Nosis/Veraz
# → Aprobación/rechazo automático o manual
Solicitud Formal

bash
POST /API/v1/solicitudes/solicitudes-formales
# → Completar información del cliente
# → Subir documentación
Aprobación Formal

bash
PUT /API/v1/solicitudes/solicitudes-formales/1/aprobar
# → Análisis por analista
# → Aprobación con comentarios
Creación de Compra

bash
POST /API/v1/compra
# → Definir términos de la compra
# → Establecer cuotas y montos
Generación de Contrato

bash
POST /API/v1/contratos/compra/1/contrato-descarga
# → Descarga automática del PDF
🛡️ Manejo de Errores
Estructura de Error Estándar
json
{
  "error": "Descripción del error",
  "code": "CODIGO_ERROR_ESPECIFICO",
  "details": "Información adicional (opcional)"
}
Códigos de Error Comunes
VALIDATION_ERROR: Error en validación de datos

AUTH_ERROR: Problemas de autenticación/autorización

NOT_FOUND: Recurso no encontrado

DATABASE_ERROR: Error en base de datos

EXTERNAL_SERVICE_ERROR: Error en servicio externo

📝 Notas Adicionales
Formatos de Fecha
Todas las fechas deben enviarse en formato ISO 8601:

json
"fechaNacimiento": "1985-05-15"
"fechaSolicitud": "2024-01-15T10:30:00.000Z"
Manejo de Archivos
Imágenes: JPG/PNG, máximo 5MB, enviar en base64

PDFs: Máximo 5MB, enviar en base64

Nombres de archivo: Deben ser descriptivos y únicos

Paginación y Filtros
Los endpoints de listado soportan:

Filtros por fechas (desde, hasta)

Filtros por estado

Ordenamiento por fecha

Seguridad
Todos los endpoints (excepto login) requieren token JWT

Validación de roles por endpoint

Sanitización de inputs automática

Logs de auditoría para acciones sensibles

