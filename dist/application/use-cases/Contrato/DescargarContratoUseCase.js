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
exports.DescargarContratoUseCase = void 0;
class DescargarContratoUseCase {
    constructor(contratoRepository, pdfService, solicitudRepository) {
        this.contratoRepository = contratoRepository;
        this.pdfService = pdfService;
        this.solicitudRepository = solicitudRepository;
    }
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
