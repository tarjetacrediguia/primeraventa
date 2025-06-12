//src/infrastructure/adapters/pdf/pdfAdapter.ts	
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { Buffer } from 'buffer';
import { PdfPort } from "../../../application/ports/PdfPort";

export class PdfAdapter implements PdfPort{
    generatePdf(data: any, templateName: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
    getPdfById(id: string): Promise<Buffer | null> {
        throw new Error("Method not implemented.");
    }
    deletePdf(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updatePdf(id: string, data: any): Promise<Buffer> {
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
            } catch (error) {
                reject(new Error('Error generando PDF: ' + error));
            }
        });
    }
    generateReportPdf(reportData: any): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
}
    