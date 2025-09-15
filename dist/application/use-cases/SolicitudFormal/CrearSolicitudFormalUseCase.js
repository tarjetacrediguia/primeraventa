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
const ArchivosAdjuntos_1 = require("../../../domain/entities/ArchivosAdjuntos");
/**
 * Caso de uso para crear una nueva solicitud formal de crédito.
 *
 * Esta clase implementa la lógica completa para crear una solicitud formal,
 * incluyendo validaciones de negocio, verificación de documentos, creación
 * de entidades y notificaciones correspondientes.
 */
class CrearSolicitudFormalUseCase {
    /**
     * Constructor del caso de uso para crear solicitudes formales.
     *
     * @param solicitudInicialRepo - Puerto para operaciones de solicitudes iniciales
     * @param solicitudFormalRepo - Puerto para operaciones de solicitudes formales
     * @param permisoRepo - Puerto para verificación de permisos
     * @param notificationService - Puerto para servicios de notificación
     * @param analistaRepo - Puerto para operaciones de analistas
     * @param contratoRepository - Puerto para operaciones de contratos
     * @param clienteRepository - Puerto para operaciones de clientes
     * @param historialRepository - Puerto para registro de eventos en historial
     * @param configuracionRepo - Puerto para operaciones de configuración del sistema
     */
    constructor(solicitudInicialRepo, solicitudFormalRepo, permisoRepo, notificationService, analistaRepo, contratoRepository, clienteRepository, historialRepository, configuracionRepo) {
        this.solicitudInicialRepo = solicitudInicialRepo;
        this.solicitudFormalRepo = solicitudFormalRepo;
        this.permisoRepo = permisoRepo;
        this.notificationService = notificationService;
        this.analistaRepo = analistaRepo;
        this.contratoRepository = contratoRepository;
        this.clienteRepository = clienteRepository;
        this.historialRepository = historialRepository;
        this.configuracionRepo = configuracionRepo;
    }
    /**
     * Ejecuta la creación de una solicitud formal de crédito.
     *
     * Este método implementa el flujo completo de creación de solicitud formal:
     * 1. Verifica que el cliente no tenga créditos activos
     * 2. Valida permisos del comerciante
     * 3. Verifica que la solicitud inicial esté aprobada
     * 4. Obtiene configuración de ponderador del sistema
     * 5. Valida que no exista una solicitud formal previa
     * 6. Verifica formato y validez del recibo de sueldo
     * 7. Crea la solicitud formal con todos los datos
     * 8. Maneja archivos adjuntos opcionales
     * 9. Registra eventos y envía notificaciones
     *
     * VALIDACIONES REALIZADAS:
     * - Cliente no debe tener créditos activos
     * - Comerciante debe tener permisos de creación
     * - Solicitud inicial debe existir y estar aprobada
     * - No debe existir solicitud formal previa
     * - Recibo debe ser una imagen válida (JPG, PNG, WEBP, GIF)
     * - Configuración de ponderador debe existir y ser válida
     *
     * @param solicitudInicialId - ID de la solicitud inicial aprobada
     * @param comercianteId - ID del comerciante que crea la solicitud
     * @param datosSolicitud - Objeto con todos los datos del cliente y la solicitud
     * @param comentarioInicial - Comentario opcional para la solicitud (por defecto: "Solicitud creada por comerciante")
     * @param solicitaAmpliacionDeCredito - Indica si se solicita ampliación de crédito
     * @param datosEmpleador - Datos del empleador del cliente
     * @returns Promise<SolicitudFormal> - La solicitud formal creada
     * @throws Error - Si no se cumplen las validaciones o ocurre un error en el proceso
     */
    execute(solicitudInicialId_1, comercianteId_1, datosSolicitud_1) {
        return __awaiter(this, arguments, void 0, function* (solicitudInicialId, comercianteId, datosSolicitud, comentarioInicial = "Solicitud creada por comerciante", solicitaAmpliacionDeCredito, datosEmpleador) {
            try {
                // ===== PASO 1: VALIDAR CRÉDITO ACTIVO =====
                // Verificar que el cliente no tenga créditos activos
                const tieneCredito = yield this.tieneCreditoActivo(solicitudInicialId);
                // ===== PASO 2: VALIDAR PERMISOS DEL COMERCIANTE =====
                // Verificar que el comerciante tenga permisos para crear solicitudes formales
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
                // ===== PASO 3: OBTENER Y VALIDAR SOLICITUD INICIAL =====
                // Obtener la solicitud inicial asociada
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
                // ===== PASO 4: OBTENER CONFIGURACIÓN DE PONDERADOR =====
                // Obtener configuración del sistema para el ponderador
                const configs = yield this.configuracionRepo.obtenerConfiguracion();
                const ponderadorConfig = configs.find(c => c.getClave() === 'ponderador');
                if (!ponderadorConfig) {
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: { error: "Configuración de ponderador no encontrada" },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error("Configuración de ponderador no encontrada");
                }
                // Validar que el ponderador sea un número válido
                const ponderador = parseFloat(ponderadorConfig.getValor());
                if (isNaN(ponderador)) {
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: { error: "Ponderador no es un número válido" },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error("Ponderador no es un número válido");
                }
                // ===== PASO 5: VALIDAR ESTADO DE SOLICITUD INICIAL =====
                // Verificar que la solicitud inicial esté en estado "aprobada"
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
                // ===== PASO 6: VALIDAR DUPLICADOS =====
                // Verificar que no exista ya una solicitud formal para esta solicitud inicial
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
                // ===== PASO 7: VALIDAR FORMATO DE RECIBO DE SUELDO =====
                // Convertir recibo de string base64 a Buffer si es necesario
                if (typeof datosSolicitud.recibo === 'string') {
                    datosSolicitud.recibo = Buffer.from(datosSolicitud.recibo, 'base64');
                }
                // Verificar que el recibo sea una imagen válida y de un tipo permitido
                const fileType = yield Promise.resolve().then(() => __importStar(require('file-type')));
                const type = yield fileType.fileTypeFromBuffer(datosSolicitud.recibo);
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
                if (!type || !allowedMimeTypes.includes(type.mime)) {
                    // Registrar evento de tipo de imagen no permitido
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: {
                            error: "El recibo debe ser una imagen válida (JPG, PNG, WEBP o GIF)"
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error('El recibo debe ser una imagen válida (JPG, PNG, WEBP o GIF)');
                }
                // ===== PASO 8: CREAR SOLICITUD FORMAL =====
                // Crear la solicitud formal con todos los datos del cliente y empleador
                const solicitudFormal = new SolicitudFormal_1.SolicitudFormal({
                    id: 0, // ID se asignará automáticamente al guardar
                    solicitudInicialId: solicitudInicialId,
                    comercianteId: comercianteId,
                    nombreCompleto: datosSolicitud.nombreCompleto,
                    apellido: datosSolicitud.apellido,
                    telefono: datosSolicitud.telefono,
                    email: datosSolicitud.email,
                    fechaSolicitud: new Date(), // Fecha de creación
                    recibo: typeof datosSolicitud.recibo === "string"
                        ? Buffer.from(datosSolicitud.recibo, "base64")
                        : datosSolicitud.recibo,
                    estado: "pendiente", // Estado inicial
                    aceptaTarjeta: datosSolicitud.aceptaTarjeta,
                    fechaNacimiento: datosSolicitud.fechaNacimiento,
                    domicilio: datosSolicitud.domicilio,
                    referentes: datosSolicitud.referentes,
                    importeNeto: datosSolicitud.importeNeto,
                    comentarios: [comentarioInicial], // Comentarios iniciales
                    ponderador: ponderador, // Ponderador obtenido de configuración
                    solicitaAmpliacionDeCredito: solicitaAmpliacionDeCredito,
                    // Datos del empleador
                    razonSocialEmpleador: datosEmpleador.razonSocialEmpleador,
                    cuitEmpleador: datosEmpleador.cuitEmpleador,
                    cargoEmpleador: datosEmpleador.cargoEmpleador,
                    sectorEmpleador: datosEmpleador.sectorEmpleador,
                    codigoPostalEmpleador: datosEmpleador.codigoPostalEmpleador,
                    localidadEmpleador: datosEmpleador.localidadEmpleador,
                    provinciaEmpleador: datosEmpleador.provinciaEmpleador,
                    telefonoEmpleador: datosEmpleador.telefonoEmpleador,
                    // Datos personales adicionales
                    sexo: datosSolicitud.sexo,
                    codigoPostal: datosSolicitud.codigoPostal,
                    localidad: datosSolicitud.localidad,
                    provincia: datosSolicitud.provincia,
                    numeroDomicilio: datosSolicitud.numeroDomicilio,
                    barrio: datosSolicitud.barrio
                });
                // ===== PASO 9: AGREGAR ARCHIVOS ADJUNTOS =====
                // Agregar archivos adjuntos opcionales si existen
                if (datosSolicitud.archivosAdjuntos && datosSolicitud.archivosAdjuntos.length > 0) {
                    for (const archivoData of datosSolicitud.archivosAdjuntos) {
                        const archivo = new ArchivosAdjuntos_1.ArchivoAdjunto(0, // ID temporal, se asignará al guardar
                        archivoData.nombre, archivoData.tipo, archivoData.contenido);
                        solicitudFormal.agregarArchivoAdjunto(archivo);
                    }
                }
                // ===== PASO 10: VALIDAR COMPLETITUD DE DATOS =====
                // Validar que todos los datos requeridos estén presentes
                solicitudFormal.validarCompletitud();
                // ===== PASO 11: PERSISTIR EN BASE DE DATOS =====
                // Vincular con solicitud inicial (propiedad adicional necesaria)
                solicitudFormal.solicitudInicialId = solicitudInicialId;
                // Guardar la solicitud formal en la base de datos
                const solicitudCreada = yield this.solicitudFormalRepo.createSolicitudFormal(solicitudFormal);
                // ===== PASO 12: REGISTRAR EVENTO EN HISTORIAL =====
                // Registrar evento de creación exitosa en historial
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
                // ===== PASO 13: NOTIFICAR AL COMERCIANTE =====
                // Enviar notificación al comerciante sobre la creación exitosa
                yield this.notificationService.emitNotification({
                    userId: solicitudCreada.getComercianteId(),
                    type: "solicitud_formal",
                    message: "Solicitud formal creada exitosamente"
                });
                // ===== PASO 14: NOTIFICAR A ANALISTAS =====
                // Notificar a analistas sobre la nueva solicitud que requiere revisión
                yield this.notificarAnalistas(solicitudCreada);
                // Retornar la solicitud formal creada exitosamente
                return solicitudCreada;
            }
            catch (error) {
                // ===== MANEJO DE ERRORES =====
                // Determinar mensaje de error apropiado
                let errorMessage = "Error desconocido";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                // Notificar error al comerciante
                yield this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "error",
                    message: `Error al crear solicitud formal: ${errorMessage}`
                });
                // Registrar evento de error en historial
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
                // Re-lanzar el error para que sea manejado por el controlador
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
     * @param solicitudInicialId - ID de la solicitud inicial para buscar el cliente
     * @returns Promise<boolean> - true si el cliente tiene un crédito activo, false en caso contrario
     */
    tieneCreditoActivo(solicitudInicialId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener la solicitud inicial para extraer el CUIL del cliente
            const solicitudInicial = yield this.solicitudInicialRepo.getSolicitudInicialById(solicitudInicialId);
            if (!solicitudInicial) {
                throw new Error("Solicitud inicial no encontrada");
            }
            const idCliente = solicitudInicial.getClienteId();
            const cliente = yield this.clienteRepository.findById(idCliente);
            //verificar si el cliente tiene un contrato generado
            const contrato = yield this.contratoRepository.getContratoById(cliente.getId().toString());
            // Verificar cada solicitud formal para ver si tiene un contrato activo asociado
            if (contrato) {
                const tieneContratoActivo = contrato.getEstado() === "generado";
                if (tieneContratoActivo) {
                    // Registrar evento de rechazo por crédito activo
                    yield this.historialRepository.registrarEvento({
                        usuarioId: solicitudInicial.getComercianteId() || null,
                        accion: historialActions_1.HISTORIAL_ACTIONS.REJECT_SOLICITUD_FORMAL,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: {
                            motivo: "Cliente con crédito activo",
                            Cuil_cliente: cliente.getCuil(),
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error("El cliente ya tiene un crédito activo");
                    return true;
                }
            }
            return false;
        });
    }
}
exports.CrearSolicitudFormalUseCase = CrearSolicitudFormalUseCase;
