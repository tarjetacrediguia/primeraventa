// src/application/ports/VerazPort.ts

/**
 * MÓDULO: Puerto de Integración con Veraz
 *
 * Este módulo define la interfaz para el puerto de integración con Veraz que permite
 * consultar información crediticia y generar reportes de clientes.
 *
 * RESPONSABILIDADES:
 * - Consultar el estado crediticio de clientes
 * - Obtener detalles del historial crediticio
 * - Generar reportes de crédito
 * - Integrar con servicios externos de información crediticia
 */

/**
 * Puerto para operaciones de integración con Veraz.
 *
 * Esta interfaz define los métodos necesarios para interactuar con
 * servicios de información crediticia externos.
 */
export interface VerazPort {
    /**
     * Verifica el estado crediticio de un cliente por DNI.
     *
     * @param dni - DNI del cliente a consultar
     * @returns Promise<{ status: 'aprobado' | 'rechazado' | 'pendiente'; score: number; lastUpdated: Date; motivo?: string; }> - Estado crediticio del cliente
     * @throws Error si el DNI no es válido o el servicio no está disponible
     */
    checkClienteStatus(dni: string): Promise<{
        status: 'aprobado' | 'rechazado' | 'pendiente';
        score: number;
        lastUpdated: Date;
        motivo?: string;
    }>;

    /**
     * Obtiene detalles completos del historial crediticio de un cliente.
     *
     * @param dni - DNI del cliente
     * @returns Promise<{ dni: string; nombreCompleto: string; historialCrediticio: { fecha: Date; entidad: string; resultado: 'aprobado' | 'rechazado'; monto?: number; }[]; deudasActivas: number; ingresosDeclarados: number; }> - Detalles crediticios del cliente
     * @throws Error si el DNI no es válido o no se encuentra información
     */
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

    /**
     * Genera un reporte de crédito completo para un cliente.
     *
     * @param dni - DNI del cliente
     * @returns Promise<Buffer> - Reporte de crédito como PDF
     * @throws Error si el DNI no es válido o no se puede generar el reporte
     */
    generateCreditReport(dni: string): Promise<Buffer>;
}
