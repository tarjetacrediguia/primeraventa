// src/application/ports/ContratoRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Contratos
 *
 * Este módulo define la interfaz para el puerto de repositorio de contratos que permite
 * gestionar las operaciones de persistencia de contratos en el sistema.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de contratos
 * - Proporcionar métodos de consulta por diferentes criterios
 * - Manejar operaciones CRUD de contratos
 */

import { Contrato } from "../../domain/entities/Contrato";

/**
 * Puerto para operaciones de repositorio de contratos.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y consulta de contratos en el sistema.
 */
export interface ContratoRepositoryPort {
    /**
     * Guarda un nuevo contrato en el repositorio.
     *
     * @param contrato - Contrato a guardar
     * @returns Promise<Contrato> - Contrato guardado con ID asignado
     * @throws Error si el contrato ya existe o los datos son inválidos
     */
    saveContrato(contrato: Contrato): Promise<Contrato>;

    /**
     * Obtiene un contrato por su identificador único.
     *
     * @param id - ID del contrato
     * @returns Promise<Contrato | null> - Contrato encontrado o null si no existe
     */
    getContratoById(id: string): Promise<Contrato | null>;

    /**
     * Actualiza los datos de un contrato existente.
     *
     * @param contrato - Contrato con datos actualizados
     * @returns Promise<Contrato> - Contrato actualizado
     * @throws Error si el contrato no existe
     */
    updateContrato(contrato: Contrato): Promise<Contrato>;

    /**
     * Elimina un contrato del repositorio.
     *
     * @param id - ID del contrato a eliminar
     * @returns Promise<void>
     * @throws Error si el contrato no existe
     */
    deleteContrato(id: string): Promise<void>;

    /**
     * Crea un nuevo contrato en el repositorio.
     *
     * @param contrato - Contrato a crear
     * @returns Promise<Contrato> - Contrato creado con ID asignado
     * @throws Error si los datos son inválidos
     */
    createContrato(contrato: Contrato): Promise<Contrato>;

    /**
     * Obtiene todos los contratos registrados.
     *
     * @returns Promise<Contrato[]> - Listado de todos los contratos
     */
    getAllContratos(): Promise<Contrato[]>;

    /**
     * Obtiene contratos por ID de la solicitud formal.
     *
     * @param solicitudFormalId - ID de la solicitud formal
     * @returns Promise<Contrato[]> - Listado de contratos relacionados con esa solicitud formal
     */
    getContratosBySolicitudFormalId(solicitudFormalId: number): Promise<Contrato[]>;

    /**
     * Obtiene contratos por ID del analista.
     *
     * @param analistaId - ID del analista
     * @returns Promise<Contrato[]> - Listado de contratos gestionados por ese analista
     */
    getContratosByAnalistaId(analistaId: number): Promise<Contrato[]>;

    /**
     * Obtiene contratos por ID del comerciante.
     *
     * @param comercianteId - ID del comerciante
     * @returns Promise<Contrato[]> - Listado de contratos de ese comerciante
     */
    getContratosByComercianteId(comercianteId: number): Promise<Contrato[]>;

    /**
     * Obtiene contratos por estado.
     *
     * @param estado - Estado de los contratos a buscar
     * @returns Promise<Contrato[]> - Listado de contratos con ese estado
     */
    getContratosByEstado(estado: string): Promise<Contrato[]>;
}
