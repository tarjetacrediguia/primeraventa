// src/domain/entities/Contrato.ts
export class Contrato {
  constructor(
    public readonly id: string,
    public fechaGeneracion: Date,
    public monto: number,
    public estado: string,
    public solicitudFormalId: string,
    public clienteId: string,
    public numeroAutorizacion: string,
    public numeroCuenta: string
  ) {}

  // Getters y Setters
  public getId(): string {
    return this.id;
  }

  public getFechaGeneracion(): Date {
    return this.fechaGeneracion;
  }

  public setFechaGeneracion(fechaGeneracion: Date): void {
    this.fechaGeneracion = fechaGeneracion;
  }

  public getMonto(): number {
    return this.monto;
  }

  public setMonto(monto: number): void {
    this.monto = monto;
  }

  public getEstado(): string {
    return this.estado;
  }

  public setEstado(estado: string): void {
    this.estado = estado;
  }

  public getSolicitudFormalId(): string {
    return this.solicitudFormalId;
  }

  public setSolicitudFormalId(solicitudFormalId: string): void {
    this.solicitudFormalId = solicitudFormalId;
  }

  public getClienteId(): string {
    return this.clienteId;
  }

  public setClienteId(clienteId: string): void {
    this.clienteId = clienteId;
  }

  public getNumeroAutorizacion(): string {
    return this.numeroAutorizacion;
  }

  public setNumeroAutorizacion(numeroAutorizacion: string): void {
    this.numeroAutorizacion = numeroAutorizacion;
  }

  public getNumeroCuenta(): string {
    return this.numeroCuenta;
  }

  public setNumeroCuenta(numeroCuenta: string): void {
    this.numeroCuenta = numeroCuenta;
  }

  // Métodos adicionales
  public toString(): string {
    return `Contrato[id=${this.id}, monto=${this.monto}, estado=${this.estado}]`;
  }

  public toPlainObject(): any {
    return {
      id: this.id,
      fechaGeneracion: this.fechaGeneracion,
      monto: this.monto,
      estado: this.estado,
      solicitudFormalId: this.solicitudFormalId,
      clienteId: this.clienteId,
      numeroAutorizacion: this.numeroAutorizacion,
      numeroCuenta: this.numeroCuenta
    };
  }

  public static fromMap(map: any): Contrato {
    return new Contrato(
      map.id,
      map.fechaGeneracion,
      map.monto,
      map.estado,
      map.solicitudFormalId,
      map.clienteId,
      map.numeroAutorizacion,
      map.numeroCuenta
    );
  }

  public generarPDF(): void {
    throw new Error("Method not implemented.");
  }
}