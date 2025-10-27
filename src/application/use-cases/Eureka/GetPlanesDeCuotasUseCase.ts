//src/application/use-cases/Eureka/GetPlanesDeCuotasUseCase.ts

import { EurekaPort, PlanesDeCuotasResponse } from "../../ports/EurekaPort";

export interface GetPlanesDeCuotasParams {
  // Definir parámetros según lo que necesite el endpoint
  cuil?: string;
  monto?: number;
  plazo?: number;
  // agregar más parámetros según sea necesario
}

export class GetPlanesDeCuotasUseCase {
  constructor(private eurekaAdapter: EurekaPort) {}

  async execute(params: GetPlanesDeCuotasParams): Promise<PlanesDeCuotasResponse> {
    try {
      const planes = await this.eurekaAdapter.getPlanesDeCuotas(params);
      return planes;
    } catch (error) {
      console.error("Error en GetPlanesDeCuotasUseCase:", error);
      throw new Error(`No se pudo obtener los planes de cuotas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}