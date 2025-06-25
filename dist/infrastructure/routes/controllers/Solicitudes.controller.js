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
exports.obtenerDetalleSolicitudFormal = exports.actualizarSolicitudFormal = exports.listarSolicitudesFormales = exports.rechazarSolicitudFormal = exports.aprobarSolicitudFormal = exports.crearSolicitudFormal = exports.verificarEstadoCrediticio = exports.listarSolicitudesIniciales = exports.crearSolicitudInicial = void 0;
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
// Inyección de dependencias (deberían venir de un contenedor DI)
const verazService = new VerazAdapter_1.VerazAdapter();
const notificationService = new NotificationAdapter_1.NotificationAdapter();
const solicitudInicialRepo = new SolicitudInicialRepositoryAdapter_1.SolicitudInicialRepositoryAdapter();
const contratoRepo = new ContratoRepositoryAdapter_1.ContratoRepositoryAdapter();
const solicitudFormalRepo = new SolicitudFormalRepositoryAdapter_1.SolicitudFormalRepositoryAdapter();
const permisoRepo = new PermisoRepositoryAdapter_1.PermisoRepositoryAdapter();
const clienteRepository = new ClienteRepositoryAdapter_1.ClienteRepositoryAdapter();
// Casos de uso inicializados
const crearSolicitudInicialUC = new CrearSolicitudInicialUseCase_1.CrearSolicitudInicialUseCase(solicitudInicialRepo, contratoRepo, solicitudFormalRepo, verazService, notificationService, clienteRepository);
const getSolicitudesInicialesByEstadoUC = new GetSolicitudesInicialesByEstadoUseCase_1.GetSolicitudesInicialesByEstadoUseCase(solicitudInicialRepo);
const verificarAprobacionUC = new VerificarAprobacionSolicitudInicialUseCase_1.VerificarAprobacionSolicitudInicialUseCase(solicitudInicialRepo, verazService, notificationService);
const crearSolicitudFormalUC = new CrearSolicitudFormalUseCase_1.CrearSolicitudFormalUseCase(solicitudInicialRepo, solicitudFormalRepo, permisoRepo, notificationService, new AnalistaRepositoryAdapter_1.AnalistaRepositoryAdapter(), contratoRepo, clienteRepository);
const aprobarSolicitudesUC = new AprobarSolicitudesFormalesUseCase_1.AprobarSolicitudesFormalesUseCase(solicitudFormalRepo, notificationService);
const getSolicitudesFormalesByEstadoUC = new GetSolicitudesFormalesByEstadoUseCase_1.GetSolicitudesFormalesByEstadoUseCase(solicitudFormalRepo);
const getSolicitudesFormalesByFechaUC = new GetSolicitudesFormalesByFechaUseCase_1.GetSolicitudesFormalesByFechaUseCase(solicitudFormalRepo);
const updateSolicitudFormalUC = new UpdateSolicitudFormalUseCase_1.UpdateSolicitudFormalUseCase(solicitudFormalRepo);
const getSolicitudFormalByIdUC = new GetSolicitudFormalByIdUseCase_1.GetSolicitudesFormalesByIdUseCase(solicitudFormalRepo);
// Controladores
const crearSolicitudInicial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dniCliente, cuilCliente, reciboSueldo } = req.body;
        console.log(`Creando solicitud inicial para cliente DNI: ${dniCliente}, CUIL: ${cuilCliente}`);
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const comercianteId = Number(req.user.id);
        console.log(`Creando solicitud inicial para comerciante ID: ${comercianteId}`);
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
        console.log(`Listando solicitudes iniciales con estado: ${estado}`);
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
        console.log(`Creando solicitud formal para solicitud inicial ID: ${idSolicitudInicial}`);
        // Validar campos obligatorios
        /*
        if (!cliente.recibo) {
          return res.status(400).json({ error: 'El recibo es obligatorio' });
        }
    */
        // Validar que se proporcionen exactamente dos referentes
        if (!referentes || !Array.isArray(referentes)) {
            return res.status(400).json({ error: 'Se requiere un array de referentes' });
        }
        if (referentes.length !== 2) {
            return res.status(400).json({ error: 'Se requieren exactamente dos referentes' });
        }
        // Validar estructura de cada referente
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
            recibo: Buffer.from(cliente.recibo, 'base64'),
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
    try {
        const id = Number(req.params.id);
        const updates = req.body;
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
                solicitudExistente.setRecibo(Buffer.from(cliente.recibo, 'base64'));
            }
        }
        console.log(`Actualizando solicitud formal ID: ${id} con datos:`, updates);
        const solicitudActualizada = yield updateSolicitudFormalUC.execute(solicitudExistente);
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
