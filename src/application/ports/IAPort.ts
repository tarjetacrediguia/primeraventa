// src/application/ports/IAPort.ts

export interface IAPort {
    analyzeDocument(document: Buffer): Promise<{ 
        status: 'aprobado' | 'rechazado' | 'revision', 
        score: number,
        details: any 
    }>;
    generateRiskProfile(clientData: any): Promise<{
        riskLevel: 'bajo' | 'medio' | 'alto',
        reasons: string[]
    }>;
    predictPaymentBehavior(contractData: any): Promise<{
        defaultProbability: number,
        paymentProjection: any[]
    }>;
}