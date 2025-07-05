// src/application/use-cases/SolicitudFormal/UpdateSolicitudFormalUseCase.ts

/**
 * MÓDULO: Caso de Uso - Actualizar Solicitud Formal
 *
 * Este módulo implementa la lógica de negocio para actualizar solicitudes formales
 * de crédito, incluyendo la detección de cambios y el registro de modificaciones
 * en el historial del sistema.
 *
 * RESPONSABILIDADES:
 * - Validar que la solicitud exista y no esté aprobada
 * - Detectar cambios entre la versión original y la actualizada
 * - Actualizar la solicitud formal en la base de datos
 * - Registrar cambios en el historial del sistema
 * - Manejar errores durante el proceso de actualización
 * - Comparar arrays y objetos para detectar modificaciones
 */

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";

/**
 * Caso de uso para actualizar solicitudes formales de crédito.
 * 
 * Esta clase implementa la lógica para actualizar solicitudes formales,
 * incluyendo la detección automática de cambios y el registro de modificaciones
 * en el historial del sistema para auditoría.
 */
export class UpdateSolicitudFormalUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     * @param historialRepository - Puerto para registro de eventos en historial
     */
    constructor(
        private readonly repository: SolicitudFormalRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort
    ) {}

    /**
     * Ejecuta la actualización de una solicitud formal.
     * 
     * Este método implementa el flujo completo de actualización:
     * 1. Obtiene la versión original de la solicitud
     * 2. Valida que la solicitud no esté aprobada
     * 3. Detecta cambios entre la versión original y la actualizada
     * 4. Actualiza la solicitud en la base de datos
     * 5. Registra los cambios en el historial si los hay
     * 
     * @param solicitud - La solicitud formal con los datos actualizados
     * @param usuarioId - ID del usuario que realiza la actualización
     * @param comentario - Comentario opcional sobre la actualización
     * @returns Promise<SolicitudFormal> - La solicitud formal actualizada
     * @throws Error - Si la solicitud no existe, está aprobada o ocurre un error en el proceso
     */
    async execute(
        solicitud: SolicitudFormal,
        usuarioId: number,
        comentario?: string
    ): Promise<SolicitudFormal> {

        // 1. Obtener la versión anterior para comparar cambios
            const original = await this.repository.getSolicitudFormalById(solicitud.getId());
            const solicitudInicialId = original?.getSolicitudInicialId();

        try {
            
            
            if (!original) {
                throw new Error("Solicitud no encontrada");
            }

            if (original.getEstado() == "aprobada") {
                throw new Error("No se puede actualizar una solicitud aprobada");
            }

            // 2. Detectar cambios antes de actualizar
            const cambios = this.detectarCambios(original, solicitud);
            
            // 3. Actualizar la solicitud
            const actualizada = await this.repository.updateSolicitudFormal(solicitud);
            
            // 4. Registrar en el historial si hay cambios
            if (cambios.length > 0) {
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.UPDATE_SOLICITUD_FORMAL,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitud.getId(),
                    detalles: {
                        cambios: cambios,
                        comentario: comentario || ""
                    },
                    solicitudInicialId: solicitudInicialId
                });
            }
            
            return actualizada;
        } catch (error) {
            // Registrar error en el historial
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'solicitudes_formales',
                entidadId: solicitud.getId(),
                detalles: {
                    error: error instanceof Error ? error.message : String(error),
                    etapa: "actualizacion_solicitud_formal"
                },
                    solicitudInicialId: solicitudInicialId
            });
            
            throw error;
        }
    }

    /**
     * Detecta cambios entre la versión original y la actualizada de una solicitud formal.
     * 
     * Este método privado compara todos los campos relevantes de la solicitud
     * y retorna un array con los cambios detectados, incluyendo el campo modificado,
     * el valor anterior y el nuevo valor.
     * 
     * @param original - La solicitud formal original
     * @param actualizada - La solicitud formal con los cambios
     * @returns any[] - Array con los cambios detectados
     */
    private detectarCambios(original: SolicitudFormal, actualizada: SolicitudFormal): any[] {
        const cambios: any[] = [];
        
        // Lista de campos a monitorear
        const campos = [
            'nombreCompleto', 'apellido', 'dni', 'telefono', 'email',
            'fechaSolicitud', 'estado', 'aceptaTarjeta', 'fechaNacimiento',
            'domicilio', 'datosEmpleador', 'referentes', 'comentarios',
            'clienteId', 'numeroTarjeta', 'numeroCuenta', 'fechaAprobacion',
            'analistaAprobadorId', 'administradorAprobadorId'
        ];
        
        for (const campo of campos) {
            const valorOriginal = (original as any)[campo];
            const valorActual = (actualizada as any)[campo];
            
            // Comparación especial para arrays y objetos
            if (Array.isArray(valorOriginal)) {
                if (!this.sonArraysIguales(valorOriginal, valorActual)) {
                    cambios.push({
                        campo,
                        anterior: valorOriginal,
                        nuevo: valorActual
                    });
                }
            } else if (valorOriginal !== valorActual) {
                cambios.push({
                    campo,
                    anterior: valorOriginal,
                    nuevo: valorActual
                });
            }
        }
        
        return cambios;
    }

    /**
     * Compara si dos arrays son iguales, incluyendo comparación de objetos.
     * 
     * Este método privado realiza una comparación profunda de arrays,
     * manejando tanto valores primitivos como objetos mediante JSON.stringify.
     * 
     * @param arr1 - Primer array a comparar
     * @param arr2 - Segundo array a comparar
     * @returns boolean - true si los arrays son iguales, false en caso contrario
     */
    private sonArraysIguales(arr1: any[], arr2: any[]): boolean {
        if (arr1.length !== arr2.length) return false;
        
        for (let i = 0; i < arr1.length; i++) {
            if (typeof arr1[i] === 'object') {
                if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
                    return false;
                }
            } else if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        
        return true;
    }
}
