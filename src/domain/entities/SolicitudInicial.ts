// src/domain/entities/SolicitudInicial.ts
export class SolicitudInicial {
  private readonly id: number;
  private fechaCreacion: Date;
  private estado: "pendiente" | "aprobada" | "rechazada" | "expirada";
  private dniCliente: string;
  private cuilCliente?: string;
  private reciboSueldo?: Buffer;
  private comercianteId?: number;
  private comentarios: string[];
  private clienteId: number;

  constructor(
    id: number,
    fechaCreacion: Date,
    estado: "pendiente" | "aprobada" | "rechazada" | "expirada",
    dniCliente: string,
    clienteId: number,
    cuilCliente?: string,
    reciboSueldo?: Buffer,
    comercianteId?: number,
    comentarios: string[] = []
  ) {
    this.id = id;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado;
    this.dniCliente = dniCliente;
    this.cuilCliente = cuilCliente;
    this.reciboSueldo = reciboSueldo;
    this.comercianteId = comercianteId;
    this.comentarios = comentarios;
    this.clienteId = clienteId;
  }

  // Getters y Setters

  public getClienteId(): number {
    return this.clienteId;
  }

  public setClienteId(clienteId: number): void {
    this.clienteId = clienteId;
  }

  public getId(): number {
    return this.id;
  }

  public getFechaCreacion(): Date {
    return this.fechaCreacion;
  }

  public setFechaCreacion(fechaCreacion: Date): void {
    this.fechaCreacion = fechaCreacion;
  }

  public getEstado(): "pendiente" | "aprobada" | "rechazada" | "expirada" {
    return this.estado;
  }

  public setEstado(
    estado: "pendiente" | "aprobada" | "rechazada" | "expirada"
  ): void {
    this.estado = estado;
  }

  public getDniCliente(): string {
    return this.dniCliente;
  }

  public setDniCliente(dniCliente: string): void {
    this.dniCliente = dniCliente;
  }

  public getCuilCliente(): string | undefined {
    return this.cuilCliente;
  }

  public setCuilCliente(cuilCliente: string | undefined): void {
    this.cuilCliente = cuilCliente;
  }

  public getReciboSueldo(): Buffer | undefined {
    return this.reciboSueldo;
  }

  public setReciboSueldo(reciboSueldo: Buffer): void {
    this.reciboSueldo = reciboSueldo;
  }

  public getComercianteId(): number | undefined {
    return this.comercianteId;
  }

  public setComercianteId(comercianteId: number): void {
    this.comercianteId = comercianteId;
  }

  // Métodos para comentarios
  public getComentarios(): string[] {
    return this.comentarios;
  }

  public setComentarios(comentarios: string[]): void {
    this.comentarios = comentarios;
  }

  public agregarComentario(comentario: string): void {
    this.comentarios.push(comentario);
  }

  // Métodos adicionales
  public toString(): string {
    return `SolicitudInicial[id=${this.id}, estado=${this.estado}, dni=${this.dniCliente}, cuil=${this.cuilCliente}]`;
  }

  public toPlainObject(): any {
    return {
      id: this.id,
      fechaCreacion: this.fechaCreacion,
      estado: this.estado,
      dniCliente: this.dniCliente,
      cuilCliente: this.cuilCliente,
      reciboSueldo: this.reciboSueldo,
      comercianteId: this.comercianteId,
      comentarios: this.comentarios, // Nuevo campo
    };
  }

  public static fromMap(map: any): SolicitudInicial {
    return new SolicitudInicial(
      map.id,
      map.fechaCreacion,
      map.estado,
      map.dniCliente,
      map.clienteId || 0,
      map.cuilCliente,
      map.reciboSueldo,
      map.comercianteId,
      map.comentarios || []
    );
  }

  validar(): boolean {
    return !!this.dniCliente && !!this.cuilCliente;
  }
}
