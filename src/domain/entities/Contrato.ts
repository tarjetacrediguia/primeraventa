// src/domain/entities/Contrato.ts
/**
 * MÓDULO: Entidad Contrato
 *
 * Este archivo define la clase Contrato que representa un contrato de préstamo
 * generado en el sistema de gestión de préstamos.
 * 
 * Responsabilidades:
 * - Representar contratos de préstamo generados
 * - Gestionar información del contrato (monto, estado, fechas)
 * - Manejar documentos PDF del contrato
 * - Proporcionar funcionalidades de generación de contratos
 * - Gestionar números de cuenta y tarjeta asociados
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

/**
 * Clase que representa un contrato de préstamo en el sistema.
 * Contiene toda la información relacionada con el contrato, incluyendo
 * monto, estado, fechas y documentos asociados.
 */
export class Contrato {
  private pdfContrato?: Buffer;
  
  /**
   * Constructor de la clase Contrato.
   * Inicializa un contrato con todos sus datos básicos.
   * 
   * @param id - Identificador único del contrato.
   * @param fechaGeneracion - Fecha de generación del contrato.
   * @param monto - Monto del préstamo.
   * @param estado - Estado actual del contrato.
   * @param solicitudFormalId - ID de la solicitud formal asociada.
   * @param clienteId - ID del cliente beneficiario.
   * @param numeroTarjeta - Número de tarjeta asignado (opcional).
   * @param numeroCuenta - Número de cuenta asignado (opcional).
   */
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

  /**
   * Obtiene el PDF del contrato.
   * 
   * @returns Buffer | undefined - PDF del contrato o undefined si no existe.
   */
  getPdfContrato(): Buffer | undefined {
    return this.pdfContrato;
  }

  /**
   * Establece el PDF del contrato.
   * 
   * @param pdf - Nuevo PDF del contrato.
   */
  setPdfContrato(pdf: Buffer): void {
    this.pdfContrato = pdf;
  }

  /**
   * Obtiene el ID único del contrato.
   * 
   * @returns number - ID del contrato.
   */
  public getId(): number {
    return this.id;
  }

  /**
   * Obtiene la fecha de generación del contrato.
   * 
   * @returns Date - Fecha de generación del contrato.
   */
  public getFechaGeneracion(): Date {
    return this.fechaGeneracion;
  }

  /**
   * Establece la fecha de generación del contrato.
   * 
   * @param fechaGeneracion - Nueva fecha de generación del contrato.
   */
  public setFechaGeneracion(fechaGeneracion: Date): void {
    this.fechaGeneracion = fechaGeneracion;
  }

  /**
   * Obtiene el monto del préstamo.
   * 
   * @returns number - Monto del préstamo.
   */
  public getMonto(): number {
    return this.monto;
  }

  /**
   * Establece el monto del préstamo.
   * 
   * @param monto - Nuevo monto del préstamo.
   */
  public setMonto(monto: number): void {
    this.monto = monto;
  }

  /**
   * Obtiene el estado actual del contrato.
   * 
   * @returns string - Estado del contrato.
   */
  public getEstado(): string {
    return this.estado;
  }

  /**
   * Establece el estado del contrato.
   * 
   * @param estado - Nuevo estado del contrato.
   */
  public setEstado(estado: string): void {
    this.estado = estado;
  }

  /**
   * Obtiene el ID de la solicitud formal asociada.
   * 
   * @returns number - ID de la solicitud formal.
   */
  public getSolicitudFormalId(): number {
    return this.solicitudFormalId;
  }

  /**
   * Establece el ID de la solicitud formal asociada.
   * 
   * @param solicitudFormalId - Nuevo ID de la solicitud formal.
   */
  public setSolicitudFormalId(solicitudFormalId: number): void {
    this.solicitudFormalId = solicitudFormalId;
  }

  /**
   * Obtiene el ID del cliente beneficiario.
   * 
   * @returns number - ID del cliente.
   */
  public getClienteId(): number {
    return this.clienteId;
  }

  /**
   * Establece el ID del cliente beneficiario.
   * 
   * @param clienteId - Nuevo ID del cliente.
   */
  public setClienteId(clienteId: number): void {
    this.clienteId = clienteId;
  }

  /**
   * Obtiene el número de tarjeta asignado.
   * 
   * @returns string | undefined - Número de tarjeta o undefined.
   */
  public getNumeroTarjeta(): string | undefined {
    return this.numeroTarjeta;
  }

  /**
   * Establece el número de tarjeta asignado.
   * 
   * @param numeroTarjeta - Nuevo número de tarjeta.
   */
  public setNumeroTarjeta(numeroTarjeta: string): void {
    this.numeroTarjeta = numeroTarjeta;
  }

  /**
   * Obtiene el número de cuenta asignado.
   * 
   * @returns string | undefined - Número de cuenta o undefined.
   */
  public getNumeroCuenta(): string | undefined {
    return this.numeroCuenta;
  }

  /**
   * Establece el número de cuenta asignado.
   * 
   * @param numeroCuenta - Nuevo número de cuenta.
   */
  public setNumeroCuenta(numeroCuenta: string): void {
    this.numeroCuenta = numeroCuenta;
  }

  /**
   * Convierte el contrato a una representación de string.
   * Útil para logging y debugging.
   * 
   * @returns string - Representación en string del contrato.
   */
  public toString(): string {
    return `Contrato [id=${this.id}, fechaGeneracion=${this.fechaGeneracion}, monto=${this.monto}, estado=${this.estado}, solicitudFormalId=${this.solicitudFormalId}, clienteId=${this.clienteId}, numeroTarjeta=${this.numeroTarjeta || 'No asignado'}, numeroCuenta=${this.numeroCuenta || 'No asignado'}]`;
  }

  /**
   * Convierte el contrato a un objeto plano.
   * Útil para serialización y transferencia de datos.
   * 
   * @returns any - Objeto plano con todos los datos del contrato.
   */
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

  /**
   * Crea una instancia de Contrato desde un mapa de datos.
   * Método estático para crear contratos desde datos serializados.
   * 
   * @param map - Mapa de datos para crear la instancia.
   * @returns Contrato - Nueva instancia de Contrato.
   */
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

  /**
   * Genera el PDF del contrato.
   * Método que debe ser implementado para crear el documento PDF del contrato.
   * 
   * @throws Error - Siempre lanza error indicando que no está implementado.
   */
  public generarPDF(): void {
    throw new Error("Method not implemented.");
  }
}
