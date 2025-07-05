// src/application/ports/ConfiguracionRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Configuración
 *
 * Este módulo define la interfaz para el puerto de repositorio de configuración que permite
 * gestionar los parámetros de configuración global del sistema.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de configuraciones del sistema
 * - Proporcionar acceso a parámetros de configuración
 * - Manejar la actualización de configuraciones
 */

import { Configuracion } from "../../domain/entities/Configuracion";

/**
 * Puerto para operaciones de repositorio de configuración.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y consulta de configuraciones del sistema.
 */
export interface ConfiguracionRepositoryPort {
    /**
     * Obtiene el número de días de expiración configurado en el sistema.
     *
     * @returns Promise<number> - Número de días de expiración
     */
    obtenerDiasExpiracion(): Promise<number>;

    /**
     * Obtiene todas las configuraciones del sistema.
     *
     * @returns Promise<Configuracion[]> - Listado de todas las configuraciones
     */
    obtenerConfiguracion(): Promise<Configuracion[]>;

    /**
     * Actualiza el valor de una configuración específica.
     *
     * @param clave - Clave de la configuración a actualizar
     * @param valor - Nuevo valor para la configuración
     * @returns Promise<Configuracion> - Configuración actualizada
     * @throws Error si la configuración no existe
     */
    actualizarConfiguracion(clave: string, valor: any): Promise<Configuracion>;

    /**
     * Crea una nueva configuración en el sistema.
     *
     * @param configuracion - Configuración a crear
     * @returns Promise<Configuracion> - Configuración creada con ID asignado
     * @throws Error si la configuración ya existe o los datos son inválidos
     */
    crearConfiguracion(configuracion: Configuracion): Promise<Configuracion>;
}
