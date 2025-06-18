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
    constructor(solicitudRepository, contratoRepository, pdfService, notificationService, clienteRepository) {
        this.solicitudRepository = solicitudRepository;
        this.contratoRepository = contratoRepository;
        this.pdfService = pdfService;
        this.notificationService = notificationService;
        this.clienteRepository = clienteRepository;
    }
    execute(numeroSolicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Obtener solicitud formal
                const solicitud = yield this.solicitudRepository.getSolicitudFormalById(numeroSolicitud);
                console.log(`Solicitud obtenida: ${JSON.stringify(solicitud)}`);
                if (!solicitud) {
                    throw new Error(`Solicitud formal no encontrada: ${numeroSolicitud}`);
                }
                // 2. Verificar estado aprobado
                if (solicitud.getEstado() !== "aprobada") {
                    yield this.notificarSinPermisos(solicitud);
                    throw new Error("La solicitud no está aprobada, no se puede generar contrato");
                }
                console.log('clienteDNI:', solicitud.getDni());
                const cliente = yield this.clienteRepository.findByDni(solicitud.getDni());
                if (!cliente) {
                    throw new Error(`Cliente no encontrado para el ID: ${solicitud.getClienteId()}`);
                }
                // Verificar si ya existe un contrato para esta solicitud
                const contratosExistentes = yield this.contratoRepository.getContratosBySolicitudFormalId(Number(solicitud.getId()));
                if (contratosExistentes && contratosExistentes.length > 0) {
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
                console.log(`Contrato generado: ${contrato}`);
                // 4. Guardar contrato
                const contratoGuardado = yield this.contratoRepository.saveContrato(contrato);
                console.log(`Contrato guardado: ${JSON.stringify(contratoGuardado)}`);
                // 5. Vincular contrato a solicitud
                yield this.solicitudRepository.vincularContrato(solicitud.getSolicitudInicialId(), contratoGuardado.getId());
                console.log(`Contrato vinculado a solicitud: ${solicitud.getId()} -> ${contratoGuardado.getId()}`);
                // 6. Generar PDF
                const pdfBuffer = yield this.pdfService.generateContractPdf({
                    contrato: contratoGuardado.toPlainObject(),
                    solicitud: solicitud.toPlainObject()
                });
                console.log(`PDF generado para contrato: ${contratoGuardado.getId()}`);
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
            const mensaje = `Su contrato ${contrato.getNumeroTarjeta()} ha sido generado con éxito. Monto: $${contrato.getMonto()}`;
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
