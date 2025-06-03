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
exports.GenerarContratoUseCase = void 0;
const Contrato_1 = require("../../../domain/entities/Contrato");
class GenerarContratoUseCase {
    constructor(solicitudRepository, contratoRepository, pdfService, notificationService) {
        this.solicitudRepository = solicitudRepository;
        this.contratoRepository = contratoRepository;
        this.pdfService = pdfService;
        this.notificationService = notificationService;
    }
    execute(numeroSolicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Obtener solicitud formal (asumiendo que el ID es el número de solicitud)
                const solicitud = yield this.solicitudRepository.getSolicitudFormalById(numeroSolicitud);
                if (!solicitud) {
                    throw new Error(`Solicitud formal no encontrada: ${numeroSolicitud}`);
                }
                // 2. Verificar estado aprobado
                if (solicitud.getEstado() !== "aprobada") {
                    yield this.notificarSinPermisos(solicitud);
                    throw new Error("La solicitud no está aprobada, no se puede generar contrato");
                }
                // 3. Generar contrato (monto asumido o calculado según tu lógica de negocio)
                const monto = this.calcularMontoContrato(solicitud);
                const contrato = new Contrato_1.Contrato(this.generarIdContrato(), new Date(), monto, "generado", solicitud.getId(), solicitud.getDni(), // Usamos DNI como identificador de cliente
                this.generarNumeroAutorizacion(), this.generarNumeroCuenta());
                // 4. Guardar contrato
                const contratoGuardado = yield this.contratoRepository.saveContrato(contrato);
                // 5. Vincular contrato a solicitud
                yield this.solicitudRepository.vincularContrato(solicitud.getId(), contratoGuardado.getId());
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
    notificarSinPermisos(solicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            const mensaje = "Su solicitud no ha sido aprobada, por lo tanto no puede generar un contrato. Por favor contacte al administrador.";
            yield this.enviarNotificacion(solicitud, mensaje);
        });
    }
    notificarContratoGenerado(solicitud, contrato, pdfBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const mensaje = `Su contrato ${contrato.getNumeroAutorizacion()} ha sido generado con éxito. Monto: $${contrato.getMonto()}`;
            yield this.enviarNotificacion(solicitud, mensaje, pdfBuffer);
        });
    }
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
    enviarNotificacion(solicitud, mensaje, pdf) {
        return __awaiter(this, void 0, void 0, function* () {
            // Crear notificación en el sistema
            yield this.notificationService.emitNotification({
                userId: solicitud.getId(), // O usar otro identificador si es necesario
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
    calcularMontoContrato(solicitud) {
        // Lógica para calcular el monto del contrato basado en la solicitud
        // Esta es una implementación de ejemplo - ajusta según tu lógica de negocio
        return 10000; // Valor de ejemplo
    }
    generarIdContrato() {
        return `CONTR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    generarNumeroAutorizacion() {
        return `AUTH-${Date.now()}`;
    }
    generarNumeroCuenta() {
        return `CTA-${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
    }
}
exports.GenerarContratoUseCase = GenerarContratoUseCase;
