//src/application/constants/historialActions.ts

/**
 * MÓDULO: Constantes de Acciones de Historial
 *
 * Este módulo define las constantes que representan las acciones posibles
 * que pueden ser registradas en el historial de eventos del sistema.
 *
 * RESPONSABILIDADES:
 * - Centralizar los identificadores de acciones para el historial
 * - Facilitar la trazabilidad y auditoría de eventos relevantes
 *
 * ACCIONES DISPONIBLES:
 * - CREATE_SOLICITUD_INICIAL: Creación de una solicitud inicial
 * - APPROVE_SOLICITUD_INICIAL: Aprobación de una solicitud inicial
 * - REJECT_SOLICITUD_INICIAL: Rechazo de una solicitud inicial
 * - CREATE_SOLICITUD_FORMAL: Creación de una solicitud formal
 * - UPDATE_SOLICITUD_FORMAL: Actualización de una solicitud formal
 * - APPROVE_SOLICITUD_FORMAL: Aprobación de una solicitud formal
 * - REJECT_SOLICITUD_FORMAL: Rechazo de una solicitud formal
 * - GENERATE_CONTRATO / GENERAR_CONTRATO: Generación de un contrato
 * - DOWNLOAD_CONTRATO: Descarga de un contrato
 * - ERROR_PROCESO: Error en algún proceso relevante
 * - START_EXPIRACION_SOLICITUDES_INICIALES: Inicio del proceso de expiración masiva
 * - START_EXPIRAR_SOLICITUD_INICIAL: Inicio de expiración de una solicitud inicial
 * - EXPIRAR_SOLICITUD_INICIAL: Expiración efectiva de una solicitud inicial
 * - FINISH_EXPIRACION_SOLICITUDES_INICIALES: Fin del proceso de expiración masiva
 * - NO_EXPIRACIONES_SOLICITUDES_INICIALES: No hubo solicitudes iniciales para expirar
 * - WARNING_DUPLICADO: Advertencia por intento de duplicado
 */

export const HISTORIAL_ACTIONS = {
    CREATE_SOLICITUD_INICIAL: 'create_solicitud_inicial',
    APPROVE_SOLICITUD_INICIAL: 'approve_solicitud_inicial',
    REJECT_SOLICITUD_INICIAL: 'reject_solicitud_inicial',
    CREATE_SOLICITUD_FORMAL: 'create_solicitud_formal',
    UPDATE_SOLICITUD_FORMAL: 'update_solicitud_formal',
    APPROVE_SOLICITUD_FORMAL: 'approve_solicitud_formal',
    GENERATE_CONTRATO: 'generate_contrato',
    DOWNLOAD_CONTRATO: 'download_contrato',
    ERROR_PROCESO: 'error_proceso',
    REJECT_SOLICITUD_FORMAL: 'reject_solicitud_formal',
    START_EXPIRACION_SOLICITUDES_INICIALES: 'start_expiracion_solicitudes_iniciales',
    START_EXPIRAR_SOLICITUD_INICIAL: 'start_expirar_solicitud_inicial',
    EXPIRAR_SOLICITUD_INICIAL: 'expirar_solicitud_inicial',
    FINISH_EXPIRACION_SOLICITUDES_INICIALES: 'finish_expiracion_solicitudes_iniciales',
    NO_EXPIRACIONES_SOLICITUDES_INICIALES: 'no_expiraciones_solicitudes_iniciales',
    WARNING_DUPLICADO: 'warning_duplicado',
    GENERAR_CONTRATO: 'generar_contrato'
} as const;
