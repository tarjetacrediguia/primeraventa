// src/application/ports/AdministradorRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Administradores
 *
 * Este módulo define la interfaz para el puerto de repositorio de administradores que permite
 * gestionar las operaciones de persistencia de administradores en el sistema.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de administradores
 * - Proporcionar métodos de consulta por diferentes criterios
 * - Manejar operaciones CRUD de administradores
 */

import { Administrador } from "../../domain/entities/Administrador";

/**
 * Puerto para operaciones de repositorio de administradores.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y consulta de administradores en el sistema.
 */
export interface AdministradorRepositoryPort {
    /**
     * Guarda un nuevo administrador en el repositorio.
     *
     * @param administrador - Administrador a guardar
     * @returns Promise<Administrador> - Administrador guardado con ID asignado
     * @throws Error si el administrador ya existe o los datos son inválidos
     */
    saveAdministrador(administrador: Administrador): Promise<Administrador>;

    /**
     * Obtiene un administrador por su identificador único.
     *
     * @param id - ID del administrador
     * @returns Promise<Administrador | null> - Administrador encontrado o null si no existe
     */
    getAdministradorById(id: number): Promise<Administrador | null>;

    /**
     * Actualiza los datos de un administrador existente.
     *
     * @param administrador - Administrador con datos actualizados
     * @returns Promise<Administrador> - Administrador actualizado
     * @throws Error si el administrador no existe
     */
    updateAdministrador(administrador: Administrador): Promise<Administrador>;

    /**
     * Elimina un administrador del repositorio.
     *
     * @param id - ID del administrador a eliminar
     * @returns Promise<void>
     * @throws Error si el administrador no existe
     */
    deleteAdministrador(id: number): Promise<void>;

    /**
     * Obtiene todos los administradores registrados.
     *
     * @returns Promise<Administrador[]> - Listado de todos los administradores
     */
    getAllAdministradores(): Promise<Administrador[]>;
}
