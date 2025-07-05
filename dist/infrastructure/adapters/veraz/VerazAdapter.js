"use strict";
//src/infraestructure/adapters/veraz/VerazAdapter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerazAdapter = void 0;
/**
 * Adaptador que implementa la integración con el sistema Veraz para verificación crediticia.
 * Proporciona métodos para consultar el estado crediticio de clientes, obtener detalles
 * del historial crediticio y generar reportes de crédito.
 */
class VerazAdapter {
    /**
     * Verifica el estado crediticio de un cliente mediante su DNI.
     * Simula una consulta al sistema Veraz con un delay de 1 segundo.
     *
     * @param dni - DNI del cliente a verificar (string o number).
     * @returns Promise<object> - Objeto con el estado crediticio que incluye:
     *   - status: "aprobado" | "rechazado" | "pendiente"
     *   - score: Puntuación crediticia (300-750)
     *   - lastUpdated: Fecha de última actualización
     *   - motivo: Razón del estado (opcional)
     */
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
    /**
     * Obtiene los detalles completos del historial crediticio de un cliente.
     * Incluye información sobre préstamos anteriores, deudas activas e ingresos declarados.
     *
     * @param dni - DNI del cliente del cual obtener los detalles.
     * @returns Promise<object> - Objeto con los detalles del cliente que incluye:
     *   - dni: DNI del cliente
     *   - nombreCompleto: Nombre completo del cliente
     *   - historialCrediticio: Array de operaciones crediticias previas
     *   - deudasActivas: Cantidad de deudas activas
     *   - ingresosDeclarados: Ingresos declarados por el cliente
     */
    getClienteDetails(dni) {
        throw new Error("Method not implemented.");
    }
    /**
     * Genera un reporte de crédito en formato PDF para un cliente específico.
     * El reporte incluye toda la información crediticia disponible en el sistema Veraz.
     *
     * @param dni - DNI del cliente para el cual generar el reporte.
     * @returns Promise<Buffer> - Buffer conteniendo el reporte PDF generado.
     */
    generateCreditReport(dni) {
        throw new Error("Method not implemented.");
    }
}
exports.VerazAdapter = VerazAdapter;
