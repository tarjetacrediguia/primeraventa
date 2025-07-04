"use strict";
//src/infrastructure/routes/controllers/Solicitudes.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rechazarSolicitudInicial = exports.aprobarSolicitudInicial = exports.listarSolicitudesFormalesByComerciante = exports.listarSolicitudesFormalesByComercianteYEstado = exports.listarSolicitudesInicialesByComercianteYEstado = exports.obtenerDetalleSolicitudFormal = exports.actualizarSolicitudFormal = exports.listarSolicitudesFormales = exports.rechazarSolicitudFormal = exports.aprobarSolicitudFormal = exports.obtenerReciboSolicitudFormal = exports.crearSolicitudFormal = exports.verificarEstadoCrediticio = exports.listarSolicitudesIniciales = exports.crearSolicitudInicial = void 0;
const CrearSolicitudInicialUseCase_1 = require("../../../application/use-cases/SolicitudInicial/CrearSolicitudInicialUseCase");
const GetSolicitudesInicialesByEstadoUseCase_1 = require("../../../application/use-cases/SolicitudInicial/GetSolicitudesInicialesByEstadoUseCase");
const VerificarAprobacionSolicitudInicialUseCase_1 = require("../../../application/use-cases/SolicitudInicial/VerificarAprobacionSolicitudInicialUseCase");
const CrearSolicitudFormalUseCase_1 = require("../../../application/use-cases/SolicitudFormal/CrearSolicitudFormalUseCase");
const AprobarSolicitudesFormalesUseCase_1 = require("../../../application/use-cases/SolicitudFormal/AprobarSolicitudesFormalesUseCase");
const GetSolicitudesFormalesByEstadoUseCase_1 = require("../../../application/use-cases/SolicitudFormal/GetSolicitudesFormalesByEstadoUseCase");
const GetSolicitudesFormalesByFechaUseCase_1 = require("../../../application/use-cases/SolicitudFormal/GetSolicitudesFormalesByFechaUseCase");
const UpdateSolicitudFormalUseCase_1 = require("../../../application/use-cases/SolicitudFormal/UpdateSolicitudFormalUseCase");
const GetSolicitudFormalByIdUseCase_1 = require("../../../application/use-cases/SolicitudFormal/GetSolicitudFormalByIdUseCase");
const VerazAdapter_1 = require("../../adapters/veraz/VerazAdapter");
const NotificationAdapter_1 = require("../../adapters/notification/NotificationAdapter");
const SolicitudInicialRepositoryAdapter_1 = require("../../adapters/repository/SolicitudInicialRepositoryAdapter");
const ContratoRepositoryAdapter_1 = require("../../adapters/repository/ContratoRepositoryAdapter");
const SolicitudFormalRepositoryAdapter_1 = require("../../adapters/repository/SolicitudFormalRepositoryAdapter");
const PermisoRepositoryAdapter_1 = require("../../adapters/repository/PermisoRepositoryAdapter");
const Referente_1 = require("../../../domain/entities/Referente");
const AnalistaRepositoryAdapter_1 = require("../../adapters/repository/AnalistaRepositoryAdapter");
const ClienteRepositoryAdapter_1 = require("../../adapters/repository/ClienteRepositoryAdapter");
const GetSolicitudesInicialesByComercianteYEstadoUseCase_1 = require("../../../application/use-cases/SolicitudInicial/GetSolicitudesInicialesByComercianteYEstadoUseCase");
const GetSolicitudesFormalesByComercianteYEstadoUseCase_1 = require("../../../application/use-cases/SolicitudFormal/GetSolicitudesFormalesByComercianteYEstadoUseCase");
const HistorialRepositoryAdapter_1 = require("../../adapters/repository/HistorialRepositoryAdapter");
const GetSolicitudesFormalesByComercianteIdUseCase_1 = require("../../../application/use-cases/SolicitudFormal/GetSolicitudesFormalesByComercianteIdUseCase");
const AprobarRechazarSolicitudInicialUseCase_1 = require("../../../application/use-cases/SolicitudInicial/AprobarRechazarSolicitudInicialUseCase");
// Inyección de dependencias (deberían venir de un contenedor DI)
const verazService = new VerazAdapter_1.VerazAdapter();
const notificationService = new NotificationAdapter_1.NotificationAdapter();
const solicitudInicialRepo = new SolicitudInicialRepositoryAdapter_1.SolicitudInicialRepositoryAdapter();
const contratoRepo = new ContratoRepositoryAdapter_1.ContratoRepositoryAdapter();
const solicitudFormalRepo = new SolicitudFormalRepositoryAdapter_1.SolicitudFormalRepositoryAdapter();
const permisoRepo = new PermisoRepositoryAdapter_1.PermisoRepositoryAdapter();
const clienteRepository = new ClienteRepositoryAdapter_1.ClienteRepositoryAdapter();
const historialRepository = new HistorialRepositoryAdapter_1.HistorialRepositoryAdapter();
const getSolicitudesInicialesByComercianteYEstado = new GetSolicitudesInicialesByComercianteYEstadoUseCase_1.GetSolicitudesInicialesByComercianteYEstadoUseCase(solicitudInicialRepo);
// Casos de uso inicializados
const crearSolicitudInicialUC = new CrearSolicitudInicialUseCase_1.CrearSolicitudInicialUseCase(solicitudInicialRepo, contratoRepo, solicitudFormalRepo, verazService, notificationService, clienteRepository, historialRepository);
const aprobarRechazarSolicitudInicialUC = new AprobarRechazarSolicitudInicialUseCase_1.AprobarRechazarSolicitudInicialUseCase(solicitudInicialRepo, notificationService, historialRepository);
const getSolicitudesInicialesByEstadoUC = new GetSolicitudesInicialesByEstadoUseCase_1.GetSolicitudesInicialesByEstadoUseCase(solicitudInicialRepo);
const verificarAprobacionUC = new VerificarAprobacionSolicitudInicialUseCase_1.VerificarAprobacionSolicitudInicialUseCase(solicitudInicialRepo, verazService, notificationService);
const crearSolicitudFormalUC = new CrearSolicitudFormalUseCase_1.CrearSolicitudFormalUseCase(solicitudInicialRepo, solicitudFormalRepo, permisoRepo, notificationService, new AnalistaRepositoryAdapter_1.AnalistaRepositoryAdapter(), contratoRepo, clienteRepository, historialRepository);
const aprobarSolicitudesUC = new AprobarSolicitudesFormalesUseCase_1.AprobarSolicitudesFormalesUseCase(solicitudFormalRepo, notificationService, historialRepository);
const getSolicitudesFormalesByEstadoUC = new GetSolicitudesFormalesByEstadoUseCase_1.GetSolicitudesFormalesByEstadoUseCase(solicitudFormalRepo);
const getSolicitudesFormalesByFechaUC = new GetSolicitudesFormalesByFechaUseCase_1.GetSolicitudesFormalesByFechaUseCase(solicitudFormalRepo);
const updateSolicitudFormalUC = new UpdateSolicitudFormalUseCase_1.UpdateSolicitudFormalUseCase(solicitudFormalRepo, historialRepository);
const getSolicitudFormalByIdUC = new GetSolicitudFormalByIdUseCase_1.GetSolicitudesFormalesByIdUseCase(solicitudFormalRepo);
// Controladores
const crearSolicitudInicial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dniCliente, cuilCliente, reciboSueldo } = req.body;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const comercianteId = Number(req.user.id);
        const solicitud = yield crearSolicitudInicialUC.execute(dniCliente, cuilCliente, comercianteId, reciboSueldo ? Buffer.from(reciboSueldo, 'base64') : undefined);
        res.status(201).json(solicitud);
    }
    catch (error) {
        if (error instanceof Error && error.message === 'El cliente ya tiene un crédito activo') {
            res.status(409).json({ error: error.message });
        }
        else if (error instanceof Error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
        else {
            res.status(400).json({ error: 'Unknown error' });
        }
    }
});
exports.crearSolicitudInicial = crearSolicitudInicial;
const listarSolicitudesIniciales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estado = req.query.estado;
        const solicitudes = yield getSolicitudesInicialesByEstadoUC.execute(estado);
        res.status(200).json(solicitudes);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.listarSolicitudesIniciales = listarSolicitudesIniciales;
