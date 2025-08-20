// src/application/ports/SolicitudFormalRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Solicitudes Formales
 *
 * Este módulo define la interfaz para el puerto de repositorio de solicitudes formales
 * que permite gestionar las operaciones de persistencia de solicitudes formales.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de solicitudes formales
 * - Proporcionar métodos de consulta por diferentes criterios
 * - Manejar operaciones CRUD de solicitudes formales
 * - Gestionar la vinculación con contratos
 */

import { SolicitudFormal } from "../../domain/entities/SolicitudFormal";

/**
 * Puerto para operaciones de repositorio de solicitudes formales.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y consulta de solicitudes formales en el sistema.
 */
export interface SolicitudFormalRepositoryPort {
    /**
     * Crea una nueva solicitud formal en el repositorio.
     *
     * @param solicitudFormal - Solicitud formal a crear
     * @returns Promise<SolicitudFormal> - Solicitud formal creada con ID asignado
     * @throws Error si los datos son inválidos
     */
    createSolicitudFormal(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal>;

    /**
     * Obtiene una solicitud formal por su identificador único.
     *
     * @param id - ID de la solicitud formal
     * @returns Promise<SolicitudFormal | null> - Solicitud formal encontrada o null si no existe
     */
    getSolicitudFormalById(id: number): Promise<SolicitudFormal | null>;

    /**
     * Actualiza los datos de una solicitud formal existente.
     *
     * @param solicitudFormal - Solicitud formal con datos actualizados
     * @returns Promise<SolicitudFormal> - Solicitud formal actualizada
     * @throws Error si la solicitud formal no existe
     */
    updateSolicitudFormal(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal>;

    /**
     * Elimina una solicitud formal del repositorio.
     *
     * @param id - ID de la solicitud formal a eliminar
     * @returns Promise<void>
     * @throws Error si la solicitud formal no existe
     */
    deleteSolicitudFormal(id: number): Promise<void>;

    /**
     * Obtiene todas las solicitudes formales registradas.
     *
     * @returns Promise<SolicitudFormal[]> - Listado de todas las solicitudes formales
     */
    getAllSolicitudesFormales(): Promise<SolicitudFormal[]>;

    /**
     * Obtiene solicitudes formales por DNI del cliente.
     *
     * @param dni - DNI del cliente
     * @returns Promise<SolicitudFormal[]> - Listado de solicitudes formales con ese DNI
     */
    getSolicitudesFormalesByDni(dni: string): Promise<SolicitudFormal[]>;

    /**
     * Obtiene solicitudes formales por estado.
     *
     * @param estado - Estado de las solicitudes a buscar
     * @returns Promise<SolicitudFormal[]> - Listado de solicitudes formales con ese estado
     */
    getSolicitudesFormalesByEstado(estado: string): Promise<SolicitudFormal[]>;

    /**
     * Obtiene solicitudes formales por fecha.
     *
     * @param fecha - Fecha de las solicitudes a buscar
     * @returns Promise<SolicitudFormal[]> - Listado de solicitudes formales de esa fecha
     */
    getSolicitudesFormalesByFecha(fecha: Date): Promise<SolicitudFormal[]>;

    /**
     * Obtiene solicitudes formales por ID del comerciante.
     *
     * @param comercianteId - ID del comerciante
     * @returns Promise<SolicitudFormal[]> - Listado de solicitudes formales de ese comerciante
     */
    getSolicitudesFormalesByComercianteId(comercianteId: number): Promise<SolicitudFormal[]>;

    /**
     * Obtiene solicitudes formales por ID del analista.
     *
     * @param analistaId - ID del analista
     * @returns Promise<SolicitudFormal[]> - Listado de solicitudes formales asignadas a ese analista
     */
    getSolicitudesFormalesByAnalistaId(analistaId: number): Promise<SolicitudFormal[]>;

    /**
     * Vincula una solicitud formal con un contrato.
     *
     * @param solicitudId - ID de la solicitud formal
     * @param contratoId - ID del contrato
     * @returns Promise<void>
     * @throws Error si la solicitud formal o el contrato no existen
     */
    vincularContrato(solicitudId: number, contratoId: number): Promise<void>;

    /**
     * Obtiene solicitudes formales por ID de la solicitud inicial.
     *
     * @param solicitudInicialId - ID de la solicitud inicial
     * @returns Promise<SolicitudFormal[]> - Listado de solicitudes formales derivadas de esa solicitud inicial
     */
    getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId: number): Promise<SolicitudFormal[]>;

    /**
     * Actualiza el estado de aprobación de una solicitud formal.
     *
     * @param solicitudFormal - Solicitud formal con estado de aprobación actualizado
     * @returns Promise<SolicitudFormal> - Solicitud formal actualizada
     * @throws Error si la solicitud formal no existe
     */
    updateSolicitudFormalAprobacion(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal>;

    /**
     * Actualiza el estado de rechazo de una solicitud formal.
     *
     * @param solicitudFormal - Solicitud formal con estado de rechazo actualizado
     * @returns Promise<SolicitudFormal> - Solicitud formal actualizada
     * @throws Error si la solicitud formal no existe
     */
    updateSolicitudFormalRechazo(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal>;

    /**
     * Obtiene solicitudes formales por comerciante y estado.
     *
     * @param comercianteId - ID del comerciante
     * @param estado - Estado de las solicitudes
     * @returns Promise<SolicitudFormal[]> - Listado de solicitudes formales filtradas
     */
    getSolicitudesFormalesByComercianteYEstado(
        comercianteId: number, 
        estado: string
    ): Promise<SolicitudFormal[]>;

    solicitarAmpliacion(solicitud: SolicitudFormal): Promise<SolicitudFormal>;
    aprobarAmpliacion(solicitud: SolicitudFormal): Promise<SolicitudFormal>;
    rechazarAmpliacion(solicitud: SolicitudFormal): Promise<SolicitudFormal>;

    getSolicitudFormalBySolicitudInicialId(solicitudInicialId: number): Promise<SolicitudFormal | null>;


    /**
     * Obtiene solicitudes formales por CUIL del comerciante.
     *
     * @param cuil - CUIL del comerciante
     * @returns Promise<SolicitudFormal[]> - Listado de solicitudes formales de ese comerciante
     */
    getSolicitudesFormalesByCuil(cuil: string): Promise<SolicitudFormal[]>;






}
