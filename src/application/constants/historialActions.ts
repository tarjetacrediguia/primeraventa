//src/application/constants/historialActions.ts

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
    GENERAR_CONTRATO: 'generar_contrato',
} as const;