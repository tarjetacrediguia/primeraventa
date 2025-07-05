// src/application/ports/PdfPort.ts

/**
 * MÓDULO: Puerto de Generación de PDF
 *
 * Este módulo define la interfaz para el puerto de generación de PDF que permite
 * crear, gestionar y manipular documentos PDF en el sistema.
 *
 * RESPONSABILIDADES:
 * - Generar documentos PDF a partir de datos y plantillas
 * - Gestionar el almacenamiento y recuperación de PDFs
 * - Proporcionar funcionalidades específicas para contratos y reportes
 */

/**
 * Puerto para operaciones de generación y gestión de PDFs.
 *
 * Esta interfaz define los métodos necesarios para crear, almacenar
 * y gestionar documentos PDF en el sistema.
 */
export interface PdfPort {
    /**
     * Genera un PDF a partir de datos y una plantilla específica.
     *
     * @param data - Datos para generar el PDF
     * @param templateName - Nombre de la plantilla a utilizar
     * @returns Promise<Buffer> - PDF generado como buffer
     * @throws Error si la plantilla no existe o los datos son inválidos
     */
    generatePdf(data: any, templateName: string): Promise<Buffer>;

    /**
     * Obtiene un PDF almacenado por su identificador.
     *
     * @param id - ID del PDF a recuperar
     * @returns Promise<Buffer | null> - PDF como buffer o null si no existe
     */
    getPdfById(id: string): Promise<Buffer | null>;

    /**
     * Elimina un PDF almacenado del sistema.
     *
     * @param id - ID del PDF a eliminar
     * @returns Promise<void>
     * @throws Error si el PDF no existe
     */
    deletePdf(id: string): Promise<void>;

    /**
     * Actualiza un PDF existente con nuevos datos.
     *
     * @param id - ID del PDF a actualizar
     * @param data - Nuevos datos para el PDF
     * @returns Promise<Buffer> - PDF actualizado como buffer
     * @throws Error si el PDF no existe o los datos son inválidos
     */
    updatePdf(id: string, data: any): Promise<Buffer>;

    /**
     * Genera un PDF específico para contratos.
     *
     * @param contractData - Datos del contrato
     * @returns Promise<Buffer> - PDF del contrato como buffer
     * @throws Error si los datos del contrato son inválidos
     */
    generateContractPdf(contractData: any): Promise<Buffer>;

    /**
     * Genera un PDF específico para reportes.
     *
     * @param reportData - Datos del reporte
     * @returns Promise<Buffer> - PDF del reporte como buffer
     * @throws Error si los datos del reporte son inválidos
     */
    generateReportPdf(reportData: any): Promise<Buffer>;
}
