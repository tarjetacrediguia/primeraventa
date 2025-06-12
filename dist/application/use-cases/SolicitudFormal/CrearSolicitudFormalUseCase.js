"use strict";
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
exports.CrearSolicitudFormalUseCase = void 0;
const SolicitudFormal_1 = require("../../../domain/entities/SolicitudFormal");
class CrearSolicitudFormalUseCase {
    constructor(solicitudInicialRepo, solicitudFormalRepo, permisoRepo, notificationService, analistaRepo, contratoRepository, clienteRepository) {
        this.solicitudInicialRepo = solicitudInicialRepo;
        this.solicitudFormalRepo = solicitudFormalRepo;
        this.permisoRepo = permisoRepo;
        this.notificationService = notificationService;
        this.analistaRepo = analistaRepo;
        this.contratoRepository = contratoRepository;
        this.clienteRepository = clienteRepository;
    }
    execute(solicitudInicialId_1, comercianteId_1, datosSolicitud_1) {
        return __awaiter(this, arguments, void 0, function* (solicitudInicialId, comercianteId, datosSolicitud, comentarioInicial = "Solicitud creada por comerciante") {
            try {
                //verificar que el cliente no tenga un crédito activo
                this.tieneCreditoActivo(datosSolicitud.dni);
                // 1. Verificar permisos del comerciante
                const tienePermiso = yield this.permisoRepo.usuarioTienePermiso(comercianteId, "create_solicitudFormal" // Permiso necesario
                );
                if (!tienePermiso) {
                    throw new Error("No tiene permisos para enviar solicitudes formales");
                }
                // 2. Obtener solicitud inicial
                const solicitudInicial = yield this.solicitudInicialRepo.getSolicitudInicialById(solicitudInicialId);
                if (!solicitudInicial) {
                    throw new Error("Solicitud inicial no encontrada");
                }
                // 3. Verificar estado de la solicitud inicial
                if (solicitudInicial.getEstado() !== "aprobada") {
                    throw new Error("La solicitud inicial no está aprobada");
                }
                // 4. Verificar que no exista ya una solicitud formal para esta inicial
                const existentes = yield this.solicitudFormalRepo.getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId);
                if (existentes.length > 0) {
                    throw new Error("Ya existe una solicitud formal para esta solicitud inicial");
                }
                // 5. Crear la solicitud formal con comentario inicial
                const solicitudFormal = new SolicitudFormal_1.SolicitudFormal(0, // ID se asignará automáticamente
                solicitudInicialId, comercianteId, datosSolicitud.nombreCompleto, datosSolicitud.apellido, datosSolicitud.dni, datosSolicitud.telefono, datosSolicitud.email, new Date(), typeof datosSolicitud.recibo === "string"
                    ? Buffer.from(datosSolicitud.recibo, "base64")
                    : datosSolicitud.recibo, "pendiente", datosSolicitud.aceptaTarjeta, datosSolicitud.fechaNacimiento, datosSolicitud.domicilio, datosSolicitud.datosEmpleador, datosSolicitud.referentes, [comentarioInicial]);
                solicitudFormal.solicitudInicialId = solicitudInicialId;
                solicitudFormal.comercianteId = comercianteId;
                // 6. Vincular con solicitud inicial (propiedad adicional necesaria)
                solicitudFormal.solicitudInicialId = solicitudInicialId;
                console.log("Solicitud formal creada:", solicitudFormal);
                // 7. Guardar en la base de datos
                const solicitudCreada = yield this.solicitudFormalRepo.createSolicitudFormal(solicitudFormal);
                console.log("Solicitud formal guardada en la base de datos:", solicitudCreada);
                // 8. Notificar al cliente
                yield this.notificationService.emitNotification({
                    userId: solicitudCreada.getComercianteId(),
                    type: "solicitud_formal",
                    message: "Solicitud formal creada exitosamente"
                });
                console.log("Solicitud formal guardada:", solicitudCreada);
                // 9. Notificar a los analistas
                yield this.notificarAnalistas(solicitudCreada);
                return solicitudCreada;
            }
            catch (error) {
                // Notificar error al comerciante
                let errorMessage = "Error desconocido";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                yield this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "error",
                    message: `Error al crear solicitud formal: ${errorMessage}`
                });
                throw error;
            }
        });
    }
    notificarAnalistas(solicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Obtener todos los IDs de analistas usando el repositorio
                const analistaIds = yield this.analistaRepo.obtenerIdsAnalistasActivos();
                console.log("IDs de analistas activos:", analistaIds);
                // 2. Enviar notificación individual a cada analista
                const notificaciones = analistaIds.map(analistaId => this.notificationService.emitNotification({
                    userId: analistaId,
                    type: "solicitud_formal",
                    message: "Nueva solicitud formal requiere revisión",
                    metadata: {
                        solicitudId: solicitud.getId(),
                        cliente: `${solicitud.getNombreCompleto()} ${solicitud.getApellido()}`,
                        comercianteId: solicitud.getComercianteId(),
                        prioridad: "alta"
                    }
                }));
                yield Promise.all(notificaciones);
            }
            catch (error) {
                console.error("Error notificando a analistas:", error);
                // Opcional: Notificar a administradores sobre fallo
            }
        });
    }
    tieneCreditoActivo(dniCliente) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener todas las solicitudes formales del cliente por DNI
            //const solicitudesFormales = await this.solicitudFormalRepo.getSolicitudesFormalesByDni(dniCliente);
            const cliente = yield this.clienteRepository.findByDni(dniCliente);
            console.log("Cliente encontrado:", cliente);
            //verificar si el cliente tiene un contrato generado
            const contrato = yield this.contratoRepository.getContratoById(cliente.getId().toString());
            console.log("Contrato encontrado:", contrato);
            // Verificar cada solicitud formal para ver si tiene un contrato activo asociado
            if (contrato) {
                const tieneContratoActivo = contrato.getEstado() === "generado";
                if (tieneContratoActivo) {
                    return true;
                }
            }
            return false;
        });
    }
}
exports.CrearSolicitudFormalUseCase = CrearSolicitudFormalUseCase;
