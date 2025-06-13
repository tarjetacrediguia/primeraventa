// src/domain/entities/Configuracion.ts
export class Configuracion {
  constructor(
    public clave: string,
    public valor: any, // JSONB puede contener cualquier tipo de dato
    public descripcion?: string,
    public fechaActualizacion?: Date
  ) {}

  public toPlainObject() {
    return {
      clave: this.clave,
      valor: this.valor,
      descripcion: this.descripcion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}