// src/domain/entities/Contrato.ts
export class Contrato {
  private pdfContrato?: Buffer;
  constructor(
    public readonly id: number,
    public fechaGeneracion: Date,
    public monto: number,
    public estado: string,
    public solicitudFormalId: number,
    public clienteId: number,
    public numeroTarjeta?: string,
    public numeroCuenta?: string
  ) {}

  // Getters y Setters

  getPdfContrato(): Buffer | undefined {
    return this.pdfContrato;
  }

  setPdfContrato(pdf: Buffer): void {
    this.pdfContrato = pdf;
  }

  public getId(): number {
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

  public getSolicitudFormalId(): number {
    return this.solicitudFormalId;
  }

  public setSolicitudFormalId(solicitudFormalId: number): void {
    this.solicitudFormalId = solicitudFormalId;
  }

  public getClienteId(): number {
    return this.clienteId;
  }

  public setClienteId(clienteId: number): void {
    this.clienteId = clienteId;
  }

  public getNumeroTarjeta(): string | undefined {
    return this.numeroTarjeta;
  }

  public setNumeroTarjeta(numeroTarjeta: string): void {
    this.numeroTarjeta = numeroTarjeta;
  }

  public getNumeroCuenta(): string | undefined {
    return this.numeroCuenta;
  }

  public setNumeroCuenta(numeroCuenta: string): void {
    this.numeroCuenta = numeroCuenta;
  }

  // Métodos adicionales
  public toString(): string {
    return `Contrato [id=${this.id}, fechaGeneracion=${this.fechaGeneracion}, monto=${this.monto}, estado=${this.estado}, solicitudFormalId=${this.solicitudFormalId}, clienteId=${this.clienteId}, numeroTarjeta=${this.numeroTarjeta || 'No asignado'}, numeroCuenta=${this.numeroCuenta || 'No asignado'}]`;
  }

  public toPlainObject(): any {
    return {
      id: this.id,
      fechaGeneracion: this.fechaGeneracion,
      monto: this.monto,
      estado: this.estado,
      solicitudFormalId: this.solicitudFormalId,
      clienteId: this.clienteId,
      numeroTarjeta: this.numeroTarjeta,
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
      map.numeroTarjeta,
      map.numeroCuenta
    );
  }

  public generarPDF(): void {
    throw new Error("Method not implemented.");
  }
}
