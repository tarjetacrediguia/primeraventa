// src/application/use-cases/SolicitudInicial/ListSolicitudesInicialesUseCase.ts

/**
 * MÓDULO: Caso de Uso - Listar Solicitudes Iniciales
 *
 * Este módulo implementa la lógica de negocio para obtener todas las solicitudes
 * iniciales del sistema sin filtros específicos.
 *
 * RESPONSABILIDADES:
 * - Obtener todas las solicitudes iniciales del sistema
 * - Proporcionar acceso a la lista completa para administradores y analistas
 */

import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

/**
 * Caso de uso para listar todas las solicitudes iniciales del sistema.
 * 
 * Esta clase implementa la lógica para obtener la lista completa de solicitudes
 * iniciales, principalmente utilizada por administradores y analistas para
 * tener una visión general de todas las solicitudes en el sistema.
 */
export class ListSolicitudesInicialesUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    /**
     * Ejecuta la obtención de todas las solicitudes iniciales.
     * 
     * Este método retorna todas las solicitudes iniciales almacenadas en el sistema
     * sin aplicar filtros específicos.
     * 
     * @returns Promise<SolicitudInicial[]> - Array con todas las solicitudes iniciales del sistema
     */
    async execute(): Promise<SolicitudInicial[]> {
        return this.repository.getAllSolicitudesIniciales();
    }
}
