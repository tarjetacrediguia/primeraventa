"use strict";
//src/infraestructure/adapters/veraz/VerazAdapter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerazAdapter = void 0;
class VerazAdapter {
    checkClienteStatus(dni) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Convertir DNI a string para asegurar el correcto manejo
                const dniString = dni.toString();
                const lastDigit = dniString.charAt(dniString.length - 1);
                let status;
                let score;
                let motivo;
                // Asignar estado según el último dígito
                if (dniString === "225577") {
                    status = "aprobado";
                    score = 750;
                    motivo = "Aprobación automática por Veraz";
                }
                else if (dniString === "87654321") {
                    status = "rechazado";
                    score = 300;
                    motivo = "Rechazo automático por Veraz";
                }
                else {
                    switch (lastDigit) {
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
    getClienteDetails(dni) {
        throw new Error("Method not implemented.");
    }
    generateCreditReport(dni) {
        throw new Error("Method not implemented.");
    }
}
exports.VerazAdapter = VerazAdapter;
