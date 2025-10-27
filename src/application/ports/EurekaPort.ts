//src/application/ports/EurekaPort.ts

export interface SituacionPersonaResponse {
  Apellidos: string | null;
  CUILT: string | null;
  DNI: number;
  Detalle: string;
  InfoAdicional1: string | null;
  InfoAdicional2: string | null;
  Issues: Array<{
    Detalle: string;
    InfoAdicional: string | null;
    Situacion: string;
  }>;
  Meta: string;
  Nombres: string | null;
  Situacion: "OK" | "OPERADOR" | "RECHAZAR";
}

export interface PlanesDeCuotasResponse {
  // Definir según la estructura de respuesta del endpoint de planes
  // Por ahora lo dejamos genérico hasta tener más información
  [key: string]: any;
}

export interface EurekaPort {
  getSituacionPersona(cuil: string): Promise<SituacionPersonaResponse>;
  getPlanesDeCuotas(params: any): Promise<PlanesDeCuotasResponse>;
}