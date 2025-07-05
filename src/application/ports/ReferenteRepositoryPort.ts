// src/application/ports/ReferenteRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Referentes
 *
 * Este módulo define la interfaz para el puerto de repositorio de referentes que permite
 * gestionar las operaciones de persistencia de referentes en el sistema.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de referentes
 * - Proporcionar métodos de consulta por diferentes criterios
 * - Manejar operaciones CRUD de referentes
 */

import { Referente } from "../../domain/entities/Referente";

/**
 * Puerto para operaciones de repositorio de referentes.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y consulta de referentes en el sistema.
 */
export interface ReferenteRepositoryPort {
    /**
     * Guarda un nuevo referente en el repositorio.
     *
     * @param referente - Referente a guardar
     * @returns Promise<Referente> - Referente guardado con ID asignado
     * @throws Error si el referente ya existe o los datos son inválidos
     */
    saveReferente(referente: Referente): Promise<Referente>;

    /**
     * Obtiene un referente por su identificador único.
     *
     * @param id - ID del referente
     * @returns Promise<Referente | null> - Referente encontrado o null si no existe
     */
    getReferenteById(id: number): Promise<Referente | null>;

    /**
     * Actualiza los datos de un referente existente.
     *
     * @param referente - Referente con datos actualizados
     * @returns Promise<Referente> - Referente actualizado
     * @throws Error si el referente no existe
     */
    updateReferente(referente: Referente): Promise<Referente>;

    /**
     * Elimina un referente del repositorio.
     *
     * @param id - ID del referente a eliminar
     * @returns Promise<void>
     * @throws Error si el referente no existe
     */
    deleteReferente(id: number): Promise<void>;

    /**
     * Obtiene todos los referentes registrados.
     *
     * @returns Promise<Referente[]> - Listado de todos los referentes
     */
    getAllReferentes(): Promise<Referente[]>;

    /**
     * Obtiene referentes por ID de la solicitud formal.
     *
     * @param solicitudFormalId - ID de la solicitud formal
     * @returns Promise<Referente[]> - Listado de referentes relacionados con esa solicitud formal
     */
    getReferentesBySolicitudFormalId(solicitudFormalId: number): Promise<Referente[]>;

    /**
     * Obtiene referentes por número de teléfono.
     *
     * @param telefono - Número de teléfono del referente
     * @returns Promise<Referente[]> - Listado de referentes con ese teléfono
     */
    getReferentesByTelefono(telefono: string): Promise<Referente[]>;
}
