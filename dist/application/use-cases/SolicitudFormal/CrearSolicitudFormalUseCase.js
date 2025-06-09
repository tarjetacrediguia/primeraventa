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
const uuid_1 = require("uuid");
class CrearSolicitudFormalUseCase {
    constructor(solicitudInicialRepo, solicitudFormalRepo, permisoRepo, notificationService) {
        this.solicitudInicialRepo = solicitudInicialRepo;
        this.solicitudFormalRepo = solicitudFormalRepo;
        this.permisoRepo = permisoRepo;
        this.notificationService = notificationService;
    }
    execute(solicitudInicialId_1, comercianteId_1, datosSolicitud_1) {
        return __awaiter(this, arguments, void 0, function* (solicitudInicialId, comercianteId, datosSolicitud, comentarioInicial = "Solicitud creada por comerciante" // Nuevo parámetro
        ) {
            try {
                // 1. Verificar permisos del comerciante
                const tienePermiso = yield this.permisoRepo.usuarioTienePermiso(Number(comercianteId), "solicitud_formal.crear");
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
                const solicitudFormal = new SolicitudFormal_1.SolicitudFormal((0, uuid_1.v4)(), datosSolicitud.nombreCompleto, datosSolicitud.apellido, datosSolicitud.dni, datosSolicitud.telefono, datosSolicitud.email, new Date(), datosSolicitud.recibo, "pendiente", datosSolicitud.aceptaTarjeta, datosSolicitud.fechaNacimiento, datosSolicitud.domicilio, datosSolicitud.datosEmpleador, datosSolicitud.referentes, [comentarioInicial] // Nuevo comentario inicial
                );
                // 6. Vincular con solicitud inicial (propiedad adicional necesaria)
                solicitudFormal.solicitudInicialId = solicitudInicialId;
                // 7. Guardar en la base de datos
                const solicitudCreada = yield this.solicitudFormalRepo.createSolicitudFormal(solicitudFormal);
                // 8. Notificar al cliente
                yield this.notificationService.emitNotification({
                    userId: Number(solicitudCreada.getId()),
                    type: "solicitud_formal",
                    message: "Solicitud formal creada exitosamente"
                });
                // Notificar al comerciante
                yield this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "solicitud_formal",
                    message: "Se ha creado una nueva solicitud formal"
                });
                // Notificar a los analistas
                yield this.notificationService.emitNotification({
                    userId: 0, // ID especial para notificaciones grupales
                    type: "nueva_solicitud",
                    message: `Nueva solicitud formal pendiente: ${solicitudCreada.getId()}`
                });
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
            yield this.notificationService.emitNotification({
                userId: 0, // ID especial para notificaciones grupales
                type: "nueva_solicitud",
                message: `Nueva solicitud formal pendiente: ${solicitud.getId()}`
            });
        });
    }
}
exports.CrearSolicitudFormalUseCase = CrearSolicitudFormalUseCase;
