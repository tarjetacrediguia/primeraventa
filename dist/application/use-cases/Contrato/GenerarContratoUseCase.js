"use strict";
// src/application/use-cases/Contrato/GenerarContratoUseCase.ts
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
exports.GenerarContratoUseCase = void 0;
const Contrato_1 = require("../../../domain/entities/Contrato");
const historialActions_1 = require("../../constants/historialActions");
/**
 * Caso de uso para la generación de contratos a partir de solicitudes formales aprobadas.
 *
 * Esta clase implementa la lógica completa para validar, crear, guardar y notificar
 * la generación de un contrato, incluyendo la generación de PDF y el registro en historial.
 */
class GenerarContratoUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param solicitudRepository - Puerto para operaciones de solicitudes formales
     * @param contratoRepository - Puerto para operaciones de contratos
     * @param pdfService - Puerto para generación de PDF
     * @param notificationService - Puerto para servicios de notificación
     * @param clienteRepository - Adaptador para operaciones de clientes
     * @param historialRepository - Puerto para registro de eventos en historial
     * @param solicitudInicialRepository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(solicitudRepository, contratoRepository, pdfService, notificationService, clienteRepository, historialRepository, solicitudInicialRepository) {
        this.solicitudRepository = solicitudRepository;
        this.contratoRepository = contratoRepository;
        this.pdfService = pdfService;
        this.notificationService = notificationService;
        this.clienteRepository = clienteRepository;
        this.historialRepository = historialRepository;
        this.solicitudInicialRepository = solicitudInicialRepository;
    }
    /**
     * Ejecuta la generación de un contrato a partir de una solicitud formal aprobada.
     *
     * Este método implementa el flujo completo de generación de contrato:
     * 1. Valida la existencia y estado de la solicitud formal
     * 2. Verifica que no exista un contrato previo para la solicitud
     * 3. Crea y guarda el contrato
     * 4. Genera el PDF y notifica al solicitante
     * 5. Registra eventos en el historial y maneja errores
     *
     * @param numeroSolicitud - ID de la solicitud formal aprobada
     * @param usuarioId - ID del usuario que genera el contrato
     * @returns Promise<Contrato> - El contrato generado y guardado
     * @throws Error - Si la solicitud no existe, no está aprobada, el cliente no existe o ya hay contrato
     */
    execute(numeroSolicitud, usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Obtener solicitud formal
                const solicitud = yield this.solicitudRepository.getSolicitudFormalById(numeroSolicitud);
                if (!solicitud) {
                    throw new Error(`Solicitud formal no encontrada: ${numeroSolicitud}`);
                }
                // Obtener solicitud inicial relacionada
                const solicitudInicial = yield this.solicitudInicialRepository.getSolicitudInicialById(solicitud.getSolicitudInicialId());
                if (!solicitudInicial) {
                    throw new Error(`Solicitud inicial no encontrada para ID: ${solicitud.getSolicitudInicialId()}`);
                }
                // 2. Verificar estado aprobado
                if (solicitud.getEstado() !== "aprobada") {
                    yield this.notificarSinPermisos(solicitud);
                    // Registrar evento de error en historial
                    yield this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'contratos',
                        entidadId: 0,
                        detalles: {
                            error: "Intento de generar contrato sin aprobación",
                            solicitud_formal_id: solicitud.getId(),
                            estado_actual: solicitud.getEstado()
                        },
                        solicitudInicialId: solicitudInicial.getId()
                    });
                    throw new Error("La solicitud no está aprobada, no se puede generar contrato");
                }
                const cliente = yield this.clienteRepository.findByDni(solicitud.getDni());
                if (!cliente) {
                    throw new Error(`Cliente no encontrado para el ID: ${solicitud.getClienteId()}`);
                }
                // Verificar si ya existe un contrato para esta solicitud
                const contratosExistentes = yield this.contratoRepository.getContratosBySolicitudFormalId(Number(solicitud.getId()));
                if (contratosExistentes && contratosExistentes.length > 0) {
                    // Registrar evento de duplicado en historial
                    yield this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.WARNING_DUPLICADO,
                        entidadAfectada: 'contratos',
                        entidadId: contratosExistentes[0].getId(),
                        detalles: {
                            mensaje: "Intento de generar contrato duplicado",
                            solicitud_formal_id: solicitud.getId()
                        },
                        solicitudInicialId: solicitudInicial.getId()
                    });
                    throw new Error(`Ya existe un contrato para la solicitud ${solicitud.getId()}`);
                }
                // Obtener el cliente por DNI
                const clienteDNI = solicitud.getDni();
                const clientePorDNI = yield this.clienteRepository.findByDni(clienteDNI);
                if (!clientePorDNI) {
                    throw new Error(`No se encontró el cliente con DNI ${clienteDNI}`);
                }
                // Calcular el monto del contrato
                const monto = 10000; // Monto fijo por ahora
                // Crear el contrato con los valores correctos
                const contrato = new Contrato_1.Contrato(0, new Date(), monto, "generado", solicitud.getId(), clientePorDNI.getId(), solicitud.getNumeroTarjeta(), // Usar el número de tarjeta de la solicitud
                solicitud.getNumeroCuenta() // Usar el número de cuenta de la solicitud
                );
                // 4. Guardar contrato
                const contratoGuardado = yield this.contratoRepository.saveContrato(contrato);
                yield this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.GENERAR_CONTRATO,
                    entidadAfectada: 'contratos',
                    entidadId: contratoGuardado.getId(),
                    detalles: {
                        monto: monto,
                        numero_tarjeta: contratoGuardado.getNumeroTarjeta(),
                        numero_cuenta: contratoGuardado.getNumeroCuenta(),
                        solicitud_formal_id: solicitud.getId()
                    },
                    solicitudInicialId: solicitudInicial.getId()
                });
                // 5. Vincular contrato a solicitud
                yield this.solicitudRepository.vincularContrato(solicitud.getSolicitudInicialId(), contratoGuardado.getId());
                // 6. Generar PDF
                const pdfBuffer = yield this.pdfService.generateContractPdf({
                    contrato: contratoGuardado.toPlainObject(),
                    solicitud: solicitud.toPlainObject()
                });
                // 7. Notificar al solicitante
                yield this.notificarContratoGenerado(solicitud, contratoGuardado, pdfBuffer);
                return contratoGuardado;
            }
            catch (error) {
                // Manejo de errores y notificación
                const err = error instanceof Error ? error : new Error(String(error));
                yield this.manejarErrorGeneracion(err, numeroSolicitud);
                throw error;
            }
        });
    }
    /**
     * Notifica al solicitante que no tiene permisos para generar contrato.
     * @param solicitud - Solicitud formal a notificar
     */
    notificarSinPermisos(solicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            const mensaje = "Su solicitud no ha sido aprobada, por lo tanto no puede generar un contrato. Por favor contacte al administrador.";
            yield this.enviarNotificacion(solicitud, mensaje);
        });
    }
    /**
     * Notifica al solicitante que el contrato fue generado exitosamente.
     * @param solicitud - Solicitud formal asociada
     * @param contrato - Contrato generado
     * @param pdfBuffer - PDF generado del contrato
     */
    notificarContratoGenerado(solicitud, contrato, pdfBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const mensaje = `Su contrato ${contrato.getNumeroTarjeta()} ha sido generado con éxito. Monto: $${contrato.getMonto()}`;
            yield this.enviarNotificacion(solicitud, mensaje, pdfBuffer);
        });
    }
    /**
     * Maneja el registro y notificación de errores durante la generación de contrato.
     * @param error - Error ocurrido
     * @param numeroSolicitud - ID de la solicitud formal
     */
    manejarErrorGeneracion(error, numeroSolicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(`Error generando contrato para solicitud ${numeroSolicitud}:`, error);
            // Obtener solicitud para notificación de error
            const solicitud = yield this.solicitudRepository.getSolicitudFormalById(numeroSolicitud);
            if (solicitud) {
                const mensajeError = "No se pudo generar su contrato. Estamos trabajando para solucionarlo.";
                yield this.enviarNotificacion(solicitud, mensajeError);
            }
        });
    }
    /**
     * Envía una notificación al solicitante, opcionalmente adjuntando el PDF del contrato.
     * @param solicitud - Solicitud formal asociada
     * @param mensaje - Mensaje a enviar
     * @param pdf - Buffer opcional con el PDF generado
     */
    enviarNotificacion(solicitud, mensaje, pdf) {
        return __awaiter(this, void 0, void 0, function* () {
            // Crear notificación en el sistema
            yield this.notificationService.emitNotification({
                userId: solicitud.getId(),
                type: "contrato",
                message: mensaje,
                metadata: {
                    email: solicitud.getEmail(),
                    telefono: solicitud.getTelefono(),
                    pdf: pdf ? pdf.toString("base64") : undefined
                }
            });
            // Aquí podrías agregar envío por email/SMS si tu NotificationPort lo soporta
        });
    }
    /**
     * Calcula el monto del contrato basado en la solicitud formal.
     * @param solicitud - Solicitud formal
     * @returns number - Monto calculado
     */
    calcularMontoContrato(solicitud) {
        // Lógica para calcular el monto del contrato basado en la solicitud
        // Esta es una implementación de ejemplo - ajusta según tu lógica de negocio
        return 10000; // Valor de ejemplo
    }
    /**
     * Genera un identificador único para el contrato.
     * @returns string - ID generado
     */
    generarIdContrato() {
        return `CONTR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    /**
     * Genera un número de autorización único.
     * @returns string - Número de autorización generado
     */
    generarNumeroAutorizacion() {
        return `AUTH-${Date.now()}`;
    }
    /**
     * Genera un número de cuenta único.
     * @returns string - Número de cuenta generado
     */
    generarNumeroCuenta() {
        return `CTA-${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
    }
}
exports.GenerarContratoUseCase = GenerarContratoUseCase;
