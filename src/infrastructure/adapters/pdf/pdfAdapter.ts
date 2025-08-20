//src/infrastructure/adapters/pdf/pdfAdapter.ts	

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

//import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
//import puppeteer from 'puppeteer';
import { PdfPort } from "../../../application/ports/PdfPort";
import { Browser } from 'puppeteer';
import * as puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import { paginas } from '../../templates/contrato/paginas';

/**
 * Adaptador que implementa la generación y gestión de documentos PDF.
 * Proporciona métodos para crear contratos, reportes y gestionar documentos PDF
 * utilizando plantillas configurables desde variables de entorno.
 */
export class PdfAdapter implements PdfPort{
    async generateContractPdf(contractData: any): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const pagesHtml = this.getPagesWithReplacements(contractData);
        const pdfBuffers: Uint8Array[] = [];

        for (const html of pagesHtml) {
            const page = await browser.newPage();
            await page.setContent(html, {
                waitUntil: 'networkidle0',
                timeout: 60000
            });
            
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                },
                preferCSSPageSize: true,
                timeout: 60000
            });
            
            pdfBuffers.push(pdfBuffer);
            await page.close();
        }

        await browser.close();
        return this.mergePdfs(pdfBuffers);
    }
        /**
     * Genera un PDF de reporte con los datos proporcionados.
     * 
     * @param reportData - Datos del reporte a incluir en el PDF.
     * @returns Promise<Buffer> - Buffer conteniendo el PDF del reporte generado.
     */
    generateReportPdf(reportData: any): Promise<Buffer> {
        throw new Error('Method not implemented.');
    }
    
    /**
     * Genera un PDF utilizando una plantilla específica y datos proporcionados.
     * 
     * @param data - Datos a incluir en el PDF generado.
     * @param templateName - Nombre de la plantilla a utilizar para la generación.
     * @returns Promise<Buffer> - Buffer conteniendo el PDF generado.
     */
    generatePdf(data: any, templateName: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
    
    /**
     * Obtiene un PDF almacenado por su ID único.
     * 
     * @param id - ID único del PDF a recuperar.
     * @returns Promise<Buffer | null> - Buffer del PDF encontrado o null si no existe.
     */
    getPdfById(id: string): Promise<Buffer | null> {
        throw new Error("Method not implemented.");
    }
    
    /**
     * Elimina un PDF del sistema por su ID.
     * 
     * @param id - ID del PDF a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    deletePdf(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    /**
     * Actualiza un PDF existente con nuevos datos.
     * 
     * @param id - ID del PDF a actualizar.
     * @param data - Nuevos datos para el PDF.
     * @returns Promise<Buffer> - Buffer del PDF actualizado.
     */
    updatePdf(id: string, data: any): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
 private async mergePdfs(pdfs: Uint8Array[]): Promise<Buffer> {
        const mergedPdf = await PDFDocument.create();
        
        for (const pdfBytes of pdfs) {
            const pdf = await PDFDocument.load(pdfBytes);
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => mergedPdf.addPage(page));
        }
        
        const mergedPdfBytes = await mergedPdf.save();
        return Buffer.from(mergedPdfBytes);
    }
        private getPagesWithReplacements(contractData: any): string[] {
        const replacements = this.createReplacements(contractData);
        return [
            paginas.pagina1, paginas.pagina2, paginas.pagina3,
            paginas.pagina4, paginas.pagina5, paginas.pagina6,
            paginas.pagina7, paginas.pagina8, paginas.pagina9,
            paginas.pagina10
        ].map(html => this.applyReplacements(html, replacements));
    }

    private applyReplacements(html: string, replacements: Record<string, string>): string {
        return Object.entries(replacements).reduce((acc, [key, value]) => {
            return acc.replace(new RegExp(this.escapeRegExp(key), 'g'), value.toString());
        }, html);
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private createReplacements(contractData: any): Record<string, string> {
        const { contrato, solicitudFormal } = contractData;
        const formatDate = (dateString: string) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        };

        return {
            '{{FECHA}}': formatDate(contrato.fechaGeneracion),
        '{{Nº_AUTORIZACIÓN}}': contrato.comercioNAutorizacion || '',
        '{{NOMBRE_DEL_COMERCIO}}': contrato.comercioNombre || '',
        '{{Nº_DE_CUENTA}}': contrato.numeroCuenta || '',
        '{{PRODUCTO}}': contrato.comercioProducto || '',
        '{{SUCURSAL_Nº}}': contrato.comercioSucursal || '',
        '{{SOLICITANTE_NOMBRE}}': `${solicitudFormal.nombreCompleto} ${solicitudFormal.apellido}`,
        '{{SOLICITANTE_SEXO}}': contrato.clienteSexo || '',
        '{{CUIL_CUIT}}': contrato.clienteCuitOcuil || '',
        '{{DNI}}': contrato.clienteDni || '',
        '{{FECHA_NACIMIENTO}}': formatDate(contrato.clienteFechaNacimiento),
        '{{ESTADO_CIVIL}}': contrato.clienteEstadoCivil || '',
        '{{NACIONALIDAD}}': contrato.clienteNacionalidad || '',
        '{{DOMICILIO_CALLE}}': contrato.clienteDomicilioCalle || '',
        '{{DOMICILIO_NUMERO}}': contrato.clienteDomicilioNumero || '',
        '{{DOMICILIO_PISO}}': contrato.clienteDomicilioPiso || '',
        '{{DOMICILIO_DPTO}}': contrato.clienteDomicilioDepartamento || '',
        '{{LOCALIDAD}}': contrato.clienteDomicilioLocalidad || '',
        '{{PROVINCIA}}': contrato.clienteDomicilioProvincia || '',
        '{{BARRIO}}': contrato.clienteDomicilioBarrio || '',
        '{{CODIGO_POSTAL}}': contrato.clienteDomicilioCodigoPostal || '',
        '{{EMAIL}}': contrato.clienteDomicilioCorreoElectronico || '',
        '{{TELEFONO_FIJO}}': contrato.clienteDomicilioTelefonoFijo || '',
        '{{TELEFONO_CELULAR}}': contrato.clienteDomicilioTelefonoCelular || '',
        '{{EMPRESA}}': contrato.clienteDatosLaboralesRazonSocial || '',
        '{{ACTIVIDAD}}': contrato.clienteDatosLaboralesActividad || '',
        '{{CUIT_EMPRESA}}': contrato.clienteDatosLaboralesCuit || '',
        '{{INGRESO}}': formatDate(contrato.clienteDatosLaboralesInicioActividades),
        '{{CARGO}}': contrato.clienteDatosLaboralesCargo || '',
        '{{SECTOR}}': contrato.clienteDatosLaboralesSector || '',
        '{{DOMICILIO_LEGAL}}': contrato.clienteDatosLaboralesDomicilioLegal || '',
        '{{SUELDO}}': solicitudFormal.importeNeto?.toString() || '',
        
        // Página 2 (Contrato)
        '{{TITULAR_NOMBRE}}': `${solicitudFormal.nombreCompleto} ${solicitudFormal.apellido}`,
        '{{TITULAR_DNI}}': contrato.clienteDni || '',
        '{{TITULAR_CUIT}}': contrato.clienteCuitOcuil || '',
        '{{TITULAR_DOMICILIO}}': [
            contrato.clienteDomicilioCalle,
            contrato.clienteDomicilioNumero,
            contrato.clienteDomicilioLocalidad
        ].filter(Boolean).join(', '),
        // Páginas 3-10 (Usar mismos datos en múltiples páginas)
        '{{TEA_FINANCIACION}}': contrato.tasasTeaCtfFinanciacion?.toString() || '84.40%',
        '{{TNA_COMPENSATORIOS}}': contrato.tasasTnaCompensatoriosFinanciacion?.toString() || '62.78%',
        '{{TNA_PUNITORIOS}}': contrato.tasasTnaPunitorios?.toString() || '31.39%',
        '{{COMISION_RENOVACION}}': contrato.tasasComisionRenovacionAnual?.toString() || '3300',
        '{{COMISION_MANTENIMIENTO}}': contrato.tasasComisionMantenimiento?.toString() || '650',
        '{{COMISION_REPOSICION}}': contrato.tasasComisionReposicionPlastico?.toString() || '1026',
        '{{ATRASO_05_31}}': contrato.tasasAtraso05_31Dias?.toString() || '380',
        '{{ATRASO_32_60}}': contrato.tasasAtraso32_60Dias?.toString() || '649',
        '{{ATRASO_61_90}}': contrato.tasasAtraso61_90Dias?.toString() || '742',
        '{{PAGO_FACIL}}': contrato.tasasPagoFacil?.toString() || '99',
        '{{PLATINIUM_TEA}}': contrato.tasasPlatiniumTeaCtfFinanciacion?.toString() || '84.40',
        '{{PLATINIUM_TNA_COMPENSATORIOS}}': contrato.tasasPlatiniumTnaCompensatoriosFinanciacion?.toString() || '62.78',
        '{{PLATINIUM_TNA_PUNITORIOS}}': contrato.tasasPlatiniumTnaPunitorios?.toString() || '31.39',
        '{{PLATINIUM_COMISION_RENOVACION}}': contrato.tasasPlatiniumComisionRenovacionAnual?.toString() || '3300',
        '{{PLATINIUM_COMISION_MANTENIMIENTO}}': contrato.tasasPlatiniumComisionMantenimiento?.toString() || '650',
        '{{PLATINIUM_COMISION_REPOSICION}}': contrato.tasasPlatiniumComisionReposicionPlastico?.toString() || '1026',
        '{{PLATINIUM_ATRASO_05_31}}': contrato.tasasPlatiniumAtraso05_31Dias?.toString() || '380',
        '{{PLATINIUM_ATRASO_32_60}}': contrato.tasasPlatiniumAtraso32_60Dias?.toString() || '649',
        '{{PLATINIUM_ATRASO_61_90}}': contrato.tasasPlatiniumAtraso61_90Dias?.toString() || '742',
        '{{PLATINIUM_PAGO_FACIL}}': contrato.tasasPlatiniumPagoFacil?.toString() || '99',

        };
    }
}
    
