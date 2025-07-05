// src/application/ports/AnalistaRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Analistas
 *
 * Este módulo define la interfaz para el puerto de repositorio de analistas que permite
 * gestionar las operaciones de persistencia de analistas en el sistema.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de analistas
 * - Proporcionar métodos de consulta por diferentes criterios
 * - Manejar operaciones CRUD de analistas
 */

import { Analista } from "../../domain/entities/Analista";

/**
 * Puerto para operaciones de repositorio de analistas.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y consulta de analistas en el sistema.
 */
export interface AnalistaRepositoryPort {
    /**
     * Guarda un nuevo analista en el repositorio.
     *
     * @param analista - Analista a guardar
     * @returns Promise<Analista> - Analista guardado con ID asignado
     * @throws Error si el analista ya existe o los datos son inválidos
     */
    saveAnalista(analista: Analista): Promise<Analista>;

    /**
     * Obtiene un analista por su identificador único.
     *
     * @param id - ID del analista
     * @returns Promise<Analista | null> - Analista encontrado o null si no existe
     */
    getAnalistaById(id: number): Promise<Analista | null>;

    /**
     * Actualiza los datos de un analista existente.
     *
     * @param analista - Analista con datos actualizados
     * @returns Promise<Analista> - Analista actualizado
     * @throws Error si el analista no existe
     */
    updateAnalista(analista: Analista): Promise<Analista>;

    /**
     * Elimina un analista del repositorio.
     *
     * @param id - ID del analista a eliminar
     * @returns Promise<void>
     * @throws Error si el analista no existe
     */
    deleteAnalista(id: number): Promise<void>;

    /**
     * Obtiene todos los analistas registrados.
     *
     * @returns Promise<Analista[]> - Listado de todos los analistas
     */
    getAllAnalistas(): Promise<Analista[]>;

    /**
     * Busca un analista por su correo electrónico.
     *
     * @param email - Correo electrónico del analista
     * @returns Promise<Analista | null> - Analista encontrado o null si no existe
     */
    findByEmail(email: string): Promise<Analista | null>;

    /**
     * Obtiene los IDs de todos los analistas activos en el sistema.
     *
     * @returns Promise<number[]> - Listado de IDs de analistas activos
     */
    obtenerIdsAnalistasActivos(): Promise<number[]>;
}
