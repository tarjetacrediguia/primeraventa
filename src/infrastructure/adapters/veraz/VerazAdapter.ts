//src/infraestructure/adapters/veraz/VerazAdapter.ts

import { VerazPort } from "../../../application/ports/VerazPort";

export class VerazAdapter implements VerazPort {
    checkClienteStatus(dni: string): Promise<{ status: "aprobado" | "rechazado" | "pendiente"; score: number; lastUpdated: Date; motivo?: string; }> {
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Convertir DNI a string para asegurar el correcto manejo
                const dniString = dni.toString();
                const lastDigit = dniString.charAt(dniString.length - 1);
                
                let status: "aprobado" | "rechazado" | "pendiente";
                let score: number;
                let motivo: string | undefined;

                // Asignar estado según el último dígito
                if (dniString === "225577") {
                    status = "aprobado";
                    score = 750;
                    motivo = "Aprobación automática por Veraz";
                } else if (dniString === "87654321") {
                    status = "rechazado";
                    score = 300;
                    motivo = "Rechazo automático por Veraz";
                } else {
                    switch(lastDigit) {
                        case '7':
                            status = "aprobado";
                            score = 750;
                            break;
                        case '8':
                            status = "rechazado";
                            score = 300;
                            break;
                        case '9':
                            status = "pendiente";
                            score = 500;
                            break;
                        default:
                            status = "pendiente";
                            score = 500;
                    }
                }

                resolve({
                    status,
                    score,
                    lastUpdated: new Date(),
                    motivo
                });
            }, 1000);
        });
    }
    getClienteDetails(dni: string): Promise<{ dni: string; nombreCompleto: string; historialCrediticio: { fecha: Date; entidad: string; resultado: "aprobado" | "rechazado"; monto?: number; }[]; deudasActivas: number; ingresosDeclarados: number; }> {
        throw new Error("Method not implemented.");
    }
    generateCreditReport(dni: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
}
