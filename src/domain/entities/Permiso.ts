//src/domain/entities/Permiso.ts
/**
 * MÓDULO: Entidad Permiso
 *
 * Este archivo define la clase Permiso que representa un permiso o autorización
 * específica en el sistema de gestión de préstamos.
 * 
 * Responsabilidades:
 * - Representar permisos específicos del sistema
 * - Gestionar información de permisos (nombre y descripción)
 * - Proporcionar funcionalidades de autorización
 * - Facilitar el control de acceso basado en roles
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

/**
 * Clase que representa un permiso en el sistema.
 * Define las autorizaciones específicas que pueden tener los usuarios
 * para realizar diferentes acciones en el sistema.
 */
export class Permiso {
  
  /**
   * Constructor de la clase Permiso. 
   * Inicializa un permiso con su nombre y descripción.
   * 
   * @param nombre - Nombre único del permiso.
   * @param descripcion - Descripción detallada del permiso.
   */
  constructor(
    public readonly nombre: string,
    public descripcion: string
  ) {}

  /**
   * Obtiene el nombre del permiso.
   * 
   * @returns string - Nombre del permiso.
   */
  public getNombre(): string {
    return this.nombre;
  }

  /**
   * Obtiene la descripción del permiso.
   * 
   * @returns string - Descripción del permiso.
   */
  public getDescripcion(): string {
    return this.descripcion;
  }

  /**
   * Establece la descripción del permiso.
   * 
   * @param descripcion - Nueva descripción del permiso.
   */
  public setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }

  /**
   * Convierte el permiso a una representación de string.
   * Útil para logging y debugging.
   * 
   * @returns string - Representación en string del permiso.
   */
  public toString(): string {
    return `Permiso[nombre=${this.nombre}, descripcion=${this.descripcion}]`;
  }

  /**
   * Convierte el permiso a un objeto plano.
   * Útil para serialización y transferencia de datos.
   * 
   * @returns any - Objeto plano con los datos del permiso.
   */
  public toPlainObject(): any {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion
    };
  }

  /**
   * Crea una instancia de Permiso desde un mapa de datos.
   * Método estático para crear permisos desde datos serializados.
   * 
   * @param map - Mapa de datos para crear la instancia.
   * @returns Permiso - Nueva instancia de Permiso.
   */
  public static fromMap(map: any): Permiso {
    return new Permiso(
      map.nombre,
      map.descripcion
    );
  }
}
