// src/domain/entities/Configuracion.ts
/**
 * MÓDULO: Entidad Configuración
 *
 * Este archivo define la clase Configuracion que representa las configuraciones
 * del sistema de gestión de préstamos.
 * 
 * Responsabilidades:
 * - Representar configuraciones del sistema
 * - Gestionar parámetros configurables del sistema
 * - Proporcionar funcionalidades de configuración dinámica
 * - Mantener historial de cambios en configuraciones
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

/**
 * Clase que representa una configuración del sistema.
 * Contiene información sobre parámetros configurables,
 * incluyendo clave, valor, descripción y fecha de actualización.
 */
export class Configuracion {
  
  /**
   * Constructor de la clase Configuracion.
   * Inicializa una configuración con sus datos básicos.
   * 
   * @param clave - Clave única de la configuración.
   * @param valor - Valor de la configuración (puede ser cualquier tipo).
   * @param descripcion - Descripción de la configuración (opcional).
   * @param fechaActualizacion - Fecha de última actualización (opcional).
   */
  constructor(
    public clave: string,
    public valor: any, // JSONB puede contener cualquier tipo de dato
    public descripcion?: string,
    public fechaActualizacion?: Date
  ) {}

  /**
   * Convierte la configuración a un objeto plano.
   * Útil para serialización y transferencia de datos.
   * 
   * @returns any - Objeto plano con todos los datos de la configuración.
   */
  public toPlainObject() {
    return {
      clave: this.clave,
      valor: this.valor,
      descripcion: this.descripcion,
      fechaActualizacion: this.fechaActualizacion
    };
  }
}