const verificarEstadoCrediticio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dni, cuil } = req.body;
        const resultado = yield verazService.checkClienteStatus(dni);
        res.status(200).json(resultado);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.verificarEstadoCrediticio = verificarEstadoCrediticio;
const crearSolicitudFormal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idSolicitudInicial, cliente, referentes } = req.body;
        // Validar que el recibo sea proporcionado
        if (!cliente.recibo) {
            return res.status(400).json({ error: 'El recibo es obligatorio' });
        }
        // Convertir base64 a Buffer
        const reciboBuffer = Buffer.from(cliente.recibo, 'base64');
        // Validar que sea una imagen JPG
        const mimeType = yield getImageMimeType(reciboBuffer);
        if (mimeType !== 'image/jpeg') {
            return res.status(400).json({ error: 'El recibo debe ser una imagen JPG' });
        }
        // Validar tamaño máximo (5MB)
        if (reciboBuffer.length > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'El recibo no puede exceder los 5MB' });
        }
        // Reemplazar el string base64 con el Buffer
        cliente.recibo = reciboBuffer;
        // Validar referentes (código existente)
        if (!referentes || !Array.isArray(referentes)) {
            return res.status(400).json({ error: 'Se requiere un array de referentes' });
        }
        if (referentes.length !== 2) {
            return res.status(400).json({ error: 'Se requieren exactamente dos referentes' });
        }
        const referentesInstances = referentes.map(ref => {
            if (!ref.nombreCompleto || !ref.apellido || !ref.vinculo || !ref.telefono) {
                throw new Error('Cada referente debe tener: nombreCompleto, apellido, vinculo y telefono');
            }
            return new Referente_1.Referente(ref.nombreCompleto, ref.apellido, ref.vinculo, ref.telefono);
        });
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const comercianteId = Number(req.user.id);
        const solicitudFormal = yield crearSolicitudFormalUC.execute(idSolicitudInicial, comercianteId, {
            nombreCompleto: cliente.nombreCompleto,
            apellido: cliente.apellido,
            dni: cliente.dni,
            telefono: cliente.telefono,
            email: cliente.email,
            recibo: cliente.recibo, // Ahora es un Buffer
            aceptaTarjeta: cliente.aceptaTarjeta,
            fechaNacimiento: new Date(cliente.fechaNacimiento),
            domicilio: cliente.domicilio,
            datosEmpleador: cliente.datosEmpleador,
            referentes: referentesInstances
        });
        res.status(201).json(solicitudFormal);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Solicitud inicial no encontrada') {
                res.status(404).json({ error: error.message });
            }
            else if (error.message === 'La solicitud inicial no está aprobada' ||
                error.message === 'Ya existe una solicitud formal para esta solicitud inicial') {
                res.status(409).json({ error: error.message });
            }
            else if (error.message.includes('Cada referente debe tener')) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: error.message });
            }
        }
        else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});
