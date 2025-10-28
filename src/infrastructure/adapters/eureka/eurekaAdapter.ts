//src/infrastructure/adapters/eureka/eurekaAdapter.ts


import { EurekaPort, SituacionPersonaResponse, PlanesDeCuotasResponse } from "../../../application/ports/EurekaPort";

export class EurekaAdapter implements EurekaPort {
  private readonly baseUrl = 'http://usuarios.crediguia.com.ar:31561/PV.svc';
  private readonly apiKey: string;

  constructor() {
    const apiKey = process.env.EUREKA_API_KEY;
    if (!apiKey) {
      throw new Error("EUREKA_API_KEY no está definida en las variables de entorno");
    }
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Error en llamada a Eureka (${endpoint}):`, error);
      throw error;
    }
  }

  async getSituacionPersona(cuil: string): Promise<SituacionPersonaResponse> {
    return await this.makeRequest<SituacionPersonaResponse>(`/personas/situacion/cuilt/${cuil}`);
  }

  async getPlanesDeCuotas(params: { nroComercio: string; importe: number }): Promise<PlanesDeCuotasResponse> {
    const { nroComercio, importe } = params;
    
    if (!nroComercio || !importe) {
      throw new Error("nroComercio e importe son requeridos");
    }

    return await this.makeRequest<PlanesDeCuotasResponse>(
      `/planes/generico/nroComercio/${nroComercio}/importe/${importe}`
    );
  }
}