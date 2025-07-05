// src/application/use-cases/Configuraciones/CreateConfUseCase.ts

/**
 * MÓDULO: Caso de Uso - Crear Configuración
 *
 * Este módulo implementa la lógica de negocio para crear una nueva configuración
 * del sistema, permitiendo registrar parámetros y valores globales.
 *
 * RESPONSABILIDADES:
 * - Crear una nueva configuración en el sistema
 * - Validar y registrar los parámetros de configuración
 */

import { ConfiguracionRepositoryPort } from "../../ports/ConfiguracionRepositoryPort";
import { Configuracion } from "../../../domain/entities/Configuracion";

/**
 * Caso de uso para crear una nueva configuración del sistema.
 * 
 * Esta clase implementa la lógica para registrar una nueva configuración,
 * permitiendo definir parámetros globales para el funcionamiento del sistema.
 */
export class CreateConfUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de configuración
     */
    constructor(private readonly repository: ConfiguracionRepositoryPort) {}

    /**
     * Ejecuta la creación de una nueva configuración.
     * 
     * Este método registra una nueva configuración en el sistema.
     * 
     * @param configuracion - Objeto de configuración a registrar
     * @returns Promise<Configuracion> - Configuración creada
     */
    async execute(configuracion: Configuracion): Promise<Configuracion> {
        return this.repository.crearConfiguracion(configuracion);
    }
}
