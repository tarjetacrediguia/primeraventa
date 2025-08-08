//src/application/ports/SimulacionPort.ts


export interface SimulacionPort {
    /**     * Simula las cuotas de un crédito basado en los datos proporcionados.
     * @param datos - Objeto que contiene los datos necesarios para la simulación.
     * @return Una promesa que resuelve con el resultado de la simulación.
     */
    simularCuotas(datos: any): Promise<any>;
}