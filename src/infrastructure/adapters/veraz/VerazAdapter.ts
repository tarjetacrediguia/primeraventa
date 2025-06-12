//src/infraestructure/adapters/veraz/VerazAdapter.ts

import { VerazPort } from "../../../application/ports/VerazPort";

export class VerazAdapter implements VerazPort {
    checkClienteStatus(dni: string): Promise<{ status: "aprobado" | "rechazado" | "pendiente"; score: number; lastUpdated: Date; }> {
        //throw new Error("Method not implemented.");
        console.log(`Consultando Veraz para el DNI: ${dni}`);
        return new Promise((resolve) => {
            // Simulación de una llamada a un servicio externo
            setTimeout(() => {
                if (dni == "225577") {
                    resolve({
                        status: "aprobado",
                        score: 750,
                        lastUpdated: new Date()
                    });
                } else if (dni == "87654321") {
                    resolve({
                        status: "rechazado",
                        score: 300,
                        lastUpdated: new Date()
                    });
                } else {
                    resolve({
                        status: "pendiente",
                        score: 500,
                        lastUpdated: new Date()
                    });
                }
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