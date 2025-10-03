//src/application/constants/historialActions.ts

/**
 * MÓDULO: Constantes de Acciones de Historial
 *
 * Este módulo define las constantes que representan las acciones posibles
 * que pueden ser registradas en el historial de eventos del sistema.
 * Proporciona un conjunto centralizado de identificadores para facilitar
 * la trazabilidad, auditoría y monitoreo de eventos relevantes.
 *
 * RESPONSABILIDADES:
 * - Centralizar los identificadores de acciones para el historial
 * - Facilitar la trazabilidad y auditoría de eventos relevantes
 * - Proporcionar consistencia en el registro de eventos
 * - Permitir el filtrado y búsqueda de eventos específicos
 * - Facilitar la generación de reportes de auditoría
 *
 * CATEGORÍAS DE ACCIONES:
 * 
 * SOLICITUDES INICIALES:
 * - CREATE_SOLICITUD_INICIAL: Creación de una solicitud inicial
 * - APPROVE_SOLICITUD_INICIAL: Aprobación de una solicitud inicial
 * - REJECT_SOLICITUD_INICIAL: Rechazo de una solicitud inicial
 * - PENDING_SOLICITUD_INICIAL: Solicitud inicial pendiente de revisión
 * 
 * SOLICITUDES FORMALES:
 * - CREATE_SOLICITUD_FORMAL: Creación de una solicitud formal
 * - UPDATE_SOLICITUD_FORMAL: Actualización de una solicitud formal
 * - APPROVE_SOLICITUD_FORMAL: Aprobación de una solicitud formal
 * - REJECT_SOLICITUD_FORMAL: Rechazo de una solicitud formal
 * 
 * CONTRATOS:
 * - GENERATE_CONTRATO / GENERAR_CONTRATO: Generación de un contrato
 * - DOWNLOAD_CONTRATO: Descarga de un contrato
 * 
 * COMPRAS:
 * - CREATE_COMPRA: Creación de una compra
 * - APROBAR_COMPRA: Aprobación de una compra
 * - RECHAZAR_COMPRA: Rechazo de una compra
 * - UPDATE_COMPRA: Actualización de una compra
 * - DELETE_COMPRA: Eliminación de una compra
 * - ACCESS_COMPRAS: Acceso a información de compras
 * 
 * AMPLIACIONES DE CRÉDITO:
 * - SOLICITUD_AMPLIACION: Solicitud de ampliación de crédito
 * - APROBAR_AMPLIACION: Aprobación de ampliación de crédito
 * - RECHAZAR_AMPLIACION: Rechazo de ampliación de crédito
 * - COMPRA_CON_AMPLIACION_PENDIENTE: Compra con ampliación pendiente
 * - COMPRA_CON_AMPLIACION_APROBADA: Compra con ampliación aprobada
 * - AMPLIACION_CREDITO_APROBADA: Ampliación de crédito aprobada
 * - AMPLIACION_CREDITO_RECHAZADA: Ampliación de crédito rechazada
 * 
 * EXPIRACIÓN DE SOLICITUDES:
 * - START_EXPIRACION_SOLICITUDES_INICIALES: Inicio del proceso de expiración masiva
 * - START_EXPIRAR_SOLICITUD_INICIAL: Inicio de expiración de una solicitud inicial
 * - EXPIRAR_SOLICITUD_INICIAL: Expiración efectiva de una solicitud inicial
 * - FINISH_EXPIRACION_SOLICITUDES_INICIALES: Fin del proceso de expiración masiva
 * - NO_EXPIRACIONES_SOLICITUDES_INICIALES: No hubo solicitudes iniciales para expirar
 * 
 * SISTEMA:
 * - ERROR_PROCESO: Error en algún proceso relevante
 * - WARNING_DUPLICADO: Advertencia por intento de duplicado
 */

/**
 * Constantes de acciones para el historial del sistema.
 * 
 * Este objeto contiene todas las acciones que pueden ser registradas
 * en el historial de eventos del sistema, organizadas por categorías
 * para facilitar su uso y mantenimiento.
 * 
 * USO:
 * - Importar: import { HISTORIAL_ACTIONS } from './historialActions'
 * - Usar: HISTORIAL_ACTIONS.CREATE_SOLICITUD_INICIAL
 * 
 * NOTA: El modificador 'as const' asegura que TypeScript trate estos
 * valores como literales de tipo en lugar de string genérico.
 */
