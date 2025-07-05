"use strict";
// src/application/use-cases/Contrato/DescargarContratoUseCase.ts
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
exports.DescargarContratoUseCase = void 0;
/**
 * Caso de uso para la descarga del PDF de un contrato.
 *
 * Esta clase implementa la lógica para validar el acceso, obtener los datos necesarios
 * y generar el PDF del contrato para su descarga por parte del solicitante.
 */
class DescargarContratoUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param contratoRepository - Puerto para operaciones de contratos
     * @param pdfService - Puerto para generación de PDF
     * @param solicitudRepository - Puerto para operaciones de solicitudes formales
     */
    constructor(contratoRepository, pdfService, solicitudRepository) {
        this.contratoRepository = contratoRepository;
        this.pdfService = pdfService;
        this.solicitudRepository = solicitudRepository;
    }
    /**
     * Ejecuta la descarga del PDF de un contrato, validando el acceso por DNI.
     *
     * Este método valida la existencia del contrato y la solicitud asociada, verifica
     * la identidad del solicitante y genera el PDF para su descarga.
     *
     * @param contratoId - ID del contrato a descargar
     * @param dniSolicitante - DNI del solicitante que solicita la descarga
     * @returns Promise<Buffer> - PDF generado del contrato
     * @throws Error - Si el contrato, la solicitud o el acceso no son válidos
     */
    execute(contratoId, dniSolicitante) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Obtener contrato
            const contrato = yield this.contratoRepository.getContratoById(contratoId);
            if (!contrato) {
                throw new Error(`Contrato no encontrado: ${contratoId}`);
            }
            // 2. Obtener solicitud asociada
            const solicitud = yield this.solicitudRepository.getSolicitudFormalById(contrato.getSolicitudFormalId());
            if (!solicitud) {
                throw new Error(`Solicitud formal asociada no encontrada`);
            }
            // 3. Verificar que el DNI del solicitante coincide
            if (solicitud.getDni() !== dniSolicitante) {
                throw new Error("No tiene permiso para acceder a este contrato");
            }
            try {
                // 4. Generar PDF
                return yield this.pdfService.generateContractPdf({
                    contrato: contrato.toPlainObject(),
                    solicitud: Object.assign(Object.assign({}, solicitud.toPlainObject()), { nombreCompleto: solicitud.getNombreCompleto(), apellido: solicitud.getApellido(), dni: solicitud.getDni() })
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error("Error generando PDF: " + error.message);
                }
                else {
                    throw new Error("Error generando PDF: " + String(error));
                }
            }
        });
    }
}
exports.DescargarContratoUseCase = DescargarContratoUseCase;
