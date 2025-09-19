"use strict";
//src/infrastructure/routes/solicitudes.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RUTAS: Solicitudes
 *
 * Este archivo define las rutas para la gestión de solicitudes iniciales y formales,
 * así como la verificación crediticia y operaciones de aprobación/rechazo.
 * Cada ruta está protegida por los middlewares de roles correspondientes.
 */
const express_1 = require("express");
const Solicitudes_controller_1 = require("./controllers/Solicitudes.controller");
const rolesMiddleware_1 = require("./middlewares/rolesMiddleware");
const router = (0, express_1.Router)();
// Rutas para solicitudes iniciales
router.post('/solicitudes-iniciales', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.crearSolicitudInicial);
router.get('/solicitudes-iniciales', rolesMiddleware_1.esAnalistaOAdministrador, Solicitudes_controller_1.listarSolicitudesIniciales);
router.get('/solicitudes-iniciales-comerciante', rolesMiddleware_1.esComerciante, Solicitudes_controller_1.listarSolicitudesInicialesByComerciante);
router.put('/solicitudes-iniciales/:id/aprobar', rolesMiddleware_1.esAnalistaOAdministrador, Solicitudes_controller_1.aprobarSolicitudInicial);
router.put('/solicitudes-iniciales/:id/rechazar', rolesMiddleware_1.esAnalistaOAdministrador, Solicitudes_controller_1.rechazarSolicitudInicial);
// Ruta para verificación crediticia (NOSIS/VERAZ)
router.post('/verificacion-crediticia', rolesMiddleware_1.esComerciante, Solicitudes_controller_1.verificarEstadoCrediticio); //Analizar si este ednpoint debe existir.
// Rutas para solicitudes formales
router.post('/solicitudes-formales', rolesMiddleware_1.esComerciante, Solicitudes_controller_1.crearSolicitudFormal);
router.put('/solicitudes-formales/:id/aprobar', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.aprobarSolicitudFormal);
router.put('/solicitudes-formales/:id/rechazar', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.rechazarSolicitudFormal);
router.get('/solicitudes-formales', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.listarSolicitudesFormales);
router.put('/solicitudes-formales/:id', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.actualizarSolicitudFormal);
router.get('/solicitudes-formales/:id/detalle', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.obtenerDetalleSolicitudFormal);
router.get('/solicitudes-formales-comerciante-estado', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.listarSolicitudesFormalesByComercianteYEstado);
router.post('/solicitudes-formales/crearYAprobarSolicitudFormal', rolesMiddleware_1.esComerciante, Solicitudes_controller_1.crearYAprobarSolicitudFormal);
router.get('/solicitudes-formales-comerciante', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.listarSolicitudesFormalesByComerciante);
router.get('/solicitud-formal-comerciante/:idSolicitudInicial', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.obtenerSolicitudFormalPoridSolicitudInicial);
router.get('/solicitud-formal-analista/:idSolicitudInicial', rolesMiddleware_1.esAnalistaOAdministrador, Solicitudes_controller_1.obtenerSolicitudFormalAnalista);
router.get('/clientes/:id/comerciante', rolesMiddleware_1.esComerciante, Solicitudes_controller_1.obtenerDatosClienteComerciante);
router.get('/solicitudes-formales/:id/archivos/:archivoId', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.descargarArchivoAdjunto);
exports.default = router;
/*
solicitudes iniciales:

[
    {
        "id": 2,
        "fechaCreacion": "2025-09-13T15:21:18.971Z",
        "estado": "aprobada",
        "dniCliente": "18750502",
        "cuilCliente": "20187505020",
        "comercianteId": 8,
        "comentarios": [],
        "clienteId": null,
        "motivoRechazo": null,
        "comercianteNombre": "Roberto García",
        "nombreComercio": "Tienda El Buen Precio"
    }
]

solicitud formal relacionada a la solicitud inicial 2:

{
    "id": 2,
    "solicitudInicialId": 2,
    "comercianteId": 8,
    "nombreCompleto": "EDISON",
    "apellido": "ROJAS VALENZUELA",
    "telefono": "+5401149433865",
    "email": "u.jaramillo@crediguia.com.ar",
    "fechaSolicitud": "2025-09-17T13:46:56.207Z",
    "recibo": {
        "type": "Buffer",
        "data": [
            255,
            216,44,
            255,
            217
        ]
    },
    "estado": "aprobada",
    "aceptaTarjeta": false,
    "fechaNacimiento": "1972-11-18T03:00:00.000Z",
    "domicilio": "ALMIRANTE BROWN 950, NEUQUEN, Neuquen",
    "referentes": [
        {
            "nombreCompleto": "María",
            "apellido": "Gomez",
            "vinculo": "Familiar",
            "telefono": "13456789"
        },
        {
            "nombreCompleto": "Hector",
            "apellido": "Gomez",
            "vinculo": "Familiar",
            "telefono": "+5491134525870"
        }
    ],
    "comentarios": [
        "Solicitud creada por comerciante",
        "Aprobación: Solicitud creada por comerciante"
    ],
    "clienteId": 2,
    "fechaAprobacion": "2025-09-17T13:46:56.558Z",
    "analistaAprobadorId": null,
    "administradorAprobadorId": null,
    "comercianteAprobadorId": 8,
    "importeNeto": "2000000.00",
    "limiteBase": 1000000,
    "limiteCompleto": 2800000,
    "ponderador": "1.40",
    "solicitaAmpliacionDeCredito": false,
    "nuevoLimiteCompletoSolicitado": null,
    "razonSocialEmpleador": "COOPERATIVA DE SERVICIOS DE ADMINISTRACION DE VENTAS A CREDITO GUIA LTDA",
    "cuitEmpleador": "",
    "cargoEmpleador": "Jefe del sector",
    "sectorEmpleador": "Informatica",
    "codigoPostalEmpleador": "8300",
    "localidadEmpleador": "NEUQUEN",
    "provinciaEmpleador": "Neuquen",
    "telefonoEmpleador": "2994428531",
    "sexo": "M",
    "codigoPostal": "8300",
    "localidad": "NEUQUEN",
    "provincia": "Neuquen",
    "numeroDomicilio": "172",
    "barrio": "Barrio 1",
    "archivosAdjuntos": [
        {
            "id": 4,
            "nombre": "instructivo-libre-de-deuda.pdf",
            "tipo": "application/pdf",
            "fechaCreacion": "2025-09-17T13:46:56.210Z"
        }
    ]
}

compra relacionada a la solicitud formal 2:

{
    "id": 2,
    "solicitudFormalId": 2,
    "descripcion": "una compra",
    "cantidadCuotas": 5,
    "montoTotal": "50000.00",
    "fechaCreacion": "2025-09-17T16:07:00.951Z",
    "fechaActualizacion": "2025-09-17T16:30:36.603Z",
    "estado": "rechazada",
    "valorCuota": "10000.00",
    "clienteId": 2,
    "numeroAutorizacion": null,
    "numeroCuenta": null,
    "comercianteId": 8,
    "analistaAprobadorId": 3,
    "motivoRechazo": "es muy moroso",
    "cliente_nombre": "EDISON ROJAS VALENZUELA",
    "nombre_comercio": "Tienda El Buen Precio",
    "comerciante_id": 8,
    "cliente_cuil": "20187505020"
}

*/
/*
[
    {
        "id": 2,
        "solicitudFormalId": 2,
        "descripcion": "una compra",
        "cantidadCuotas": 5,
        "montoTotal": "50000.00",
        "fechaCreacion": "2025-09-17T16:07:00.951Z",
        "fechaActualizacion": "2025-09-17T16:30:36.603Z",
        "estado": "rechazada",
        "valorCuota": "10000.00",
        "clienteId": 2,
        "numeroAutorizacion": null,
        "numeroCuenta": null,
        "comercianteId": 8,
        "analistaAprobadorId": 3,
        "motivoRechazo": "es muy moroso",
        "cliente_nombre": "EDISON ROJAS VALENZUELA",
        "nombre_comercio": "Tienda El Buen Precio",
        "comerciante_id": 8,
        "cliente_cuil": "20187505020"
    }
]

*/ 
