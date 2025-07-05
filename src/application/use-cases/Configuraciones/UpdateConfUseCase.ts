// src/application/use-cases/Configuraciones/UpdateConfUseCase.ts

/**
 * MÓDULO: Caso de Uso - Actualizar Configuración
 *
 * Este módulo implementa la lógica de negocio para actualizar los parámetros
 * de configuración global del sistema.
 *
 * RESPONSABILIDADES:
 * - Actualizar el valor de una configuración existente
 * - Permitir la modificación dinámica de parámetros globales
 */

import { ConfiguracionRepositoryPort } from "../../ports/ConfiguracionRepositoryPort";
import { Configuracion } from "../../../domain/entities/Configuracion";

/**
 * Caso de uso para actualizar una configuración del sistema.
 *
 * Esta clase permite modificar el valor de un parámetro de configuración
 * previamente registrado en el sistema.
 */
export class UpdateConfUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de configuración
     */
    constructor(private readonly repository: ConfiguracionRepositoryPort) {}

    /**
     * Ejecuta la actualización de una configuración existente.
     *
     * @param clave - Clave del parámetro de configuración a actualizar
     * @param valor - Nuevo valor para el parámetro
     * @returns Promise<Configuracion> - Configuración actualizada
     */
    async execute(clave: string, valor: any): Promise<Configuracion> {
        return this.repository.actualizarConfiguracion(clave, valor);
    }
}
