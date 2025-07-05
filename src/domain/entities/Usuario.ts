// src/domain/entities/Usuario.ts
/**
 * MÓDULO: Entidad Usuario (Clase Abstracta)
 *
 * Este archivo define la clase abstracta Usuario que representa la entidad base
 * para todos los tipos de usuarios en el sistema de gestión de préstamos.
 * 
 * Responsabilidades:
 * - Definir la estructura base de datos para usuarios
 * - Proporcionar métodos comunes para gestión de usuarios
 * - Establecer la interfaz para diferentes tipos de usuarios
 * - Gestionar información personal y de contacto
 * - Manejar autenticación básica de usuarios
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

import { Permiso } from "./Permiso";

/**
 * Clase abstracta que representa la entidad base de usuario en el sistema.
 * Define la estructura común para todos los tipos de usuarios (Administrador, Analista, Comerciante).
 * Proporciona métodos para gestión de información personal, autenticación y conversión de datos.
 */
export abstract class Usuario {
  // Atributos
  private readonly id: number;
    private nombre: string;
    private apellido: string;
    private email: string;
    private password: string;
    private telefono: string;
    
    /**
     * Constructor de la clase Usuario.
     * Inicializa los datos básicos de un usuario del sistema.
     * 
     * @param id - Identificador único del usuario.
     * @param nombre - Nombre del usuario.
     * @param apellido - Apellido del usuario.
     * @param email - Dirección de email del usuario.
     * @param password - Contraseña del usuario (hash).
     * @param telefono - Número de teléfono del usuario.
     */
  constructor(
    id: number,
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    telefono: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.password = password;
    this.telefono = telefono;
  }

  /**
   * Obtiene el rol específico del usuario.
   * Método abstracto que debe ser implementado por las subclases.
   * 
   * @returns string - Rol del usuario (ej: 'administrador', 'analista', 'comerciante').
   */
  public abstract getRol(): string;

  /**
   * Obtiene los permisos del usuario.
   * Implementación base que retorna un array vacío.
   * Las subclases pueden sobrescribir este método.
   * 
   * @returns Permiso[] - Array de permisos del usuario.
   */
  public getPermisos(): Permiso[] {
    return [];
  }

  /**
   * Obtiene el ID único del usuario.
   * 
   * @returns number - ID del usuario.
   */
  public getId(): number {
    return this.id;
  }

  /**
   * Obtiene el nombre del usuario.
   * 
   * @returns string - Nombre del usuario.
   */
  public getNombre(): string {
    return this.nombre;
  }

  /**
   * Establece el nombre del usuario.
   * 
   * @param nombre - Nuevo nombre del usuario.
   */
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  /**
   * Obtiene el apellido del usuario.
   * 
   * @returns string - Apellido del usuario.
   */
  public getApellido(): string {
    return this.apellido;
  }

  /**
   * Establece el apellido del usuario.
   * 
   * @param apellido - Nuevo apellido del usuario.
   */
  public setApellido(apellido: string): void {
    this.apellido = apellido;
  }

  /**
   * Obtiene el email del usuario.
   * 
   * @returns string - Email del usuario.
   */
  public getEmail(): string {
    return this.email;
  }

  /**
   * Establece el email del usuario.
   * 
   * @param email - Nuevo email del usuario.
   */
  public setEmail(email: string): void {
    this.email = email;
  }

  /**
   * Obtiene el teléfono del usuario.
   * 
   * @returns string - Teléfono del usuario.
   */
  public getTelefono(): string {
    return this.telefono;
  }

  /**
   * Establece el teléfono del usuario.
   * 
   * @param telefono - Nuevo teléfono del usuario.
   */
  public setTelefono(telefono: string): void {
    this.telefono = telefono;
  }

  /**
   * Obtiene la contraseña del usuario (hash).
   * 
   * @returns string - Contraseña hasheada del usuario.
   */
  public getPassword(): string {
      return this.password;
  }

  /**
   * Convierte el usuario a una representación de string.
   * Útil para logging y debugging.
   * 
   * @returns string - Representación en string del usuario.
   */
  public toString(): string {
    return `Usuario[id=${this.id}, nombre=${this.nombre}, apellido=${this.apellido}, email=${this.email}, telefono=${this.telefono}]`;
  }

  /**
   * Convierte el usuario a un objeto plano.
   * Útil para serialización y transferencia de datos.
   * 
   * @returns any - Objeto plano con los datos del usuario.
   */
  public toPlainObject(): any {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      telefono: this.telefono
    };
  }

  /**
   * Crea una instancia de Usuario desde un mapa de datos.
   * Método estático que lanza error ya que no se puede instanciar la clase abstracta directamente.
   * 
   * @param map - Mapa de datos para crear la instancia.
   * @returns Usuario - Instancia de Usuario (no se ejecuta).
   * @throws Error - Siempre lanza error indicando que no se puede instanciar directamente.
   */
  public static fromMap(map: any): Usuario {
    throw new Error("No se puede instanciar clase abstracta directamente");
  }

  /**
   * Autentica al usuario comparando la contraseña proporcionada.
   * Nota: Esta implementación compara texto plano, en producción debería comparar hashes.
   * 
   * @param password - Contraseña a verificar.
   * @returns boolean - true si la contraseña coincide, false en caso contrario.
   */
  public autenticar(password: string): boolean {
        // Implementación real debería comparar hashes, no texto plano
        return this.password === password;
    }
}
