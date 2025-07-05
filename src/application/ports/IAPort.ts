// src/application/ports/IAPort.ts

/**
 * MÓDULO: Puerto de Inteligencia Artificial
 *
 * Este módulo define la interfaz para el puerto de inteligencia artificial que permite
 * integrar servicios de IA para análisis de documentos, evaluación de riesgos y predicciones.
 *
 * RESPONSABILIDADES:
 * - Analizar documentos automáticamente
 * - Generar perfiles de riesgo de clientes
 * - Predecir comportamientos de pago
 * - Proporcionar análisis inteligente para decisiones
 */

/**
 * Puerto para operaciones de inteligencia artificial.
 *
 * Esta interfaz define los métodos necesarios para integrar servicios de IA
 * en el sistema de análisis y evaluación.
 */
export interface IAPort {
    /**
     * Analiza un documento utilizando inteligencia artificial.
     *
     * @param document - Documento a analizar como buffer
     * @returns Promise<{ status: 'aprobado' | 'rechazado' | 'revision', score: number, details: any }> - Resultado del análisis
     * @throws Error si el documento no es válido o el servicio de IA no está disponible
     */
    analyzeDocument(document: Buffer): Promise<{ 
        status: 'aprobado' | 'rechazado' | 'revision', 
        score: number,
        details: any 
    }>;

    /**
     * Genera un perfil de riesgo para un cliente basado en sus datos.
     *
     * @param clientData - Datos del cliente para análisis
     * @returns Promise<{ riskLevel: 'bajo' | 'medio' | 'alto', reasons: string[] }> - Perfil de riesgo generado
     * @throws Error si los datos del cliente son insuficientes o inválidos
     */
    generateRiskProfile(clientData: any): Promise<{
        riskLevel: 'bajo' | 'medio' | 'alto',
        reasons: string[]
    }>;

    /**
     * Predice el comportamiento de pago basado en datos del contrato.
     *
     * @param contractData - Datos del contrato para análisis
     * @returns Promise<{ defaultProbability: number, paymentProjection: any[] }> - Predicción de comportamiento de pago
     * @throws Error si los datos del contrato son insuficientes o inválidos
     */
    predictPaymentBehavior(contractData: any): Promise<{
        defaultProbability: number,
        paymentProjection: any[]
    }>;
}