export const HISTORIAL_ACTIONS = {
    // ===== SOLICITUDES INICIALES =====
    /** Creación de una nueva solicitud inicial de crédito */
    CREATE_SOLICITUD_INICIAL: 'create_solicitud_inicial',
    /** Aprobación de una solicitud inicial de crédito */
    APPROVE_SOLICITUD_INICIAL: 'approve_solicitud_inicial',
    /** Rechazo de una solicitud inicial de crédito */
    REJECT_SOLICITUD_INICIAL: 'reject_solicitud_inicial',
    /** Solicitud inicial pendiente de revisión */
    PENDING_SOLICITUD_INICIAL: 'pending_solicitud_inicial',
    /** Aprobación de una solicitud inicial de crédito (alias en español) */
    APROBAR_SOLICITUD_INICIAL: 'aprobacion_solicitud_inicial',
    /** Rechazo automático de solicitudes iniciales duplicadas al aprobar una compra */
    RECHAZO_AUTOMATICO_SOLICITUDES_DUPLICADAS: 'rechazo_automatico_solicitudes_duplicadas',

    // ===== SOLICITUDES FORMALES =====
    /** Creación de una nueva solicitud formal de crédito */
    CREATE_SOLICITUD_FORMAL: 'create_solicitud_formal',
    /** Actualización de una solicitud formal existente */
    UPDATE_SOLICITUD_FORMAL: 'update_solicitud_formal',
    /** Aprobación de una solicitud formal de crédito */
    APPROVE_SOLICITUD_FORMAL: 'approve_solicitud_formal',
    /** Rechazo de una solicitud formal de crédito */
    REJECT_SOLICITUD_FORMAL: 'reject_solicitud_formal',

    // ===== CONTRATOS =====
    /** Generación de un nuevo contrato (alias en inglés) */
    GENERATE_CONTRATO: 'generate_contrato',
    /** Generación de un nuevo contrato (alias en español) */
    GENERAR_CONTRATO: 'generar_contrato',
    /** Descarga de un contrato existente */
    DOWNLOAD_CONTRATO: 'download_contrato',

    // ===== COMPRAS =====
    /** Creación de una nueva compra */
    CREATE_COMPRA: 'create_compra',
    /** Aprobación de una compra pendiente */
    APROBAR_COMPRA: 'aprobar_compra',
    /** Rechazo de una compra pendiente */
    RECHAZAR_COMPRA: 'rechazar_compra',
    /** Actualización de una compra existente */
    UPDATE_COMPRA: 'update_compra',
    /** Eliminación de una compra */
    DELETE_COMPRA: 'delete_compra',
    /** Acceso a información de compras */
    ACCESS_COMPRAS: 'access_compras',

    // ===== AMPLIACIONES DE CRÉDITO =====
    /** Solicitud de ampliación de crédito */
    SOLICITUD_AMPLIACION: 'solicitud_ampliacion',
    /** Aprobación de ampliación de crédito */
    APROBAR_AMPLIACION: 'aprobar_ampliacion',
    /** Rechazo de ampliación de crédito */
    RECHAZAR_AMPLIACION: 'rechazar_ampliacion',
    /** Compra con ampliación de crédito pendiente */
    COMPRA_CON_AMPLIACION_PENDIENTE: 'compra_con_ampliacion_pendiente',
    /** Compra con ampliación de crédito aprobada */
    COMPRA_CON_AMPLIACION_APROBADA: 'compra_con_ampliacion_aprobada',
    /** Ampliación de crédito aprobada */
    AMPLIACION_CREDITO_APROBADA: 'ampliacion_credito_aprobada',
    /** Ampliación de crédito rechazada */
    AMPLIACION_CREDITO_RECHAZADA: 'ampliacion_credito_rechazada',

    // ===== EXPIRACIÓN DE SOLICITUDES =====
    /** Inicio del proceso de expiración masiva de solicitudes iniciales */
    START_EXPIRACION_SOLICITUDES_INICIALES: 'start_expiracion_solicitudes_iniciales',
    /** Inicio de expiración de una solicitud inicial específica */
    START_EXPIRAR_SOLICITUD_INICIAL: 'start_expirar_solicitud_inicial',
    /** Expiración efectiva de una solicitud inicial */
    EXPIRAR_SOLICITUD_INICIAL: 'expirar_solicitud_inicial',
    /** Fin del proceso de expiración masiva de solicitudes iniciales */
    FINISH_EXPIRACION_SOLICITUDES_INICIALES: 'finish_expiracion_solicitudes_iniciales',
    /** No hubo solicitudes iniciales para expirar en el proceso masivo */
    NO_EXPIRACIONES_SOLICITUDES_INICIALES: 'no_expiraciones_solicitudes_iniciales',

    // ===== SISTEMA =====
    /** Error en algún proceso relevante del sistema */
    ERROR_PROCESO: 'error_proceso',
    /** Advertencia por intento de crear un duplicado */
    WARNING_DUPLICADO: 'warning_duplicado',

} as const;
