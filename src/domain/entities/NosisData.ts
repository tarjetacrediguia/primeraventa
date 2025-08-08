//src/application/domain/entities/NosisData.ts
// src/application/domain/entities/NosisData.ts

export class NosisVariable {
  constructor(
    public Nombre: string,
    public Valor: string,
    public Descripcion: string,
    public Tipo: string,
    public FechaAct?: string,
    public Detalle?: string
  ) {}
}

export class NosisVariables {
  constructor(public Variable: NosisVariable[]) {}
}

export class NosisDatos {
  constructor(public Variables: NosisVariables) {}
}

export class NosisResultado {
  constructor(
    public Estado: string,
    public Novedad: string,
    public Tiempo: string,
    public FechaRecepcion: string,
    public Transaccion: string,
    public Referencia: string,
    public Servidor: string,
    public Version: string
  ) {}
}

export class NosisPedido {
  constructor(
    public Usuario: string,
    public Documento: string,
    public VR: string,
    public CDA: string,
    public Timeout: string
  ) {}
}

export class NosisContenido {
  constructor(
    public Pedido: NosisPedido,
    public Resultado: NosisResultado,
    public Datos: NosisDatos
  ) {}
}

export class NosisResponse {
  constructor(
    public xmlnsi: string ='@xmlns:i',
    public xmlns: string = '@xmlns',
    public Contenido: NosisContenido
  ) {}
}