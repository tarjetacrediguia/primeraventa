// src/application/ports/EurekaPort.ts
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

export interface PlanCuota {
  Aprobado: boolean;
  Cuotas: number;
  Descuento: number;
  DescuentoProrrateado: boolean;
  Estado: string;
  FH: string;
  Fecha: string;
  IdComercio: number;
  IdOrigen: number;
  IdSucursal: number;
  Importe: number;
  ImporteFinanciadoCDesc: number;
  MV: string;
  MontoXCuotaCDesc: number;
  MotivoRechazo: string;
  NombreFantasia: string;
  NroComercio: number;
  NroDocumento: number;
  NroSucursal: number;
  Numero: number;
  Origen: string;
  PV: boolean;
  RazonSocial: string;
}

export interface SucursalInfo {
  CasaMatriz: boolean;
  NombreFantasia: string;
  NumeroSucursal: number;
  SucursalOKParaOperar: boolean;
  SucursalOKParaOperar_Mensaje: string;
  idComercio: number;
  idSucursal: number;
}

export interface PlanesDeCuotasResponse {
  Autorizaciones: PlanCuota[];
  Autorizado: boolean;
  Extra: any | null;
  SucursalInfo: SucursalInfo;
}

export interface EurekaPort {
  getSituacionPersona(cuil: string): Promise<SituacionPersonaResponse>;
  getPlanesDeCuotas(params: { nroComercio: string; importe: number }): Promise<PlanesDeCuotasResponse>;
}