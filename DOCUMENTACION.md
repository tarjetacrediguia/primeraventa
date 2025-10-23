## Documentación del Backend v1

### Introducción
Este proyecto implementa una API REST para la gestión integral del flujo de crédito/compra en comercios, con autenticación basada en sesiones JWT, autorización por roles y una arquitectura por capas con puertos y adaptadores. Expone endpoints para autenticación, administración de usuarios (administradores, analistas, comerciantes), gestión de solicitudes (iniciales y formales), compras, contratos, tasas, configuración, estadísticas y consulta de historial.

La API corre bajo el prefijo base: `/API/v1`.


### Tecnologías clave
- Node.js + TypeScript
- Express
- JWT (sesiones persistidas en BD)
- CORS, Helmet, Morgan
- Arquitectura hexagonal (Ports & Adapters) para casos de uso y persistencia


### Arquitectura y organización
El proyecto sigue una estructura en capas clara:

- `src/index.ts`: punto de entrada. Crea el servidor HTTP con `createHTTPServer(router)` y monta el router raíz.
- `src/infrastructure/server`: servidor Express y middlewares globales
  - `http.server.ts`: inicializa Express, aplica middlewares, monta `/API/v1`, agrega `errorHandler`.
  - `middlewares.ts`: CORS, Helmet, body parsers y logging (Morgan).
  - `error-handler.ts`: manejador global de errores.
- `src/infrastructure/routes`: definición de rutas y middlewares específicos de rutas
  - `routes.ts`: router central. Monta subrutas y aplica `authMiddleware` a las privadas.
  - `middlewares/auth.middleware.ts`: autenticación y carga de `req.user` desde sesión en BD.
  - `middlewares/rolesMiddleware.ts`: autorización basada en roles.
  - `controllers/*`: controladores para cada módulo (consumen casos de uso).
- `src/application`: casos de uso y puertos
  - `use-cases/*`: reglas de negocio, orquestación y coordinación con repositorios/adaptadores.
  - `ports/*`: contratos (interfaces) que definen qué necesitan los casos de uso.
  - `constants/*`: constantes compartidas (por ejemplo acciones de historial).
- `src/domain`: entidades, value objects y excepciones del dominio.
- `src/infrastructure/adapters`: adaptadores a servicios externos y repositorios (DB, IA, NOSIS, VERAZ, notificaciones, PDF, etc.).
- `src/scripts`: utilidades y scripts (por ejemplo generación de tokens, evaluación de cliente, fixtures de entidades).


### Flujo de arranque
1. `src/index.ts` carga variables de entorno y `appConfig`.
2. Crea el servidor con `createHTTPServer(router)`.
3. Inicia escucha en `appConfig.port` (por defecto 3001) y muestra datos de entorno.
4. Se importan crons al arrancar (por ejemplo, `ExpirarSolicitudesCron`).


### Configuración y variables de entorno
Archivo de app config: `src/infrastructure/config/app.config.ts` (exporta `appConfig`). Variables relevantes:
- `NODE_ENV`: `development` | `production`. En producción se valida `JWT_SECRET`.
- `PORT`: puerto HTTP (default 3001).
- `HTTPS_PORT`: puerto HTTPS (si aplica, default 443).
- `JWT_SECRET`: secreto de firma/validación JWT.
- `SYSTEM_TOKEN`: token del sistema para integraciones internas.

Agregar un archivo `.env` en la raíz del proyecto (no se commitea). Ejemplo mínimo:
```
NODE_ENV=development
PORT=3001
JWT_SECRET=supersecreto
SYSTEM_TOKEN=dev_system_token
```


### Servidor HTTP y middlewares
- Redirección a HTTPS en producción si `req.secure` es falso.
- Middlewares globales (`middlewares.ts`):
  - CORS abierto con `credentials` y cabeceras expuestas.
  - Helmet (cabeceras de seguridad).
  - Body parsers con límite de 10MB.
  - Morgan (dev/combined) según entorno.
- Manejador global de errores (`error-handler.ts`):
  - 401 para errores de autenticación (`Token`/`autorización` en el mensaje).
  - 500 para errores generales; en dev incluye `err.message`.


