"use strict";
//src/infrastructure/adapters/pdf/pdfAdapter.ts	
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.PdfAdapter = void 0;
const buffer_1 = require("buffer");
const puppeteer = __importStar(require("puppeteer"));
const pdf_lib_1 = require("pdf-lib");
const paginas_1 = require("../../templates/contrato/paginas");
/**
 * Adaptador que implementa la generación y gestión de documentos PDF.
 * Proporciona métodos para crear contratos, reportes y gestionar documentos PDF
 * utilizando plantillas configurables desde variables de entorno.
 */
class PdfAdapter {
    generateContractPdf(contractData) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const pagesHtml = this.getPagesWithReplacements(contractData);
            const pdfBuffers = [];
            for (const html of pagesHtml) {
                const page = yield browser.newPage();
                yield page.setContent(html, {
                    waitUntil: 'networkidle0',
                    timeout: 60000
                });
                const pdfBuffer = yield page.pdf({
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
                yield page.close();
            }
            yield browser.close();
            return this.mergePdfs(pdfBuffers);
        });
    }
    /**
 * Genera un PDF de reporte con los datos proporcionados.
 *
 * @param reportData - Datos del reporte a incluir en el PDF.
 * @returns Promise<Buffer> - Buffer conteniendo el PDF del reporte generado.
 */
    generateReportPdf(reportData) {
        throw new Error('Method not implemented.');
    }
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
    mergePdfs(pdfs) {
        return __awaiter(this, void 0, void 0, function* () {
            const mergedPdf = yield pdf_lib_1.PDFDocument.create();
            for (const pdfBytes of pdfs) {
                const pdf = yield pdf_lib_1.PDFDocument.load(pdfBytes);
                const pages = yield mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            }
            const mergedPdfBytes = yield mergedPdf.save();
            return buffer_1.Buffer.from(mergedPdfBytes);
        });
    }
    getPagesWithReplacements(contractData) {
        const replacements = this.createReplacements(contractData);
        return [
            paginas_1.paginas.pagina1, paginas_1.paginas.pagina2, paginas_1.paginas.pagina3,
            paginas_1.paginas.pagina4, paginas_1.paginas.pagina5, paginas_1.paginas.pagina6,
            paginas_1.paginas.pagina7, paginas_1.paginas.pagina8, paginas_1.paginas.pagina9,
            paginas_1.paginas.pagina10
        ].map(html => this.applyReplacements(html, replacements));
    }
    applyReplacements(html, replacements) {
        return Object.entries(replacements).reduce((acc, [key, value]) => {
            return acc.replace(new RegExp(this.escapeRegExp(key), 'g'), value.toString());
        }, html);
    }
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    createReplacements(contractData) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        const { contrato, solicitud } = contractData;
        const formatDate = (dateString) => {
            if (!dateString)
                return '';
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
            '{{SOLICITANTE_NOMBRE}}': `${solicitud.nombreCompleto} ${solicitud.apellido}`,
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
            '{{SUELDO}}': ((_a = solicitud.importeNeto) === null || _a === void 0 ? void 0 : _a.toString()) || '',
            // Página 2 (Contrato)
            '{{TITULAR_NOMBRE}}': `${solicitud.nombreCompleto} ${solicitud.apellido}`,
            '{{TITULAR_DNI}}': contrato.clienteDni || '',
            '{{TITULAR_CUIT}}': contrato.clienteCuitOcuil || '',
            '{{TITULAR_DOMICILIO}}': [
                contrato.clienteDomicilioCalle,
                contrato.clienteDomicilioNumero,
                contrato.clienteDomicilioLocalidad
            ].filter(Boolean).join(', '),
            // Páginas 3-10 (Usar mismos datos en múltiples páginas)
            '{{TEA_FINANCIACION}}': ((_b = contrato.tasasTeaCtfFinanciacion) === null || _b === void 0 ? void 0 : _b.toString()) || '84.40%',
            '{{TNA_COMPENSATORIOS}}': ((_c = contrato.tasasTnaCompensatoriosFinanciacion) === null || _c === void 0 ? void 0 : _c.toString()) || '62.78%',
            '{{TNA_PUNITORIOS}}': ((_d = contrato.tasasTnaPunitorios) === null || _d === void 0 ? void 0 : _d.toString()) || '31.39%',
            '{{COMISION_RENOVACION}}': ((_e = contrato.tasasComisionRenovacionAnual) === null || _e === void 0 ? void 0 : _e.toString()) || '3300',
            '{{COMISION_MANTENIMIENTO}}': ((_f = contrato.tasasComisionMantenimiento) === null || _f === void 0 ? void 0 : _f.toString()) || '650',
            '{{COMISION_REPOSICION}}': ((_g = contrato.tasasComisionReposicionPlastico) === null || _g === void 0 ? void 0 : _g.toString()) || '1026',
            '{{ATRASO_05_31}}': ((_h = contrato.tasasAtraso05_31Dias) === null || _h === void 0 ? void 0 : _h.toString()) || '380',
            '{{ATRASO_32_60}}': ((_j = contrato.tasasAtraso32_60Dias) === null || _j === void 0 ? void 0 : _j.toString()) || '649',
            '{{ATRASO_61_90}}': ((_k = contrato.tasasAtraso61_90Dias) === null || _k === void 0 ? void 0 : _k.toString()) || '742',
            '{{PAGO_FACIL}}': ((_l = contrato.tasasPagoFacil) === null || _l === void 0 ? void 0 : _l.toString()) || '99',
            '{{PLATINIUM_TEA}}': ((_m = contrato.tasasPlatiniumTeaCtfFinanciacion) === null || _m === void 0 ? void 0 : _m.toString()) || '84.40',
            '{{PLATINIUM_TNA_COMPENSATORIOS}}': ((_o = contrato.tasasPlatiniumTnaCompensatoriosFinanciacion) === null || _o === void 0 ? void 0 : _o.toString()) || '62.78',
            '{{PLATINIUM_TNA_PUNITORIOS}}': ((_p = contrato.tasasPlatiniumTnaPunitorios) === null || _p === void 0 ? void 0 : _p.toString()) || '31.39',
            '{{PLATINIUM_COMISION_RENOVACION}}': ((_q = contrato.tasasPlatiniumComisionRenovacionAnual) === null || _q === void 0 ? void 0 : _q.toString()) || '3300',
            '{{PLATINIUM_COMISION_MANTENIMIENTO}}': ((_r = contrato.tasasPlatiniumComisionMantenimiento) === null || _r === void 0 ? void 0 : _r.toString()) || '650',
            '{{PLATINIUM_COMISION_REPOSICION}}': ((_s = contrato.tasasPlatiniumComisionReposicionPlastico) === null || _s === void 0 ? void 0 : _s.toString()) || '1026',
            '{{PLATINIUM_ATRASO_05_31}}': ((_t = contrato.tasasPlatiniumAtraso05_31Dias) === null || _t === void 0 ? void 0 : _t.toString()) || '380',
            '{{PLATINIUM_ATRASO_32_60}}': ((_u = contrato.tasasPlatiniumAtraso32_60Dias) === null || _u === void 0 ? void 0 : _u.toString()) || '649',
            '{{PLATINIUM_ATRASO_61_90}}': ((_v = contrato.tasasPlatiniumAtraso61_90Dias) === null || _v === void 0 ? void 0 : _v.toString()) || '742',
            '{{PLATINIUM_PAGO_FACIL}}': ((_w = contrato.tasasPlatiniumPagoFacil) === null || _w === void 0 ? void 0 : _w.toString()) || '99',
        };
    }
}
exports.PdfAdapter = PdfAdapter;