exports.crearSolicitudFormal = crearSolicitudFormal;
function getImageMimeType(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar la firma del archivo (magic number)
            if (buffer.length < 3)
                return null;
            // Verificar firma JPG: FF D8 FF
            if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
                return 'image/jpeg';
            }
            // Verificar firma alternativa para JPG
            if (buffer.length > 6 &&
                buffer[0] === 0xFF &&
                buffer[1] === 0xD8 &&
                buffer[2] === 0xFF &&
                buffer[3] === 0xE0 &&
                buffer[6] === 'J'.charCodeAt(0) &&
                buffer[7] === 'F'.charCodeAt(0) &&
                buffer[8] === 'I'.charCodeAt(0) &&
                buffer[9] === 'F'.charCodeAt(0)) {
                return 'image/jpeg';
            }
            return null;
        }
        catch (error) {
            console.error('Error al detectar tipo MIME:', error);
            return null;
        }
    });
}
const obtenerReciboSolicitudFormal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const solicitud = yield getSolicitudFormalByIdUC.execute(Number(id));
        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        const reciboBuffer = solicitud.getRecibo();
        // Establecer encabezados
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `inline; filename="recibo-${id}.jpg"`);
        res.setHeader('Content-Length', reciboBuffer.length);
        // Enviar imagen
        res.end(reciboBuffer);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});
