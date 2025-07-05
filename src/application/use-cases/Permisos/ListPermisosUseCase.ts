// src/application/use-cases/Permisos/ListPermisosUseCase.ts

/**
 * MÓDULO: Caso de Uso - Listar Permisos
 *
 * Este módulo implementa la lógica de negocio para obtener la lista completa de
 * permisos registrados en el sistema.
 *
 * RESPONSABILIDADES:
 * - Obtener todos los permisos existentes en el sistema
 * - Proporcionar acceso a la lista de permisos para administración y gestión
 */

import { Permiso } from "../../../domain/entities/Permiso";
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";

/**
 * Caso de uso para listar todos los permisos del sistema.
 * 
 * Esta clase implementa la lógica para obtener la lista completa de permisos,
 * útil para administración, gestión de roles y asignación de privilegios.
 */
export class ListPermisosUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(private readonly repository: PermisoRepositoryPort) {}

    /**
     * Ejecuta la obtención de todos los permisos del sistema.
     * 
     * Este método retorna la lista completa de permisos registrados en el sistema.
     * 
     * @returns Promise<Permiso[]> - Array con todos los permisos existentes
     */
    async execute(): Promise<Permiso[]> {
        const permisos = await this.repository.getAllPermisos();
        return permisos;
    }
}
