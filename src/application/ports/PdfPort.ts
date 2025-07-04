// src/application/ports/PdfPort.ts

export interface PdfPort {
    generatePdf(data: any, templateName: string): Promise<Buffer>;
    getPdfById(id: string): Promise<Buffer | null>;
    deletePdf(id: string): Promise<void>;
    updatePdf(id: string, data: any): Promise<Buffer>;
    generateContractPdf(contractData: any): Promise<Buffer>;
    generateReportPdf(reportData: any): Promise<Buffer>;
}
