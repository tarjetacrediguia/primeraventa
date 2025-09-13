// src/application/use-cases/SolicitudFormal/CrearYAprobarSolicitudFormalUseCase.ts

/**
 * MÓDULO: Caso de Uso - Crear y Aprobar Solicitud Formal
 *
 * Este módulo implementa la lógica de negocio para crear y aprobar una solicitud formal
 * en un solo flujo. Es utilizado principalmente por comerciantes para agilizar el proceso
 * de aprobación de solicitudes sin necesidad de revisión manual.
 *
 * RESPONSABILIDADES:
 * - Crear una nueva solicitud formal con los datos proporcionados
 * - Aprobar inmediatamente la solicitud creada
 * - Validar permisos del comerciante para realizar la operación
 * - Manejar datos de empleador opcionales
 * - Gestionar solicitudes de ampliación de crédito
 * - Registrar comentarios de aprobación
 * - Retornar la solicitud aprobada
 * 
 * FLUJO PRINCIPAL:
 * 1. Crear solicitud formal usando CrearSolicitudFormalUseCase
 * 2. Aprobar inmediatamente usando AprobarSolicitudesFormalesUseCase
 * 3. Retornar solicitud aprobada
 * 
 * CASOS DE USO:
 * - Comerciantes que necesitan aprobar solicitudes rápidamente
 * - Procesos automatizados de aprobación
 * - Flujos de trabajo simplificados para usuarios autorizados
 */

import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";
import { AprobarSolicitudesFormalesUseCase } from "./AprobarSolicitudesFormalesUseCase";
import { CrearSolicitudFormalUseCase } from "./CrearSolicitudFormalUseCase";


export class CrearYAprobarSolicitudFormalUseCase {
  /**
   * Constructor del caso de uso para crear y aprobar solicitudes formales
   * 
   * @param crearUseCase - Caso de uso para crear solicitudes formales
   * @param aprobarUseCase - Caso de uso para aprobar solicitudes formales
   * @param permisoRepo - Repositorio para validación de permisos
   */
  constructor(
    private crearUseCase: CrearSolicitudFormalUseCase,
    private aprobarUseCase: AprobarSolicitudesFormalesUseCase,
    private permisoRepo: PermisoRepositoryPort
  ) {}

  /**
   * Ejecuta la creación y aprobación de una solicitud formal en un solo flujo.
   * 
   * Este método combina la creación y aprobación de solicitudes formales para agilizar
   * el proceso cuando el comerciante tiene permisos para aprobar directamente.
   * 
   * FLUJO DE EJECUCIÓN:
   * 1. Crear solicitud formal con los datos proporcionados
   * 2. Aprobar inmediatamente la solicitud creada
   * 3. Retornar la solicitud aprobada
   * 
   * VALIDACIONES REALIZADAS:
   * - Los casos de uso internos validan los datos de entrada
   * - Se verifica que el comerciante tenga permisos de aprobación
   * - Se valida la existencia de la solicitud inicial
   * - Se verifica la integridad de los datos de empleador (si se proporcionan)
   * 
   * @param solicitudInicialId - ID de la solicitud inicial asociada
   * @param comercianteId - ID del comerciante que crea y aprueba la solicitud
   * @param rol - Rol del usuario que ejecuta la operación
   * @param datosSolicitud - Datos de la solicitud formal a crear
   * @param comentario - Comentario de aprobación (opcional, por defecto: "Solicitud creada y aprobada por comerciante")
   * @param solicitaAmpliacionDeCredito - Indica si se solicita ampliación de crédito
   * @param datosEmpleador - Datos del empleador (opcional)
   * @returns Promise<SolicitudFormal> - Solicitud formal creada y aprobada
   * @throws Error - Si no se cumplen las validaciones o ocurre un error
   */
  async execute(
    solicitudInicialId: number,
    comercianteId: number,
    rol: string,
    datosSolicitud: any,
    comentario: string = "Solicitud creada y aprobada por comerciante",
    solicitaAmpliacionDeCredito: boolean,
    datosEmpleador?: any
  ): Promise<SolicitudFormal> {
    // ===== PASO 1: CREAR SOLICITUD FORMAL =====
    // Crear la solicitud formal usando el caso de uso específico
    const solicitudCreada = await this.crearUseCase.execute(
      solicitudInicialId,
      comercianteId,
      datosSolicitud,
      comentario,
      solicitaAmpliacionDeCredito,
      datosEmpleador
    );

    // ===== PASO 2: APROBAR SOLICITUD INMEDIATAMENTE =====
    // Aprobar la solicitud recién creada usando el caso de uso de aprobación
    const solicitudAprobada = await this.aprobarUseCase.aprobarSolicitud(
      solicitudCreada.getId(),
      comercianteId,
      rol || 'comerciante', // Usar rol proporcionado o 'comerciante' por defecto
      comentario
    );

    // ===== PASO 3: RETORNAR SOLICITUD APROBADA =====
    // Retornar la solicitud formal aprobada
    return solicitudAprobada;
  }
}