### Autenticación y autorización
- `authMiddleware` protege todas las rutas excepto las públicas:
  - Públicas: `/API/v1/auth/login`, `/API/v1/auth/forgot-password`, `/API/v1/auth/reset-password`, `/API/v1/sistema/health`.
  - Expectativa de header `Authorization: Bearer <token>`.
  - Verifica la sesión en BD (`sesiones` activa y no expirada, unida a `usuarios` para rol).
  - En éxito setea `req.user = { id, rol }`.

- Middlewares de rol (`rolesMiddleware.ts`):
  - `esAdministrador`
  - `esAnalista`
  - `esComerciante`
  - `esComercianteOAnalista`
  - `esAnalistaOAdministrador`
  - `esComercianteOAdministrador`
  - `esComercianteOAnalistaOAdministrador`


### Rutas y endpoints
Prefijo base: `/API/v1`. A continuación, los módulos montados desde `routes.ts`:

#### Auth (`/auth`) [público]
- `POST /auth/login`: login.
- `POST /auth/logout`: logout.
- `POST /auth/reset-password`: restablecer password mediante token y nueva contraseña.

#### Sistema (`/sistema`) [público]
- Se espera un health-check, p.ej. `GET /sistema/health` (referenciado por el auth middleware).

#### Administradores (`/administradores`) [admin]
- `POST /` crear administrador.
- `PUT /:id` actualizar.
- `DELETE /:id` eliminar.
- `GET /:id` obtener por id.
- `GET /` listar.

#### Analistas (`/analistas`) [analista o admin]
- `POST /` crear analista.
- `PUT /:id` actualizar.
- `DELETE /:id` eliminar.
- `GET /:id` obtener por id.
- `GET /` listar.

#### Comerciantes (`/comerciantes`)
- `POST /` [admin] crear comerciante.
- `PUT /:id` [admin] actualizar.
- `DELETE /:id` [admin] eliminar.
- `GET /:id` [comerciante o admin] obtener por id.
- `GET /` [admin] listar.

#### Permisos (`/permisos`) [admin]
- `POST /` crear permiso.
- `GET /` listar permisos.
- `PUT /rol/:rol` asignar permisos a rol.
- `PUT /asignar-permisos/:id` asignar permisos a usuario.
- `GET /usuario/:id` obtener permisos de usuario.
- `GET /verificar-permiso/:id` verificar permiso específico para un usuario.

#### Solicitudes (`/solicitudes`)
Solicitudes Iniciales:
- `POST /solicitudes-iniciales` [comerciante o analista] crear.
- `GET /solicitudes-iniciales` [analista o admin] listar.
- `GET /solicitudes-iniciales-comerciante` [comerciante] listar por comerciante.
- `PUT /solicitudes-iniciales/:id/aprobar` [analista o admin] aprobar.
- `PUT /solicitudes-iniciales/:id/rechazar` [analista o admin] rechazar.

Verificación crediticia:
- `POST /verificacion-crediticia` [comerciante] ejecutar verificación (NOSIS/VERAZ).

Solicitudes Formales:
- `POST /solicitudes-formales` [comerciante] crear.
- `PUT /solicitudes-formales/:id/aprobar` [comerciante o analista] aprobar.
- `PUT /solicitudes-formales/:id/rechazar` [comerciante o analista] rechazar.
- `GET /solicitudes-formales` [comerciante o analista] listar.
- `PUT /solicitudes-formales/:id` [comerciante o analista] actualizar.
- `GET /solicitudes-formales/:id/detalle` [comerciante o analista] detalle.
- `GET /solicitudes-formales-comerciante-estado` [comerciante o analista] listar por comerciante y estado.
- `POST /solicitudes-formales/crearYAprobarSolicitudFormal` [comerciante] crear y aprobar en un paso.
- `GET /solicitudes-formales-comerciante` [comerciante o analista] listar por comerciante.
- `GET /solicitud-formal-comerciante/:idSolicitudInicial` [comerciante o analista] obtener formal por solicitud inicial.
- `GET /solicitud-formal-analista/:idSolicitudInicial` [analista o admin] idem para analista.
- `GET /solicitudes-formales/:id/archivos/:archivoId` [comerciante o analista] descargar archivo adjunto.

