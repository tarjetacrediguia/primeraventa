// src/application/ports/SolicitudInicialRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Solicitudes Iniciales
 *
 * Este módulo define la interfaz para el puerto de repositorio de solicitudes iniciales
 * que permite gestionar las operaciones de persistencia de solicitudes iniciales.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de solicitudes iniciales
 * - Proporcionar métodos de consulta por diferentes criterios
 * - Manejar operaciones CRUD de solicitudes iniciales
 * - Gestionar la expiración de solicitudes
 */

import { SolicitudInicial } from "../../domain/entities/SolicitudInicial";

/**
 * Puerto para operaciones de repositorio de solicitudes iniciales.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y consulta de solicitudes iniciales en el sistema.
 */
export interface SolicitudInicialRepositoryPort {
    /**
     * Crea una nueva solicitud inicial en el repositorio.
     *
     * @param solicitudInicial - Solicitud inicial a crear
     * @returns Promise<SolicitudInicial> - Solicitud inicial creada con ID asignado
     * @throws Error si los datos son inválidos
     */
    createSolicitudInicial(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial>;

    /**
     * Obtiene una solicitud inicial por su identificador único.
     *
     * @param id - ID de la solicitud inicial
     * @returns Promise<SolicitudInicial | null> - Solicitud inicial encontrada o null si no existe
     */
    getSolicitudInicialById(id: number): Promise<SolicitudInicial | null>;

    /**
     * Actualiza los datos de una solicitud inicial existente.
     *
     * @param solicitudInicial - Solicitud inicial con datos actualizados
     * @returns Promise<SolicitudInicial> - Solicitud inicial actualizada
     * @throws Error si la solicitud inicial no existe
     */
    updateSolicitudInicial(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial>;

    /**
     * Obtiene todas las solicitudes iniciales registradas.
     *
     * @returns Promise<SolicitudInicial[]> - Listado de todas las solicitudes iniciales
     */
    getAllSolicitudesIniciales(): Promise<SolicitudInicial[]>;

    /**
     * Obtiene solicitudes iniciales por DNI del cliente.
     *
     * @param dni - DNI del cliente
     * @returns Promise<SolicitudInicial[]> - Listado de solicitudes iniciales con ese DNI
     */
    getSolicitudesInicialesByDni(dni: string): Promise<SolicitudInicial[]>;

    /**
     * Obtiene solicitudes iniciales por estado.
     *
     * @param estado - Estado de las solicitudes a buscar
     * @returns Promise<SolicitudInicial[]> - Listado de solicitudes iniciales con ese estado
     */
    getSolicitudesInicialesByEstado(estado: string): Promise<SolicitudInicial[]>;

    /**
     * Obtiene solicitudes iniciales por fecha.
     *
     * @param fecha - Fecha de las solicitudes a buscar
     * @returns Promise<SolicitudInicial[]> - Listado de solicitudes iniciales de esa fecha
     */
    getSolicitudesInicialesByFecha(fecha: Date): Promise<SolicitudInicial[]>;

    /**
     * Obtiene solicitudes iniciales por ID del comerciante.
     *
     * @param comercianteId - ID del comerciante
     * @returns Promise<SolicitudInicial[]> - Listado de solicitudes iniciales de ese comerciante
     */
    getSolicitudesInicialesByComercianteId(comercianteId: number): Promise<SolicitudInicial[]>;

    /**
     * Obtiene solicitudes iniciales por ID del cliente.
     *
     * @param clienteId - ID del cliente
     * @returns Promise<SolicitudInicial[]> - Listado de solicitudes iniciales de ese cliente
     */
    getSolicitudesInicialesByClienteId(clienteId: number): Promise<SolicitudInicial[]>;

    /**
     * Obtiene solicitudes iniciales que están próximas a expirar.
     *
     * @param diasExpiracion - Número de días para considerar expiración
     * @returns Promise<SolicitudInicial[]> - Listado de solicitudes iniciales próximas a expirar
     */
    obtenerSolicitudesAExpirar(diasExpiracion: number): Promise<SolicitudInicial[]>;

    /**
     * Marca una solicitud inicial como expirada.
     *
     * @param solicitudId - ID de la solicitud inicial a expirar
     * @returns Promise<void>
     * @throws Error si la solicitud inicial no existe
     */
    expirarSolicitud(solicitudId: number): Promise<void>;

    /**
     * Obtiene solicitudes iniciales por comerciante y estado.
     *
     * @param comercianteId - ID del comerciante
     * @param estado - Estado de las solicitudes
     * @returns Promise<SolicitudInicial[]> - Listado de solicitudes iniciales filtradas
     */
    getSolicitudesInicialesByComercianteYEstado(
        comercianteId: number, 
        estado: string
    ): Promise<SolicitudInicial[]>;

    /**
     * Actualiza el estado de aprobación o rechazo de una solicitud inicial.
     *
     * @param solicitudInicial - Solicitud inicial con estado actualizado
     * @returns Promise<SolicitudInicial> - Solicitud inicial actualizada
     * @throws Error si la solicitud inicial no existe
     */
    updateSolicitudInicialAprobaciónRechazo(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial>
}
