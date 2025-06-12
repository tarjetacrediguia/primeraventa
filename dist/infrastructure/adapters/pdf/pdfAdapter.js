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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfAdapter = void 0;
//src/infrastructure/adapters/pdf/pdfAdapter.ts	
const pdfkit_1 = __importDefault(require("pdfkit"));
const buffer_1 = require("buffer");
class PdfAdapter {
    generatePdf(data, templateName) {
        throw new Error("Method not implemented.");
    }
    getPdfById(id) {
        throw new Error("Method not implemented.");
    }
    deletePdf(id) {
        throw new Error("Method not implemented.");
    }
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
    generateReportPdf(reportData) {
        throw new Error("Method not implemented.");
    }
}
exports.PdfAdapter = PdfAdapter;