#### Contratos (`/contratos`)
- `POST /compra/:id/contrato-descarga` [comerciante o analista] generar y descargar contrato PDF de una compra.

#### Compras (`/compra`)
- `POST /` [comerciante] crear compra.
- `GET /` [analista] listar todas las compras.
- `GET /obtenerComprasPorComerciante` [comerciante] listar sus compras.
- `GET /estado/:estado` [protegido] listar por estado.
- `GET /:id` [comerciante o analista] detalle de compra.
- `POST /:id/aprobar` [analista] aprobar compra.
- `POST /:id/rechazar` [analista] rechazar compra.
- `PUT /:id` [comerciante o analista] actualizar compra.
- `GET /compraporcomerciante-solicitudformal/:idSolicitudFormal` [comerciante o analista] obtener por solicitud formal.
- `GET /compraporanalista-solicitudformal/:idSolicitudFormal` [analista o admin] obtener por solicitud formal (vista analista).

#### Tasas (`/tasas`)
Conjuntos de tasas [admin]:
- `POST /conjuntos` crear conjunto de tasas.
- `PUT /conjuntos/:id` actualizar.
- `DELETE /conjuntos/:id` eliminar.
- `GET /conjuntos` listar.
- `GET /conjuntos/:id` obtener detalle.

Tasas individuales:
- `POST /conjuntos/:conjuntoId/tasas` [admin] agregar tasa a conjunto.
- `GET /activa/:codigo` [comerciante, analista o admin] obtener tasa activa por código.

#### Configuración (`/configuracion`) [admin]
- `GET /` obtener configuración.
- `PUT /` actualizar configuración.
- `POST /` crear configuración.

#### Estadísticas (`/estadisticas`) [admin]
- `GET /solicitudes-iniciales`
- `GET /solicitudes-formales`
- `GET /tiempos-aprobacion`
- `GET /tasa-conversion`
- `GET /comerciantes`
- `GET /analistas`

#### Historial (`/historial`) [admin]
- `GET /solicitud-inicial/:solicitudInicialId` obtener historial de la solicitud inicial.


### Casos de uso (application/use-cases)
Los casos de uso encapsulan la lógica de negocio y orquestan llamadas a puertos/adaptadores:
- `SolicitudInicial`: crear, aprobar/rechazar, verificar aprobación, consultar estado, listar por comerciante/estado/fecha, etc.
- `SolicitudFormal`: crear, crear y aprobar, aprobar/rechazar, actualizar, obtener por solicitud inicial, listar/filtrar, consultar estado.
- `Compra`: crear, aprobar/rechazar, actualizar, obtener detalle, listar por comerciante/estado, obtener por solicitud formal.
- `Contrato`: generar y descargar contrato PDF a partir de una compra.
- `Tasas`: gestión de conjuntos y tasas activas.
- `Historial`: registrar y obtener historial de acciones.
- `Estadísticas`: métricas operativas y de conversión.
- `Configuraciones`, `Permisos`, `Notificación`, `Nosis`, `Veraz`, `IA`, `Simulación`, `Sistema`, `tareas`.


### Puertos (application/ports) y Adaptadores (infrastructure/adapters)
Los puertos definen interfaces para repositorios y servicios externos:
- Repositorios: `AdministradorRepositoryPort`, `AnalistaRepositoryPort`, `ClienteRepositoryPort`, `ComercianteRepositoryPort`, `CompraRepositoryPort`, `ConfiguracionRepositoryPort`, `ContratoRepositoryPort`, `EstadisticasRepositoryPort`, `HistorialRepositoryPort`, `PermisoRepositoryPort`, `ReferenteRepositoryPort`, `SolicitudInicialRepositoryPort`, `SolicitudFormalRepositoryPort`, `TasasRepositoryPort`, `UsuarioRepositoryPort`.
- Servicios externos: `AuthPort`, `NosisPort`, `VerazPort`, `NotificationPort`, `PdfPort`, `SimulacionPort`, `IAPort`.

