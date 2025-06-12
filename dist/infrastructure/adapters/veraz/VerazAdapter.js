"use strict";
//src/infraestructure/adapters/veraz/VerazAdapter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerazAdapter = void 0;
class VerazAdapter {
    checkClienteStatus(dni) {
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
                }
                else if (dni == "87654321") {
                    resolve({
                        status: "rechazado",
                        score: 300,
                        lastUpdated: new Date()
                    });
                }
                else {
                    resolve({
                        status: "pendiente",
                        score: 500,
                        lastUpdated: new Date()
                    });
                }
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
