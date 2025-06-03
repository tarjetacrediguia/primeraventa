// src/application/ports/VerazPort.ts

export interface VerazPort {
    checkClienteStatus(dni: string): Promise<{
        status: 'aprobado' | 'rechazado' | 'pendiente';
        score: number;
        lastUpdated: Date;
    }>;
    getClienteDetails(dni: string): Promise<{
        dni: string;
        nombreCompleto: string;
        historialCrediticio: {
            fecha: Date;
            entidad: string;
            resultado: 'aprobado' | 'rechazado';
            monto?: number;
        }[];
        deudasActivas: number;
        ingresosDeclarados: number;
    }>;
    generateCreditReport(dni: string): Promise<Buffer>;
}