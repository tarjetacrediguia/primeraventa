// src/application/ports/ComercianteRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Comerciantes
 *
 * Este módulo define la interfaz para el puerto de repositorio de comerciantes que permite
 * gestionar las operaciones de persistencia de comerciantes en el sistema.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de comerciantes
 * - Proporcionar métodos de consulta por diferentes criterios
 * - Manejar operaciones CRUD de comerciantes
 */

import { Comerciante } from "../../domain/entities/Comerciante";

/**
 * Puerto para operaciones de repositorio de comerciantes.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y consulta de comerciantes en el sistema.
 */
export interface ComercianteRepositoryPort {
    /**
     * Guarda un nuevo comerciante en el repositorio.
     *
     * @param comerciante - Comerciante a guardar
     * @returns Promise<Comerciante> - Comerciante guardado con ID asignado
     * @throws Error si el comerciante ya existe o los datos son inválidos
     */
    saveComerciante(comerciante: Comerciante): Promise<Comerciante>;

    /**
     * Obtiene un comerciante por su identificador único.
     *
     * @param id - ID del comerciante
     * @returns Promise<Comerciante | null> - Comerciante encontrado o null si no existe
     */
    getComercianteById(id: number): Promise<Comerciante | null>;

    /**
     * Actualiza los datos de un comerciante existente.
     *
     * @param comerciante - Comerciante con datos actualizados
     * @returns Promise<Comerciante> - Comerciante actualizado
     * @throws Error si el comerciante no existe
     */
    updateComerciante(comerciante: Comerciante): Promise<Comerciante>;

    /**
     * Elimina un comerciante del repositorio.
     *
     * @param id - ID del comerciante a eliminar
     * @returns Promise<void>
     * @throws Error si el comerciante no existe
     */
    deleteComerciante(id: number): Promise<void>;

    /**
     * Obtiene todos los comerciantes registrados.
     *
     * @returns Promise<Comerciante[]> - Listado de todos los comerciantes
     */
    getAllComerciantes(): Promise<Comerciante[]>;

    /**
     * Busca un comerciante por su correo electrónico.
     *
     * @param email - Correo electrónico del comerciante
     * @returns Promise<Comerciante | null> - Comerciante encontrado o null si no existe
     */
    findByEmail(email: string): Promise<Comerciante | null>;

    /**
     * Busca un comerciante por su CUIL.
     *
     * @param cuil - CUIL del comerciante
     * @returns Promise<Comerciante | null> - Comerciante encontrado o null si no existe
     */
    findByCuil(cuil: string): Promise<Comerciante | null>;

    /**
     * Obtiene un comerciante por su ID
     * @param id - ID del comerciante
     * @returns Promise<Comerciante> - El comerciante encontrado
     * @throws Error si el comerciante no existe
     */
    findById(id: number | undefined): Promise<Comerciante>;
}
