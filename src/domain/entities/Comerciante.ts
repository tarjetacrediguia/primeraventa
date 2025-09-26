/**
 * MÓDULO: Entidad Comerciante
 *
 * Este archivo define la clase Comerciante que representa a un usuario comerciante
 * en el sistema de gestión de préstamos, con información específica de su negocio.
 * 
 * Responsabilidades:
 * - Representar usuarios con rol de comerciante
 * - Gestionar información específica del negocio (nombre, CUIL, dirección)
 * - Proporcionar funcionalidades para comerciantes
 * - Extender la funcionalidad base de Usuario
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

// src/domain/entities/Comerciante.ts
import { Permiso } from "./Permiso";
import { Usuario, UsuarioParams } from "./Usuario";


export interface ComercianteParams extends UsuarioParams {
    nombreComercio: string;
    cuil: string;
    direccionComercio: string;
    permisos?: Permiso[];
    activo?: any
}


/**
 * Clase que representa un usuario comerciante en el sistema.
 * Extiende la clase Usuario y agrega información específica del negocio,
 * incluyendo nombre del comercio, CUIL y dirección.
 */
export class Comerciante extends Usuario {

  private nombreComercio: string
  private cuil: string
  private direccionComercio: string
  private permisos: Permiso[]

  /**
   * Constructor de la clase Comerciante.
   * Inicializa un comerciante con sus datos básicos e información del negocio.
   * 
   * @param id - Identificador único del comerciante.
   * @param nombre - Nombre del comerciante.
   * @param apellido - Apellido del comerciante.
   * @param email - Dirección de email del comerciante.
   * @param password - Contraseña del comerciante (hash).
   * @param telefono - Número de teléfono del comerciante.
   * @param nombreComercio - Nombre del comercio o negocio.
   * @param cuil - CUIL del comerciante.
   * @param direccionComercio - Dirección del comercio.
   * @param permisos - Array de permisos del comerciante (opcional).
   */
  constructor(params: ComercianteParams) {
    // Extraemos los parámetros específicos de Comerciante
        const { nombreComercio, cuil, direccionComercio, permisos, ...usuarioParams } = params;
        
        // Llamamos al constructor padre con el objeto de parámetros de usuario
        super(usuarioParams);
        
        // Inicializamos los parámetros específicos de Comerciante
        this.nombreComercio = nombreComercio;
        this.cuil = cuil;
        this.direccionComercio = direccionComercio;
        this.permisos = permisos ?? [];
  }

   

  /**
   * Obtiene el nombre del comercio.
   * 
   * @returns string - Nombre del comercio o negocio.
   */
  public getNombreComercio(): string {
    return this.nombreComercio;
  }

  /**
   * Establece el nombre del comercio.
   * 
   * @param nombreComercio - Nuevo nombre del comercio.
   */
  public setNombreComercio(nombreComercio: string): void {
    this.nombreComercio = nombreComercio;
  }

  /**
   * Obtiene el CUIL del comerciante.
   * 
   * @returns string - CUIL del comerciante.
   */
  public getCuil(): string {
    return this.cuil;
  }

  /**
   * Establece el CUIL del comerciante.
   * 
   * @param cuil - Nuevo CUIL del comerciante.
   */
  public setCuil(cuil: string): void {
    this.cuil = cuil;
  }

  /**
   * Obtiene la dirección del comercio.
   * 
   * @returns string - Dirección del comercio.
   */
  public getDireccionComercio(): string {
    return this.direccionComercio;
  }

  /**
   * Establece la dirección del comercio.
   * 
   * @param direccionComercio - Nueva dirección del comercio.
   */
  public setDireccionComercio(direccionComercio: string): void {
    this.direccionComercio = direccionComercio;
  }

  /**
   * Obtiene los permisos específicos del comerciante.
   * 
   * @returns Permiso[] - Array de permisos del comerciante.
   */
  public getPermisos(): Permiso[] {
    return this.permisos;
  }

  /**
   * Establece los permisos del comerciante.
   * 
   * @param permisos - Nuevo array de permisos para el comerciante.
   */
  public setPermisos(permisos: Permiso[]): void {
    this.permisos = permisos;
  }

  /**
   * Convierte el comerciante a una representación de string.
   * Incluye la información base del usuario más los datos del comercio.
   * 
   * @returns string - Representación en string del comerciante.
   */
  public toString(): string {
    return `${super.toString()}, comercio=${this.nombreComercio}, CUIL=${this.cuil}, direccion=${this.direccionComercio}`;
  }

  /**
   * Convierte el comerciante a un objeto plano.
   * Incluye todos los datos del usuario base más la información del comercio.
   * 
   * @returns any - Objeto plano con los datos del comerciante.
   */
  public toPlainObject(): any {
    return {
      ...super.toPlainObject(),
      nombreComercio: this.nombreComercio,
      cuil: this.cuil,
      direccionComercio: this.direccionComercio
    };
  }

  /**
   * Crea una instancia de Comerciante desde un mapa de datos.
   * Método estático para crear comerciantes desde datos serializados.
   * 
   * @param map - Mapa de datos para crear la instancia.
   * @returns Comerciante - Nueva instancia de Comerciante.
   */
  public static fromMap(map: any): Comerciante {
    return new Comerciante({
            id: map.id,
            nombre: map.nombre,
            apellido: map.apellido,
            email: map.email,
            password: map.password,
            telefono: map.telefono,
            nombreComercio: map.nombreComercio,
            cuil: map.cuil,
            direccionComercio: map.direccionComercio,
            permisos: map.permisos
        });
  }

  /**
   * Autentica al comerciante comparando la contraseña proporcionada.
   * Utiliza el método de autenticación de la clase padre.
   * 
   * @param password - Contraseña a verificar.
   * @returns boolean - true si la contraseña coincide, false en caso contrario.
   */
  autenticar(password: string): boolean {
    return super.autenticar(password);
  }
  
  /**
   * Obtiene el rol específico del comerciante.
   * Implementación del método abstracto de la clase padre.
   * 
   * @returns string - Rol del comerciante ('comerciante').
   */
  public getRol(): string {
    return 'comerciante';
  }
}
