//src/application/ports/HistorialRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Historial
 *
 * Este módulo define la interfaz para el puerto de repositorio de historial que permite
 * gestionar el registro y consulta de eventos del sistema.
 *
 * RESPONSABILIDADES:
 * - Registrar eventos en el historial del sistema
 * - Consultar eventos por solicitud inicial
 * - Mantener trazabilidad de acciones en el sistema
 */

import { Historial } from "../../domain/entities/Historial";

/**
 * Puerto para operaciones de repositorio de historial.
 *
 * Esta interfaz define los métodos necesarios para gestionar el registro
 * y consulta de eventos en el historial del sistema.
 */
export interface HistorialRepositoryPort {
    /**
     * Registra un nuevo evento en el historial del sistema.
     *
     * @param historialData - Datos del evento a registrar (sin id, fechaHora y toPlainObject)
     * @returns Promise<Historial> - Evento registrado con datos completos
     * @throws Error si los datos son inválidos
     */
    registrarEvento(historialData: Omit<Historial, 'id' | 'fechaHora' | 'toPlainObject'>): Promise<Historial>;

    /**
     * Obtiene todos los eventos relacionados con una solicitud inicial específica.
     *
     * @param solicitudInicialId - ID de la solicitud inicial
     * @returns Promise<Historial[]> - Listado de eventos relacionados con la solicitud inicial
     * @throws Error si la solicitud inicial no existe
     */
    obtenerPorSolicitudInicial(solicitudInicialId: number): Promise<Historial[]>;
}
