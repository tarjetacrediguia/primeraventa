// src/application/use-cases/Administrador/GetAllAdminUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Todos los Administradores
 *
 * Este módulo implementa la lógica de negocio para consultar el listado completo
 * de administradores registrados en el sistema.
 *
 * RESPONSABILIDADES:
 * - Consultar todos los administradores existentes
 * - Permitir la visualización general de administradores
 */

import { Administrador } from "../../../domain/entities/Administrador";
import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";

/**
 * Caso de uso para obtener el listado de todos los administradores.
 *
 * Esta clase permite consultar y retornar todos los administradores registrados
 * en el sistema.
 */
export class GetAllAdminUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de administradores
     */
    constructor(private readonly repository: AdministradorRepositoryPort) {}

    /**
     * Ejecuta la consulta de todos los administradores.
     *
     * @returns Promise<Administrador[]> - Listado de administradores registrados
     */
    async execute(): Promise<Administrador[]> {
        return this.repository.getAllAdministradores();
    }
}
