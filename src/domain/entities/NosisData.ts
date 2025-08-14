// src/application/domain/entities/NosisData.ts
export interface NosisVariable {
  Nombre: string;
  Valor: string;
  Descripcion: string;
  Tipo: string;
  FechaAct?: string;
  Detalle?: string;
}

export interface NosisVariables {
  Variable: NosisVariable[];
}

export interface NosisDatos {
  Variables: NosisVariables;
}

export interface NosisResultado {
  Estado: string;
  Novedad: string;
  Tiempo: string;
  FechaRecepcion: string;
  Transaccion: string;
  Referencia: string;
  Servidor: string;
  Version: string;
}

export interface NosisPedido {
  Usuario: string;
  Documento: string;
  VR: string;
  CDA: string;
  Timeout: string;
}

export interface NosisContenido {
  Pedido: NosisPedido;
  Resultado: NosisResultado;
  Datos: NosisDatos;
}

export interface NosisResponse {
  Contenido: NosisContenido;
}