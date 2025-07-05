// src/application/use-cases/Administrador/GetAdminByIdUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Administrador por ID
 *
 * Este módulo implementa la lógica de negocio para consultar los datos de un administrador
 * específico a partir de su identificador único.
 *
 * RESPONSABILIDADES:
 * - Consultar un administrador por su ID
 * - Validar la existencia del administrador
 */

import { Administrador } from "../../../domain/entities/Administrador";
import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";

/**
 * Caso de uso para obtener un administrador por su identificador.
 *
 * Esta clase permite consultar los datos de un administrador específico,
 * validando su existencia en el sistema.
 */
export class GetAdminByIdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de administradores
     */
    constructor(private readonly repository: AdministradorRepositoryPort) {}

    /**
     * Ejecuta la consulta de un administrador por ID.
     *
     * @param id - Identificador único del administrador
     * @returns Promise<Administrador> - Administrador encontrado
     * @throws Error si el administrador no existe
     */
    async execute(id: number): Promise<Administrador> {
        const administrador = await this.repository.getAdministradorById(id);
        
        if (!administrador) {
            throw new Error("Administrador no encontrado");
        }
        
        return administrador;
    }
}
