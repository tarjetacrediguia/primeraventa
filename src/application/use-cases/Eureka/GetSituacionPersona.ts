//src/application/use-cases/Eureka/GetSituacionPersona.ts


import { EurekaPort, SituacionPersonaResponse } from "../../ports/EurekaPort";

export class GetSituacionPersona {
  constructor(private eurekaAdapter: EurekaPort) {}

  async execute(cuil: string): Promise<SituacionPersonaResponse> {
    try {
      // Limpiar el CUIL (eliminar espacios y guiones)
      const cuilLimpio = cuil.replace(/[-\s]/g, '');
      
      if (!cuilLimpio || cuilLimpio.length !== 11) {
        throw new Error("CUIL inválido. Debe tener 11 dígitos");
      }

      const situacion = await this.eurekaAdapter.getSituacionPersona(cuilLimpio);
      
      return situacion;
    } catch (error) {
      console.error("Error en GetSituacionPersona:", error);
      throw new Error(`No se pudo obtener la situación de la persona: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}