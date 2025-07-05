// src/domain/entities/Referente.ts
/**
 * MÓDULO: Entidad Referente
 *
 * Este archivo define la clase Referente que representa a una persona de referencia
 * para un solicitante de préstamo en el sistema.
 * 
 * Responsabilidades:
 * - Representar personas de referencia para solicitantes
 * - Gestionar información de contacto de referentes
 * - Proporcionar datos de validación para solicitudes
 * - Facilitar la verificación de información del solicitante
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

/**
 * Clase que representa una persona de referencia para un solicitante de préstamo.
 * Contiene información personal y de contacto del referente, así como
 * el vínculo que mantiene con el solicitante.
 */
export class Referente {
    private id?: number;
    private nombreCompleto: string
    private apellido: string
    private vinculo: string
    private telefono: string
    
    /**
     * Constructor de la clase Referente.
     * Inicializa un referente con sus datos personales y de contacto.
     * 
     * @param nombreCompleto - Nombre completo del referente.
     * @param apellido - Apellido del referente.
     * @param vinculo - Vínculo o relación con el solicitante.
     * @param telefono - Número de teléfono del referente.
     */
  constructor(
    nombreCompleto: string,
    apellido: string,
    vinculo: string,
    telefono: string
  ) {
    this.nombreCompleto = nombreCompleto;
    this.apellido = apellido;
    this.vinculo = vinculo;
    this.telefono = telefono;
  }

  /**
   * Obtiene el nombre completo del referente.
   * 
   * @returns string - Nombre completo del referente.
   */
  public getNombreCompleto(): string {
    return this.nombreCompleto;
  }

  /**
   * Establece el nombre completo del referente.
   * 
   * @param nombreCompleto - Nuevo nombre completo del referente.
   */
  public setNombreCompleto(nombreCompleto: string): void {
    this.nombreCompleto = nombreCompleto;
  }

  /**
   * Obtiene el apellido del referente.
   * 
   * @returns string - Apellido del referente.
   */
  public getApellido(): string {
    return this.apellido;
  }

  /**
   * Establece el apellido del referente.
   * 
   * @param apellido - Nuevo apellido del referente.
   */
  public setApellido(apellido: string): void {
    this.apellido = apellido;
  }

  /**
   * Obtiene el vínculo del referente con el solicitante.
   * 
   * @returns string - Vínculo o relación con el solicitante.
   */
  public getVinculo(): string {
    return this.vinculo;
  }

  /**
   * Establece el vínculo del referente con el solicitante.
   * 
   * @param vinculo - Nuevo vínculo o relación con el solicitante.
   */
  public setVinculo(vinculo: string): void {
    this.vinculo = vinculo;
  }

  /**
   * Obtiene el teléfono del referente.
   * 
   * @returns string - Número de teléfono del referente.
   */
  public getTelefono(): string {
    return this.telefono;
  }

  /**
   * Establece el teléfono del referente.
   * 
   * @param telefono - Nuevo número de teléfono del referente.
   */
  public setTelefono(telefono: string): void {
    this.telefono = telefono;
  }

  /**
   * Obtiene el ID único del referente.
   * 
   * @returns number | undefined - ID del referente o undefined si no tiene.
   */
   public getId(): number | undefined {
        return this.id;
    }

    /**
     * Establece el ID único del referente.
     * 
     * @param id - Nuevo ID del referente.
     */
    public setId(id: number): void {
        this.id = id;
    }

  /**
   * Convierte el referente a una representación de string.
   * Útil para logging y debugging.
   * 
   * @returns string - Representación en string del referente.
   */
  public toString(): string {
    return `Referente[nombre=${this.nombreCompleto} ${this.apellido}, vinculo=${this.vinculo}, tel=${this.telefono}]`;
  }

  /**
   * Convierte el referente a un objeto plano.
   * Útil para serialización y transferencia de datos.
   * 
   * @returns any - Objeto plano con todos los datos del referente.
   */
  public toPlainObject(): any {
    return {
      nombreCompleto: this.nombreCompleto,
      apellido: this.apellido,
      vinculo: this.vinculo,
      telefono: this.telefono
    };
  }

  /**
   * Crea una instancia de Referente desde un mapa de datos.
   * Método estático para crear referentes desde datos serializados.
   * 
   * @param map - Mapa de datos para crear la instancia.
   * @returns Referente - Nueva instancia de Referente.
   */
  public static fromMap(map: any): Referente {
    return new Referente(
      map.nombreCompleto,
      map.apellido,
      map.vinculo,
      map.telefono
    );
  }
}
