// src/application/use-cases/Contrato/DescargarContratoUseCase.ts

/**
 * MÓDULO: Caso de Uso - Descargar Contrato
 *
 * Este módulo implementa la lógica de negocio para la descarga del PDF de un contrato,
 * validando la identidad del solicitante y generando el documento a partir de los datos
 * del contrato y la solicitud formal asociada.
 *
 * RESPONSABILIDADES:
 * - Validar la existencia del contrato y la solicitud formal asociada
 * - Verificar la identidad del solicitante mediante el DNI
 * - Generar el PDF del contrato con los datos correspondientes
 * - Manejar errores y restricciones de acceso
 */

import { ContratoRepositoryPort } from "../../ports/ContratoRepositoryPort";
import { PdfPort } from "../../ports/PdfPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";

/**
 * Caso de uso para la descarga del PDF de un contrato.
 * 
 * Esta clase implementa la lógica para validar el acceso, obtener los datos necesarios
 * y generar el PDF del contrato para su descarga por parte del solicitante.
 */
export class DescargarContratoUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param contratoRepository - Puerto para operaciones de contratos
     * @param pdfService - Puerto para generación de PDF
     * @param solicitudRepository - Puerto para operaciones de solicitudes formales
     */
    constructor(
        private readonly contratoRepository: ContratoRepositoryPort,
        private readonly pdfService: PdfPort,
        private readonly solicitudRepository: SolicitudFormalRepositoryPort
    ) {}

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
        solicitud: {
            ...solicitud.toPlainObject(),
            nombreCompleto: solicitud.getNombreCompleto(),
            apellido: solicitud.getApellido(),
            dni: solicitud.getDni()
        }
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