Los adaptadores en `src/infrastructure/adapters/*` implementan esos puertos, conectando con BD y servicios externos (NOSIS/VERAZ, notificaciones, PDFs, IA, cron jobs, etc.).


### Dominio (domain)
Entidades: `Administrador`, `Analista`, `Cliente`, `Comerciante`, `Compra`, `ItemCompra`, `SolicitudInicial`, `SolicitudFormal`, `Contrato`, `Configuracion`, `ConjuntoTasas`, `Tasa` (implícita dentro de conjuntos), `Historial`, `Notificacion`, `Permiso`, `Referente`, `Sistema`, `NosisData`, `Usuario`, `ArchivosAdjuntos`.

Las entidades modelan el núcleo del negocio y son utilizadas por los casos de uso.


### Historial de acciones
- Acciones estandarizadas en `application/constants/historialActions.ts`.
- Casos de uso registran eventos de negocio (creación, aprobación, rechazo, adjuntos, etc.).


### Plantillas y documentos
- `src/infrastructure/templates/` contiene plantillas HTML/PDF para emails o generación de contratos (según implementación en adaptadores y casos de uso).


### Cron jobs
- `infrastructure/adapters/cron/ExpirarSolicitudesCron`: tareas programadas que se cargan al iniciar para expirar solicitudes u otras labores de mantenimiento.


### Seguridad
- CORS con control de headers; `credentials: true` si el frontend envía cookies/autorización.
- Helmet para cabeceras seguras.
- Redirección a HTTPS en producción si la petición no es segura.
- Tokens almacenados en tabla `sesiones` con expiración; se valida contra `usuarios` para el rol.


### Errores y respuestas
- Errores de autenticación: 401 con `{ error: '...' }`.
- Errores de autorización (roles): 403 con `{ error: '...' }`.
- Errores genéricos: 500 con `{ error: 'Error interno del servidor' }` (en dev puede incluir `message`).


### Instalación y ejecución
Requisitos: Node.js 18+.

1) Instalar dependencias:
```
npm install
```

2) Configurar variables de entorno (`.env`).

3) Desarrollo (TypeScript con ts-node/ts-node-dev según configuración de `package.json`):
```
npm run dev
```

4) Compilación a JavaScript:
```
npm run build
```

5) Ejecutar compilado:
```
npm start
```


### Buenas prácticas para contribuir
- Mantener la separación de responsabilidades: controladores delgados, lógica en casos de uso.
- Añadir nuevas integraciones a través de puertos/adaptadores.
- Respetar middlewares de autenticación y roles en nuevas rutas.
- Documentar endpoints y parámetros en este archivo cuando se agreguen nuevas rutas.
- Agregar pruebas y validaciones de entrada (DTOs/validators) donde corresponda.


### Referencias rápidas
- Base URL: `http://<host>:<port>/API/v1`.
- Auth header: `Authorization: Bearer <token>`.
- Salud del sistema: `GET /API/v1/sistema/health` (siempre público).


### Anexos (flujos principales)
- Alta de Solicitud Inicial: Comerciante/Analista crea → verificación crediticia (opcional) → Analista/Admin aprueba/rechaza → Historial registra.
- Conversión a Solicitud Formal: Comerciante crea formal (puede usar crear y aprobar en un paso) → carga de adjuntos → aprobación por Comerciante/Analista → Historial registra.
- Compra: Comerciante crea compra asociada a solicitud formal → Analista aprueba/rechaza → Contrato PDF disponible → Historial registra.
- Tasas: Admin define conjuntos y tasas activas → los cálculos/valores de cuotas en compras se basan en la tasa activa por código.


### Troubleshooting
- 401 Token inválido o sesión expirada: verificar header `Authorization`, existencia de la sesión en BD y expiración.
- 403 Acceso no autorizado: revisar rol de `req.user.rol` y middleware aplicado a la ruta.
- CORS: si el frontend no puede acceder, confirmar `origin`, `credentials` y headers personalizados.
- Tamaño de payload: requests mayores a 10MB serán rechazadas por el body parser.


---
Este documento es una guía viva. Al agregar o modificar módulos/endpoints, actualizar las secciones correspondientes.


