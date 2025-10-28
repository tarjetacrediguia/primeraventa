// src/application/use-cases/Comercio/GetPlanesDeCuotasUseCase.ts
import { EurekaPort, PlanesDeCuotasResponse } from "../../ports/EurekaPort";

export interface GetPlanesDeCuotasParams {
  nroComercio: string;
  importe: number;
}

export class GetPlanesDeCuotasUseCase {
  constructor(private eurekaAdapter: EurekaPort) {}

  async execute(params: GetPlanesDeCuotasParams): Promise<PlanesDeCuotasResponse> {
    try {
      const { nroComercio, importe } = params;

      if (!nroComercio || !importe) {
        throw new Error("El número de comercio y el importe son obligatorios");
      }

      if (importe <= 0) {
        throw new Error("El importe debe ser mayor a 0");
      }

      const planes = await this.eurekaAdapter.getPlanesDeCuotas({ nroComercio, importe });
      return planes;
    } catch (error) {
      console.error("Error en GetPlanesDeCuotasUseCase:", error);
      throw new Error(`No se pudo obtener los planes de cuotas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}