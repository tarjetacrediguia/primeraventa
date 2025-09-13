/**
 * MÓDULO: Entidad Analista
 *
 * Este archivo define la clase Analista que representa a un usuario analista
 * en el sistema de gestión de préstamos, con permisos para análisis y evaluación.
 *
 * Responsabilidades:
 * - Representar usuarios con rol de analista
 * - Gestionar permisos específicos de análisis
 * - Proporcionar funcionalidades de evaluación de solicitudes
 * - Extender la funcionalidad base de Usuario
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */

// src/domain/entities/Analista.ts
import { Permiso } from "./Permiso";
import { Usuario, UsuarioParams } from "./Usuario";

export interface AnalistaParams extends UsuarioParams {
  permisos?: Permiso[];
}

/**
 * Clase que representa un usuario analista en el sistema.
 * Extiende la clase Usuario y agrega funcionalidades específicas para analistas,
 * incluyendo gestión de permisos de análisis y evaluación.
 */
export class Analista extends Usuario {
  private permisos: Permiso[];

  /**
   * Constructor de la clase Analista.
   * Inicializa un analista con sus datos básicos y permisos específicos.
   *
   * @param id - Identificador único del analista.
   * @param nombre - Nombre del analista.
   * @param apellido - Apellido del analista.
   * @param email - Dirección de email del analista.
   * @param password - Contraseña del analista (hash).
   * @param telefono - Número de teléfono del analista.
   * @param permisos - Array de permisos del analista (opcional).
   */
  constructor(params: AnalistaParams) {
    // Extraemos los parámetros específicos de Analista
    const { permisos, ...usuarioParams } = params;

    // Llamamos al constructor padre con el objeto de parámetros de usuario
    super(usuarioParams);

    // Inicializamos los parámetros específicos de Analista
    this.permisos = permisos ?? [];
  }

  /**
   * Obtiene los permisos específicos del analista.
   *
   * @returns Permiso[] - Array de permisos del analista.
   */
  public getPermisos(): Permiso[] {
    return this.permisos;
  }

  /**
   * Establece los permisos del analista.
   *
   * @param permisos - Nuevo array de permisos para el analista.
   */
  public setPermisos(permisos: Permiso[]): void {
    this.permisos = permisos;
  }

  /**
   * Convierte el analista a una representación de string.
   * Incluye la información base del usuario más los permisos.
   *
   * @returns string - Representación en string del analista.
   */
  public toString(): string {
    return `${super.toString()}, permisos=${this.permisos.join(",")}`;
  }

  /**
   * Convierte el analista a un objeto plano.
   * Incluye todos los datos del usuario base más los permisos específicos.
   *
   * @returns any - Objeto plano con los datos del analista.
   */
  public toPlainObject(): any {
    return {
      ...super.toPlainObject(),
      permisos: this.permisos,
    };
  }

  /**
   * Crea una instancia de Analista desde un mapa de datos.
   * Método estático para crear analistas desde datos serializados.
   *
   * @param map - Mapa de datos para crear la instancia.
   * @returns Analista - Nueva instancia de Analista.
   */
  public static fromMap(map: any): Analista {
    return new Analista({
      id: map.id,
      nombre: map.nombre,
      apellido: map.apellido,
      email: map.email,
      password: map.password,
      telefono: map.telefono,
      permisos: map.permisos,
    });
  }

  /**
   * Autentica al analista comparando la contraseña proporcionada.
   * Utiliza el método de autenticación de la clase padre.
   *
   * @param password - Contraseña a verificar.
   * @returns boolean - true si la contraseña coincide, false en caso contrario.
   */
  autenticar(password: string): boolean {
    return super.autenticar(password);
  }

  /**
   * Obtiene el rol específico del analista.
   * Implementación del método abstracto de la clase padre.
   *
   * @returns string - Rol del analista ('analista').
   */
  public getRol(): string {
    return "analista";
  }
}
