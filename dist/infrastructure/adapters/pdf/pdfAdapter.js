"use strict";
//src/infrastructure/adapters/pdf/pdfAdapter.ts	
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfAdapter = void 0;
/**
 * MÓDULO: Adaptador de Generación de PDFs
 *
 * Este archivo implementa el adaptador para la generación y gestión de documentos PDF
 * en el sistema, utilizando la librería PDFKit para crear documentos profesionales.
 *
 * Responsabilidades:
 * - Generar PDFs de contratos con plantillas personalizables
 * - Crear reportes en formato PDF
 * - Gestionar el almacenamiento y recuperación de PDFs
 * - Proporcionar funcionalidades CRUD para documentos PDF
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
const pdfkit_1 = __importDefault(require("pdfkit"));
const buffer_1 = require("buffer");
/**
 * Adaptador que implementa la generación y gestión de documentos PDF.
 * Proporciona métodos para crear contratos, reportes y gestionar documentos PDF
 * utilizando plantillas configurables desde variables de entorno.
 */
class PdfAdapter {
    /**
     * Genera un PDF utilizando una plantilla específica y datos proporcionados.
     *
     * @param data - Datos a incluir en el PDF generado.
     * @param templateName - Nombre de la plantilla a utilizar para la generación.
     * @returns Promise<Buffer> - Buffer conteniendo el PDF generado.
     */
    generatePdf(data, templateName) {
        throw new Error("Method not implemented.");
    }
    /**
     * Obtiene un PDF almacenado por su ID único.
     *
     * @param id - ID único del PDF a recuperar.
     * @returns Promise<Buffer | null> - Buffer del PDF encontrado o null si no existe.
     */
    getPdfById(id) {
        throw new Error("Method not implemented.");
    }
    /**
     * Elimina un PDF del sistema por su ID.
     *
     * @param id - ID del PDF a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    deletePdf(id) {
        throw new Error("Method not implemented.");
    }
    /**
     * Actualiza un PDF existente con nuevos datos.
     *
     * @param id - ID del PDF a actualizar.
     * @param data - Nuevos datos para el PDF.
     * @returns Promise<Buffer> - Buffer del PDF actualizado.
     */
    updatePdf(id, data) {
        throw new Error("Method not implemented.");
    }
    /*
    async generateContractPdf(contractData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers: any[] = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });
        
        // Generar contenido del contrato
        doc.fontSize(20).text('CONTRATO DE PRÉSTAMO', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Número de contrato: ${contractData.contrato.id}`);
        doc.text(`Fecha: ${new Date(contractData.contrato.fechaGeneracion).toLocaleDateString()}`);
        doc.text(`Monto: $${contractData.contrato.monto.toFixed(2)}`);
        doc.text(`Cliente: ${contractData.solicitud.nombreCompleto} ${contractData.solicitud.apellido}`);
        doc.text(`DNI: ${contractData.solicitud.dni}`);
        doc.moveDown();
        doc.text('Términos y condiciones...');
        
        doc.end();
      } catch (error) {
        reject(new Error('Error generando PDF: ' + error));
      }
    });
  }
    */
    /**
     * Genera un PDF de contrato utilizando plantillas configurables desde variables de entorno.
     * Reemplaza marcadores en la plantilla con datos reales del contrato y solicitud.
     *
     * @param contractData - Objeto con datos del contrato y solicitud que incluye:
     *   - contrato: Información del contrato (id, fechaGeneracion, monto, numeroCuenta, numeroTarjeta)
     *   - solicitud: Información del cliente (nombreCompleto, apellido, dni)
     * @returns Promise<Buffer> - Buffer conteniendo el PDF del contrato generado.
     */
    generateContractPdf(contractData) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    const doc = new pdfkit_1.default();
                    const buffers = [];
                    doc.on('data', buffers.push.bind(buffers));
                    doc.on('end', () => {
                        const pdfBuffer = buffer_1.Buffer.concat(buffers);
                        resolve(pdfBuffer);
                    });
                    // Obtener plantilla de contrato desde variables de entorno
                    const contractTitle = process.env.CONTRACT_TITLE || '';
                    const contractBody = process.env.CONTRACT_BODY || '';
                    // Preparar datos
                    const fechaGeneracion = new Date(contractData.contrato.fechaGeneracion);
                    const nombreCompleto = `${contractData.solicitud.nombreCompleto} ${contractData.solicitud.apellido}`;
                    // Reemplazar marcadores
                    const formattedBody = contractBody
                        .replace(/<NOMBRE_COMPLETO>/g, nombreCompleto)
                        .replace(/<DNI>/g, contractData.solicitud.dni)
                        .replace(/<MONTO>/g, contractData.contrato.monto.toFixed(2))
                        .replace(/<NUMERO_CUENTA>/g, contractData.contrato.numeroCuenta || '')
                        .replace(/<NUMERO_TARJETA>/g, contractData.contrato.numeroTarjeta || '')
                        .replace(/<DIA>/g, fechaGeneracion.getDate().toString())
                        .replace(/<MES>/g, (fechaGeneracion.getMonth() + 1).toString())
                        .replace(/<AÑO>/g, fechaGeneracion.getFullYear().toString());
                    // Generar contenido
                    doc.fontSize(16).text(contractTitle, { align: 'center' });
                    doc.moveDown();
                    doc.fontSize(10).text(formattedBody, {
                        align: 'left',
                        indent: 30,
                        lineGap: 5
                    });
                    doc.end();
                }
                catch (error) {
                    reject(new Error('Error generando PDF: ' + error));
                }
            });
        });
    }
    /**
     * Genera un PDF de reporte con los datos proporcionados.
     *
     * @param reportData - Datos del reporte a incluir en el PDF.
     * @returns Promise<Buffer> - Buffer conteniendo el PDF del reporte generado.
     */
    generateReportPdf(reportData) {
        throw new Error("Method not implemented.");
    }
}
exports.PdfAdapter = PdfAdapter;
