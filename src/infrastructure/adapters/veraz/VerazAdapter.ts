//src/infraestructure/adapters/veraz/VerazAdapter.ts

import { VerazPort } from "../../../application/ports/VerazPort";

export class VerazAdapter implements VerazPort {
    checkClienteStatus(dni: string): Promise<{ status: "aprobado" | "rechazado" | "pendiente"; score: number; lastUpdated: Date; }> {
        throw new Error("Method not implemented.");
    }
    getClienteDetails(dni: string): Promise<{ dni: string; nombreCompleto: string; historialCrediticio: { fecha: Date; entidad: string; resultado: "aprobado" | "rechazado"; monto?: number; }[]; deudasActivas: number; ingresosDeclarados: number; }> {
        throw new Error("Method not implemented.");
    }
    generateCreditReport(dni: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
}