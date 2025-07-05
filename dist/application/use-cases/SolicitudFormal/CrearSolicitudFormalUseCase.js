"use strict";
// src/application/use-cases/SolicitudFormal/CrearSolicitudFormalUseCase.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const historialActions_1 = require("../../constants/historialActions");
/**
 * Caso de uso para crear una nueva solicitud formal de crédito.
 *
 * Esta clase implementa la lógica completa para crear una solicitud formal,
 * incluyendo validaciones de negocio, verificación de documentos, creación
 * de entidades y notificaciones correspondientes.
 */
class CrearSolicitudFormalUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param solicitudInicialRepo - Puerto para operaciones de solicitudes iniciales
     * @param solicitudFormalRepo - Puerto para operaciones de solicitudes formales
     * @param permisoRepo - Puerto para verificación de permisos
     * @param notificationService - Puerto para servicios de notificación
     * @param analistaRepo - Puerto para operaciones de analistas
     * @param contratoRepository - Puerto para operaciones de contratos
     * @param clienteRepository - Puerto para operaciones de clientes
     * @param historialRepository - Puerto para registro de eventos en historial
     */
    constructor(solicitudInicialRepo, solicitudFormalRepo, permisoRepo, notificationService, analistaRepo, contratoRepository, clienteRepository, historialRepository) {
        this.solicitudInicialRepo = solicitudInicialRepo;
        this.solicitudFormalRepo = solicitudFormalRepo;
        this.permisoRepo = permisoRepo;
        this.notificationService = notificationService;
        this.analistaRepo = analistaRepo;
        this.contratoRepository = contratoRepository;
        this.clienteRepository = clienteRepository;
        this.historialRepository = historialRepository;
    }
    /**
     * Ejecuta la creación de una solicitud formal de crédito.
     *
     * Este método implementa el flujo completo de creación de solicitud formal:
     * 1. Verifica que el cliente no tenga créditos activos
     * 2. Valida permisos del comerciante
     * 3. Verifica que la solicitud inicial esté aprobada
     * 4. Valida que no exista una solicitud formal previa
     * 5. Verifica formato y validez del recibo de sueldo
     * 6. Crea la solicitud formal con todos los datos
     * 7. Registra eventos y envía notificaciones
     *
     * @param solicitudInicialId - ID de la solicitud inicial aprobada
     * @param comercianteId - ID del comerciante que crea la solicitud
     * @param datosSolicitud - Objeto con todos los datos del cliente y la solicitud
     * @param comentarioInicial - Comentario opcional para la solicitud (por defecto: "Solicitud creada por comerciante")
     * @returns Promise<SolicitudFormal> - La solicitud formal creada
     * @throws Error - Si no se cumplen las validaciones o ocurre un error en el proceso
     */
    execute(solicitudInicialId_1, comercianteId_1, datosSolicitud_1) {
        return __awaiter(this, arguments, void 0, function* (solicitudInicialId, comercianteId, datosSolicitud, comentarioInicial = "Solicitud creada por comerciante") {
            try {
                // Verificar crédito activo
                const tieneCredito = yield this.tieneCreditoActivo(datosSolicitud.dni);
                if (tieneCredito) {
                    // Registrar evento de rechazo por crédito activo
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.REJECT_SOLICITUD_FORMAL,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: {
                            motivo: "Cliente con crédito activo",
                            dni_cliente: datosSolicitud.dni,
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error("El cliente ya tiene un crédito activo");
                }
                // 1. Verificar permisos del comerciante
                const tienePermiso = yield this.permisoRepo.usuarioTienePermiso(comercianteId, "create_solicitudFormal" // Permiso necesario
                );
                if (!tienePermiso) {
                    // Registrar evento de falta de permisos
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: {
                            motivo: "Falta de permisos",
                            permiso_requerido: "create_solicitudFormal"
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error("No tiene permisos para enviar solicitudes formales");
                }
                // 2. Obtener solicitud inicial
                const solicitudInicial = yield this.solicitudInicialRepo.getSolicitudInicialById(solicitudInicialId);
                if (!solicitudInicial) {
                    // Registrar evento de solicitud inicial no encontrada
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: {
                            error: "Solicitud inicial no encontrada",
                            solicitud_inicial_id: solicitudInicialId
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error("Solicitud inicial no encontrada");
                }
                // 3. Verificar estado de la solicitud inicial
                if (solicitudInicial.getEstado() !== "aprobada") {
                    // Registrar evento de estado no aprobado
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: {
                            error: "Solicitud inicial no aprobada",
                            estado_actual: solicitudInicial.getEstado(),
                            solicitud_inicial_id: solicitudInicialId
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error("La solicitud inicial no está aprobada");
                }
                // 4. Verificar que no exista ya una solicitud formal para esta inicial
                const existentes = yield this.solicitudFormalRepo.getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId);
                if (existentes.length > 0) {
                    // Registrar evento de solicitud duplicada
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: {
                            error: "Solicitud formal ya existe",
                            solicitud_inicial_id: solicitudInicialId,
                            solicitud_formal_id: existentes[0].getId()
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error("Ya existe una solicitud formal para esta solicitud inicial");
                }
                const signature = datosSolicitud.recibo.subarray(0, 3);
                if (!(signature[0] === 0xFF && signature[1] === 0xD8 && signature[2] === 0xFF)) {
                    // Registrar evento de recibo inválido
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: {
                            error: "Recibo no es JPG válido"
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error('El recibo no es una imagen JPG válida');
                }
                if (typeof datosSolicitud.recibo === 'string') {
                    const buffer = Buffer.from(datosSolicitud.recibo, 'base64');
                    const fileType = yield Promise.resolve().then(() => __importStar(require('file-type')));
                    const type = yield fileType.fileTypeFromBuffer(buffer);
                    if (!type || !type.mime.startsWith('image/')) {
                        // Registrar evento de tipo inválido
                        yield this.historialRepository.registrarEvento({
                            usuarioId: comercianteId,
                            accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                            entidadAfectada: 'solicitudes_formales',
                            entidadId: 0,
                            detalles: {
                                error: "Recibo no es una imagen"
                            },
                            solicitudInicialId: solicitudInicialId
                        });
                        throw new Error('El recibo debe ser una imagen válida');
                    }
                    if (type.mime !== 'image/jpeg') {
                        // Registrar evento de formato incorrecto
                        yield this.historialRepository.registrarEvento({
                            usuarioId: comercianteId,
                            accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                            entidadAfectada: 'solicitudes_formales',
                            entidadId: 0,
                            detalles: {
                                error: "Recibo no es JPG"
                            },
                            solicitudInicialId: solicitudInicialId
                        });
                        throw new Error('Solo se aceptan imágenes en formato JPG');
                    }
                    datosSolicitud.recibo = buffer;
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
                // 7. Guardar en la base de datos
                const solicitudCreada = yield this.solicitudFormalRepo.createSolicitudFormal(solicitudFormal);
                // Registrar evento de creación de solicitud formal
                yield this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.CREATE_SOLICITUD_FORMAL,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitudCreada.getId(),
                    detalles: {
                        solicitud_inicial_id: solicitudInicialId,
                        estado: "pendiente",
                        cliente: `${datosSolicitud.nombreCompleto} ${datosSolicitud.apellido}`
                    },
                    solicitudInicialId: solicitudInicialId
                });
                // 8. Notificar al cliente
                yield this.notificationService.emitNotification({
                    userId: solicitudCreada.getComercianteId(),
                    type: "solicitud_formal",
                    message: "Solicitud formal creada exitosamente"
                });
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
                // Registrar evento de error
                yield this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: 0,
                    detalles: {
                        error: error instanceof Error ? error.message : String(error),
                        etapa: "creacion_solicitud_formal",
                        solicitud_inicial_id: solicitudInicialId
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw error;
            }
        });
    }
    /**
     * Notifica a todos los analistas activos sobre una nueva solicitud formal.
     *
     * Este método privado obtiene todos los analistas activos del sistema y les
     * envía una notificación sobre la nueva solicitud formal que requiere revisión.
     *
     * @param solicitud - La solicitud formal creada que requiere notificación
     * @returns Promise<void> - No retorna valor
     */
    notificarAnalistas(solicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Obtener todos los IDs de analistas usando el repositorio
                const analistaIds = yield this.analistaRepo.obtenerIdsAnalistasActivos();
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
                // Registrar evento de error en notificación
                yield this.historialRepository.registrarEvento({
                    usuarioId: solicitud.getComercianteId(),
                    accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitud.getId(),
                    detalles: {
                        error: "Error notificando a analistas",
                        etapa: "notificacion_analistas"
                    },
                    solicitudInicialId: solicitud.getSolicitudInicialId()
                });
                // Opcional: Notificar a administradores sobre fallo
            }
        });
    }
    /**
     * Verifica si un cliente tiene un crédito activo basado en sus contratos.
     *
     * Este método privado consulta si el cliente tiene un contrato con estado
     * "generado" (activo) asociado a su ID.
     *
     * @param dniCliente - DNI del cliente a verificar
     * @returns Promise<boolean> - true si el cliente tiene un crédito activo, false en caso contrario
     */
    tieneCreditoActivo(dniCliente) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener todas las solicitudes formales del cliente por DNI
            //const solicitudesFormales = await this.solicitudFormalRepo.getSolicitudesFormalesByDni(dniCliente);
            const cliente = yield this.clienteRepository.findByDni(dniCliente);
            //verificar si el cliente tiene un contrato generado
            const contrato = yield this.contratoRepository.getContratoById(cliente.getId().toString());
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