exports.obtenerReciboSolicitudFormal = obtenerReciboSolicitudFormal;
const aprobarSolicitudFormal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { numeroTarjeta, numeroCuenta, generarTarjeta, comentario } = req.body;
        if (!req.user || !req.user.id || !req.user.rol) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const esAdministrador = req.user.rol === 'administrador';
        const aprobadorId = Number(req.user.id);
        const solicitudActualizada = yield aprobarSolicitudesUC.aprobarSolicitud(Number(id), numeroTarjeta, numeroCuenta, aprobadorId, esAdministrador, comentario);
        res.status(200).json(solicitudActualizada);
    }
    catch (error) {
        if (error.message === 'Solicitud formal no encontrada') {
            res.status(404).json({ error: error.message });
        }
        else if (error.message === 'Solo se pueden aprobar solicitudes pendientes') {
            res.status(403).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: error.message });
        }
    }
});
exports.aprobarSolicitudFormal = aprobarSolicitudFormal;
const rechazarSolicitudFormal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { comentario } = req.body;
        if (!req.user || !req.user.id || !req.user.rol) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const esAdministrador = req.user.rol === 'administrador';
        const aprobadorId = Number(req.user.id);
        const solicitudActualizada = yield aprobarSolicitudesUC.rechazarSolicitud(Number(id), comentario, aprobadorId, esAdministrador);
        res.status(200).json(solicitudActualizada);
    }
    catch (error) {
        if (error instanceof Error && error.message === 'Solicitud formal no encontrada') {
            res.status(404).json({ error: error.message });
        }
        else if (error instanceof Error && error.message === 'Solo se pueden rechazar solicitudes pendientes') {
            res.status(403).json({ error: error.message });
        }
        else if (error instanceof Error && error.message.includes('El comentario es obligatorio')) {
            res.status(400).json({ error: error.message });
        }
        else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'Unknown error' });
        }
    }
});
exports.rechazarSolicitudFormal = rechazarSolicitudFormal;
const listarSolicitudesFormales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estado = req.query.estado;
        const fecha = req.query.fecha ? new Date(req.query.fecha) : null;
        // Validar fecha
        if (fecha && isNaN(fecha.getTime())) {
            return res.status(400).json({ error: 'Formato de fecha inválido' });
        }
        let solicitudes = [];
        if (estado && fecha) {
            // Implementar en repositorio: getByEstadoYFecha()
            const porEstado = yield getSolicitudesFormalesByEstadoUC.execute(estado);
            solicitudes = porEstado.filter(s => s.getFechaSolicitud().toISOString().split('T')[0] === fecha.toISOString().split('T')[0]);
        }
        else if (estado) {
            solicitudes = yield getSolicitudesFormalesByEstadoUC.execute(estado);
        }
        else if (fecha) {
            solicitudes = yield getSolicitudesFormalesByFechaUC.execute(fecha);
        }
        else {
            // Si no hay filtros, obtener todas
            solicitudes = yield solicitudFormalRepo.getAllSolicitudesFormales();
        }
        res.status(200).json(solicitudes);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.listarSolicitudesFormales = listarSolicitudesFormales;
const actualizarSolicitudFormal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const id = Number(req.params.id);
        const updates = req.body;
        const userId = parseInt((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '0', 10);
        const userRole = (_c = req.user) === null || _c === void 0 ? void 0 : _c.rol;
        const solicitudExistente = yield getSolicitudFormalByIdUC.execute(id);
        if (!solicitudExistente) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        // Validar y convertir referentes si se proporcionan
        if (updates.referentes) {
            if (!Array.isArray(updates.referentes)) {
                return res.status(400).json({ error: 'Referentes debe ser un array' });
            }
            const referentesInstances = updates.referentes.map((ref) => {
                if (!ref.nombreCompleto || !ref.apellido || !ref.vinculo || !ref.telefono) {
                    throw new Error('Cada referente debe tener: nombreCompleto, apellido, vinculo y telefono');
                }
                return new Referente_1.Referente(ref.nombreCompleto, ref.apellido, ref.vinculo, ref.telefono);
            });
            solicitudExistente.setReferentes(referentesInstances);
        }
        // Actualizar campos del cliente
        if (updates.cliente) {
            const cliente = updates.cliente;
            if (cliente.nombreCompleto !== undefined)
                solicitudExistente.setNombreCompleto(cliente.nombreCompleto);
            if (cliente.apellido !== undefined)
                solicitudExistente.setApellido(cliente.apellido);
            if (cliente.dni !== undefined)
                solicitudExistente.setDni(cliente.dni);
            if (cliente.telefono !== undefined)
                solicitudExistente.setTelefono(cliente.telefono);
            if (cliente.email !== undefined)
                solicitudExistente.setEmail(cliente.email);
            if (cliente.aceptaTarjeta !== undefined)
                solicitudExistente.setAceptaTarjeta(cliente.aceptaTarjeta);
            if (cliente.domicilio !== undefined)
                solicitudExistente.setDomicilio(cliente.domicilio);
            if (cliente.datosEmpleador !== undefined)
                solicitudExistente.setDatosEmpleador(cliente.datosEmpleador);
            // Manejar conversión de fecha
            if (cliente.fechaNacimiento !== undefined) {
                solicitudExistente.setFechaNacimiento(new Date(cliente.fechaNacimiento));
            }
            // Manejar recibo (base64 a Buffer)
            if (cliente.recibo !== undefined) {
                const reciboBuffer = Buffer.from(cliente.recibo, 'base64');
                // Validar que sea JPG
                if (!(reciboBuffer[0] === 0xFF && reciboBuffer[1] === 0xD8 && reciboBuffer[2] === 0xFF)) {
                    return res.status(400).json({ error: 'El recibo debe ser una imagen JPG válida' });
                }
                solicitudExistente.setRecibo(reciboBuffer);
            }
        }
        const solicitudActualizada = yield updateSolicitudFormalUC.execute(solicitudExistente, userId);
        res.status(200).json(solicitudActualizada);
    }
    catch (error) {
        if (error.message === 'Solicitud no encontrada') {
            res.status(404).json({ error: error.message });
        }
        else if (error.message.includes('Cada referente debe tener')) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: error.message });
        }
    }
});
exports.actualizarSolicitudFormal = actualizarSolicitudFormal;
const obtenerDetalleSolicitudFormal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const solicitud = yield getSolicitudFormalByIdUC.execute(id);
        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        res.status(200).json(solicitud);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.obtenerDetalleSolicitudFormal = obtenerDetalleSolicitudFormal;
const listarSolicitudesInicialesByComercianteYEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comercianteId = req.query.id ? parseInt(req.query.id) : undefined;
        const estado = req.query.estado;
        // Validar parámetros
        if (!comercianteId || !estado) {
            return res.status(400).json({ error: 'Se requieren id y estado' });
        }
        // Filtro combinado
        const useCase = getSolicitudesInicialesByComercianteYEstado;
        const solicitudes = yield useCase.execute(comercianteId, estado);
        res.json(solicitudes);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
});
exports.listarSolicitudesInicialesByComercianteYEstado = listarSolicitudesInicialesByComercianteYEstado;
const listarSolicitudesFormalesByComercianteYEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comercianteId = req.query.id ? parseInt(req.query.id) : undefined;
        const estado = req.query.estado;
        // Validar parámetros
        if (!comercianteId || !estado) {
            return res.status(400).json({ error: 'Se requieren id y estado' });
        }
        // Filtro combinado
        const useCase = new GetSolicitudesFormalesByComercianteYEstadoUseCase_1.GetSolicitudesFormalesByComercianteYEstadoUseCase(solicitudFormalRepo);
        const solicitudes = yield useCase.execute(comercianteId, estado);
        res.json(solicitudes);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
});
exports.listarSolicitudesFormalesByComercianteYEstado = listarSolicitudesFormalesByComercianteYEstado;
const listarSolicitudesFormalesByComerciante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comercianteId = req.params.id;
        // Validar parámetros
        if (!comercianteId) {
            return res.status(400).json({ error: 'Se requieren id' });
        }
        // Filtro combinado
        const useCase = new GetSolicitudesFormalesByComercianteIdUseCase_1.GetSolicitudesFormalesByComercianteIdUseCase(solicitudFormalRepo);
        const solicitudes = yield useCase.execute(Number(comercianteId));
        res.json(solicitudes);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
});
exports.listarSolicitudesFormalesByComerciante = listarSolicitudesFormalesByComerciante;
const aprobarSolicitudInicial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = parseInt(req.params.id, 10);
        const { comentario } = req.body;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !((_b = req.user) === null || _b === void 0 ? void 0 : _b.rol)) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const esAdministrador = req.user.rol === 'administrador';
        const aprobadorId = Number(req.user.id);
        const solicitudActualizada = yield aprobarRechazarSolicitudInicialUC.aprobarSolicitud(Number(id), aprobadorId, esAdministrador, comentario);
        res.status(200).json(solicitudActualizada);
    }
    catch (error) {
        handleErrorResponse(res, error);
    }
});
exports.aprobarSolicitudInicial = aprobarSolicitudInicial;
const rechazarSolicitudInicial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = req.params.id;
        const { comentario } = req.body;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !((_b = req.user) === null || _b === void 0 ? void 0 : _b.rol)) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const esAdministrador = req.user.rol === 'administrador';
        const aprobadorId = Number(req.user.id);
        const solicitudActualizada = yield aprobarRechazarSolicitudInicialUC.rechazarSolicitud(Number(id), comentario, aprobadorId, esAdministrador);
        res.status(200).json(solicitudActualizada);
    }
    catch (error) {
        handleErrorResponse(res, error);
    }
});
exports.rechazarSolicitudInicial = rechazarSolicitudInicial;
// Función auxiliar para manejar errores
function handleErrorResponse(res, error) {
    const message = error.message || 'Error desconocido';
    if (message.includes('no encontrada')) {
        res.status(404).json({ error: message });
    }
    else if (message.includes('pendientes') || message.includes('obligatorio')) {
        res.status(400).json({ error: message });
    }
    else {
        res.status(500).json({ error: message });
    }
}
