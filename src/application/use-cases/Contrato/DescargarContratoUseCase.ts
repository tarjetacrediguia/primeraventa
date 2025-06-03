// src/application/use-cases/Contrato/DescargarContratoUseCase.ts
import { ContratoRepositoryPort } from "../../ports/ContratoRepositoryPort";
import { PdfPort } from "../../ports/PdfPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";

export class DescargarContratoUseCase {
    constructor(
        private readonly contratoRepository: ContratoRepositoryPort,
        private readonly pdfService: PdfPort,
        private readonly solicitudRepository: SolicitudFormalRepositoryPort
    ) {}

    async execute(contratoId: string, dniSolicitante: string): Promise<Buffer> {
        // 1. Obtener contrato
        const contrato = await this.contratoRepository.getContratoById(contratoId);
        if (!contrato) {
            throw new Error(`Contrato no encontrado: ${contratoId}`);
        }

        // 2. Obtener solicitud asociada
        const solicitud = await this.solicitudRepository.getSolicitudFormalById(contrato.getSolicitudFormalId());
        if (!solicitud) {
            throw new Error(`Solicitud formal asociada no encontrada`);
        }

        // 3. Verificar que el DNI del solicitante coincide
        if (solicitud.getDni() !== dniSolicitante) {
            throw new Error("No tiene permiso para acceder a este contrato");
        }

        try {
            // 4. Generar PDF
            return await this.pdfService.generateContractPdf({
                contrato: contrato.toPlainObject(),
                solicitud: solicitud.toPlainObject()
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error generando PDF: " + error.message);
            } else {
                throw new Error("Error generando PDF: " + String(error));
            }
        }
    }
}