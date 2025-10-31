// src/application/use-cases/Compra/CrearCompraUseCase.ts

/**
 * MÓDULO: Caso de Uso - Crear Compra
 *
 * Implementa la creación de una nueva compra asociada a una solicitud formal.
 * Incluye validaciones exhaustivas, registro en historial y notificaciones.
 *
 * RESPONSABILIDADES:
 * - Validar solicitud formal existente y aprobada
 * - Verificar rango de cuotas (3-14)
 * - Validar monto total de compra
 * - Verificar límites de crédito y ampliaciones
 * - Crear entidad Compra con estado PENDIENTE
 * - Guardar en repositorio
 * - Registrar evento en historial
 * - Notificar a analistas para revisión
 * - Manejar errores y excepciones
 *
 * FLUJO PRINCIPAL:
 * 1. Validación de solicitud formal (existencia y estado)
 * 2. Validación de parámetros de entrada (cuotas y monto)
 * 3. Verificación de límites de crédito
 * 4. Creación de entidad Compra
 * 5. Persistencia en base de datos
 * 6. Registro de evento en historial
 * 7. Notificación a analistas
 */

import { Compra, EstadoCompra } from "../../../domain/entities/Compra";
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { SolicitudInicialRepositoryAdapter } from "../../../infrastructure/adapters/repository/SolicitudInicialRepositoryAdapter";

export class CrearCompraUseCase {
  /**
   * Constructor del caso de uso para crear compras
   *
   * @param compraRepository - Repositorio para operaciones de compra
   * @param solicitudFormalRepository - Repositorio para operaciones de solicitud formal
   * @param historialRepository - Repositorio para registro de eventos en historial
   * @param notificationService - Servicio para envío de notificaciones
   * @param analistaRepo - Repositorio para operaciones de analistas
   * @param solicitudInicialRepository - Repositorio para operaciones de solicitud inicial
   */
  constructor(
    private readonly compraRepository: CompraRepositoryPort,
    private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
    private readonly historialRepository: HistorialRepositoryPort,
    private readonly notificationService: NotificationPort,
    private readonly analistaRepo: AnalistaRepositoryPort,
    private readonly solicitudInicialRepository: SolicitudInicialRepositoryAdapter
  ) {}

  /**
   * Ejecuta la creación de una nueva compra.
   *
   * Flujo completo:
   * 1. Valida solicitud formal existente y aprobada
   * 2. Verifica rango de cuotas (3-14)
   * 3. Valida monto total de compra
   * 4. Verifica límites de crédito y maneja ampliaciones
   * 5. Crea entidad Compra con estado PENDIENTE
   * 6. Guarda en repositorio
   * 7. Registra evento en historial
   * 8. Notifica a analistas para revisión
   *
   * VALIDACIONES REALIZADAS:
   * - Solicitud formal debe existir y estar en estado "aprobada"
   * - Cantidad de cuotas debe estar entre 3 y 14
   * - Monto total debe ser mayor que cero
   * - Monto no debe exceder límite de crédito (a menos que tenga ampliación)
   *
   * @param solicitudFormalId - ID de solicitud formal asociada
   * @param descripcion - Descripción general de la compra
   * @param cantidadCuotas - Número de cuotas (3-14)
   * @param montoTotal - Monto total de la compra
   * @param usuarioId - ID del usuario que crea la compra
   * @returns Promise<Compra> - Compra creada con estado PENDIENTE
   * @throws Error - Si no se cumplen las validaciones requeridas
   */
  async execute(
    solicitudFormalId: number,
    descripcion: string,
    cantidadCuotas: number,
    montoTotal: number,
    usuarioId: number
  ): Promise<Compra> {
    // Variable para almacenar el ID de solicitud inicial para el historial
    let solicitudInicialId: number | undefined;

    try {
      // ===== PASO 1: VALIDACIÓN DE SOLICITUD FORMAL =====
      // Buscar la solicitud formal por ID
      const solicitudFormal =
        await this.solicitudFormalRepository.getSolicitudFormalById(
          solicitudFormalId
        );

      // Verificar que la solicitud formal existe
      if (!solicitudFormal) {
        // Obtener ID de solicitud inicial para el historial de errores
        solicitudInicialId = await this.obtenerSolicitudInicialId(
          solicitudFormalId
        );

        // Registrar evento de error en historial
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "compras",
          entidadId: 0,
          detalles: {
            error: `Solicitud formal no encontrada: ${solicitudFormalId}`,
            etapa: "validacion_solicitud_formal",
          },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error(
          `No existe una solicitud formal con ID: ${solicitudFormalId}`
        );
      }

      // ===== VERIFICAR SI EXISTE COMPRA APROBADA =====
            const existeAprobada = await this.compraRepository.existeCompraAprobada(solicitudFormalId);
            if (existeAprobada) {
                const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(
                    solicitudFormal.getSolicitudInicialId()
                );
                
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: "compras",
                    entidadId: 0,
                    detalles: {
                        error: "Ya existe una compra aprobada para esta solicitud formal",
                        solicitud_formal_id: solicitudFormalId,
                    },
                    solicitudInicialId: solicitudInicial?.getId(),
                });
                throw new Error("No se puede crear la compra porque ya existe una compra aprobada para esta solicitud formal.");
            }

      // Obtener la solicitud inicial asociada para validaciones adicionales
      const solicitudInicial =
        await this.solicitudInicialRepository.getSolicitudInicialById(
          solicitudFormal.getSolicitudInicialId()
        );
      if (!solicitudInicial) {
        throw new Error(
          `Solicitud inicial no encontrada para ID: ${solicitudFormal.getSolicitudInicialId()}`
        );
      }

      // ===== NUEVA VALIDACIÓN: ESTADOS PERMITIDOS =====
      const estadosPermitidos = [
        "aprobada",
        "pendiente",
        "pendiente_aprobacion_inicial",
      ];
      const estadoActual = solicitudFormal.getEstado();

      if (!estadosPermitidos.includes(estadoActual)) {
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "compras",
          entidadId: 0,
          detalles: {
            error: `Estado de solicitud formal no permitido para crear compra: ${estadoActual}`,
            estado_actual: estadoActual,
            estados_permitidos: estadosPermitidos,
          },
          solicitudInicialId: solicitudInicial.getId(),
        });
        throw new Error(
          `No se puede crear compra. La solicitud formal está en estado: ${estadoActual}`
        );
      }

      // ===== VALIDACIÓN ADICIONAL PARA ESTADOS PENDIENTES =====
      if (estadoActual === "pendiente_aprobacion_inicial") {
        // Verificar que la solicitud inicial esté aprobada
        if (solicitudInicial.getEstado() !== "aprobada") {
          await this.historialRepository.registrarEvento({
            usuarioId: usuarioId,
            accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
            entidadAfectada: "compras",
            entidadId: 0,
            detalles: {
              error:
                "No se puede crear compra: La solicitud inicial no está aprobada",
              estado_solicitud_inicial: solicitudInicial.getEstado(),
              estado_solicitud_formal: estadoActual,
            },
            solicitudInicialId: solicitudInicial.getId(),
          });
          throw new Error(
            "No se puede crear compra. La solicitud inicial asociada no está aprobada."
          );
        }

        // Registrar evento informativo
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.COMPRA_CON_SOLICITUD_PENDIENTE,
          entidadAfectada: "compras",
          entidadId: 0,
          detalles: {
            estado_solicitud_formal: estadoActual,
            mensaje:
              "Compra creada pero sujeta a aprobación de solicitud formal",
          },
          solicitudInicialId: solicitudInicial.getId(),
        });
      }

      // ===== PASO 2: VALIDACIÓN DE CANTIDAD DE CUOTAS =====
      // Verificar que la cantidad de cuotas esté dentro del rango permitido (3-14)
      if (cantidadCuotas < 3 || cantidadCuotas > 14) {
        // Registrar evento de error en historial
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "compras",
          entidadId: 0,
          detalles: {
            error: "Cantidad de cuotas inválida",
            cuotas_provistas: cantidadCuotas,
            rango_permitido: "3-14",
          },
          solicitudInicialId: solicitudInicial.getId(),
        });
        throw new Error("La cantidad de cuotas debe estar entre 3 y 14");
      }

      // ===== PASO 3: VALIDACIÓN DE MONTO TOTAL =====
      // Verificar que el monto total sea válido (mayor que cero)
      if (montoTotal <= 0) {
        // Registrar evento de error en historial
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "compras",
          entidadId: 0,
          detalles: {
            error: "Monto total inválido",
            monto_provisto: montoTotal,
          },
          solicitudInicialId: solicitudInicial.getId(),
        });
        throw new Error("El monto total debe ser mayor que cero");
      }

      // ===== PASO 4: VALIDACIÓN DE LÍMITES DE CRÉDITO =====
      await this.validarLimitesCredito(
        solicitudFormal,
        montoTotal,
        usuarioId,
        solicitudInicial.getId()
      );

      // ===== PASO 5: CREACIÓN DE ENTIDAD COMPRA =====
      // Crear nueva instancia de Compra con estado PENDIENTE
      const compra = new Compra({
                id: 0,
                solicitudFormalId: solicitudFormalId,
                descripcion: descripcion,
                cantidadCuotas: cantidadCuotas,
                estado: EstadoCompra.PENDIENTE,
                montoTotal: montoTotal,
                fechaCreacion: new Date(),
                fechaActualizacion: new Date(),
                valorCuota: cantidadCuotas > 0 ? montoTotal / cantidadCuotas : 0,
                clienteId: solicitudFormal.getClienteId(),
                comercianteId: usuarioId,
            });

      // ===== PASO 6: PERSISTENCIA EN BASE DE DATOS =====
      // Guardar la compra en el repositorio
      const compraCreada = await this.compraRepository.saveCompra(
        compra,
        solicitudFormal.getClienteId()
      );

      // ===== PASO 7: REGISTRO EN HISTORIAL =====
      // Registrar evento de creación exitosa en historial
      await this.registrarCreacionCompraEnHistorial(
        compraCreada,
        usuarioId,
        solicitudInicial.getId(),
        estadoActual
      );

      // ===== PASO 8: NOTIFICACIÓN A ANALISTAS =====
      // Notificar a analistas sobre nueva compra pendiente de revisión
      await this.notificarAnalistas(
        compraCreada,
        usuarioId,
        solicitudInicial.getId()
      );

      // Retornar la compra creada exitosamente
      return compraCreada;
    } catch (error) {
      // ===== MANEJO DE ERRORES =====
      // Obtener ID de solicitud inicial si no se había obtenido antes
      if (solicitudInicialId === undefined) {
        solicitudInicialId = await this.obtenerSolicitudInicialId(
          solicitudFormalId
        );
      }

      // Registrar evento de error en historial
      await this.historialRepository.registrarEvento({
        usuarioId: usuarioId,
        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
        entidadAfectada: "compras",
        entidadId: 0,
        detalles: {
          error: error instanceof Error ? error.message : String(error),
          etapa: "creacion_compra",
          solicitud_formal_id: solicitudFormalId,
        },
        solicitudInicialId: solicitudInicialId,
      });

      // Enviar notificación de error al usuario
      await this.notificationService.emitNotification({
        userId: usuarioId,
        type: "error",
        message: `Error al crear compra: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });

      // Re-lanzar el error para que sea manejado por el controlador
      throw error;
    }
  }

  /**
   * Valida los límites de crédito considerando el estado de la solicitud formal
   */
  private async validarLimitesCredito(
    solicitudFormal: any,
    montoTotal: number,
    usuarioId: number,
    solicitudInicialId: number
  ): Promise<void> {
    const estadoActual = solicitudFormal.getEstado();
    const limiteActual = solicitudFormal.getLimiteCompleto();

    // Para estados no aprobados, validación más estricta
    if (estadoActual !== "aprobada" && montoTotal > limiteActual) {
      await this.historialRepository.registrarEvento({
        usuarioId: usuarioId,
        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
        entidadAfectada: "compras",
        entidadId: 0,
        detalles: {
          error: "Monto excede límite de crédito en solicitud no aprobada",
          montoTotal: montoTotal,
          limite_credito: limiteActual,
          estado_solicitud: estadoActual,
          mensaje: "No se puede exceder el límite en solicitudes pendientes",
        },
        solicitudInicialId: solicitudInicialId,
      });

      throw new Error(
        `El monto (${montoTotal}) excede el límite de crédito (${limiteActual}). ` +
          `No se puede exceder el límite mientras la solicitud formal esté en estado: ${estadoActual}`
      );
    }

    // Para estados aprobados, mantener lógica original de ampliación
    if (estadoActual === "aprobada" && montoTotal > limiteActual) {
      if (!solicitudFormal.getSolicitaAmpliacionDeCredito()) {
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "compras",
          entidadId: 0,
          detalles: {
            error: "Monto excede límite de crédito",
            montoTotal: montoTotal,
            limite_credito: limiteActual,
            tiene_ampliacion: false,
          },
          solicitudInicialId: solicitudInicialId,
        });

        throw new Error(
          `El monto (${montoTotal}) excede el límite de crédito (${limiteActual}). ` +
            `Solicite ampliación primero.`
        );
      } else {
        // Manejar ampliación (mantener lógica existente)
        solicitudFormal.setNuevoLimiteCompletoSolicitado(montoTotal);
        await this.solicitudFormalRepository.updateSolicitudFormal(
          solicitudFormal
        );

        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.COMPRA_CON_AMPLIACION_PENDIENTE,
          entidadAfectada: "compras",
          entidadId: 0,
          detalles: {
            monto_ampliado: montoTotal,
            limite_credito: limiteActual,
            nuevo_limite_solicitado:
              solicitudFormal.getNuevoLimiteCompletoSolicitado(),
          },
          solicitudInicialId: solicitudInicialId,
        });
      }
    }
  }

  /**
   * Registra la creación de compra con información contextual del estado
   */
  private async registrarCreacionCompraEnHistorial(
    compra: Compra,
    usuarioId: number,
    solicitudInicialId: number,
    estadoSolicitudFormal: string
  ): Promise<void> {
    const detallesBase = {
      solicitud_formal_id: compra.getSolicitudFormalId(),
      monto_total: compra.getMontoTotal(),
      cantidad_cuotas: compra.getCantidadCuotas(),
      estado_solicitud_formal: estadoSolicitudFormal,
    };

    // Agregar información contextual según el estado
    const detallesAdicionales: any = {};

    if (estadoSolicitudFormal === "pendiente_aprobacion_inicial") {
      detallesAdicionales.mensaje_contextual =
        "Compra creada pero sujeta a aprobación de solicitud formal";
      detallesAdicionales.restriccion =
        "La compra no podrá ser aprobada hasta que la solicitud formal sea aprobada";
    } else if (estadoSolicitudFormal === "pendiente") {
      detallesAdicionales.mensaje_contextual =
        "Compra creada pero sujeta a aprobación de solicitud formal";
    }

    await this.historialRepository.registrarEvento({
      usuarioId: usuarioId,
      accion: HISTORIAL_ACTIONS.CREATE_COMPRA,
      entidadAfectada: "compras",
      entidadId: compra.getId(),
      detalles: { ...detallesBase, ...detallesAdicionales },
      solicitudInicialId: solicitudInicialId,
    });
  }

  /**
   * Método auxiliar para obtener el ID de solicitud inicial asociada a una solicitud formal.
   *
   * Este método se utiliza principalmente para el registro de eventos en el historial
   * cuando ocurren errores y necesitamos asociar el evento con la solicitud inicial.
   *
   * @param solicitudFormalId - ID de la solicitud formal
   * @returns Promise<number | undefined> - ID de la solicitud inicial o undefined si no se encuentra
   */
  private async obtenerSolicitudInicialId(
    solicitudFormalId: number
  ): Promise<number | undefined> {
    try {
      // Buscar la solicitud formal por ID
      const solicitudFormal =
        await this.solicitudFormalRepository.getSolicitudFormalById(
          solicitudFormalId
        );
      if (solicitudFormal) {
        // Obtener la solicitud inicial asociada
        const solicitudInicial =
          await this.solicitudInicialRepository.getSolicitudInicialById(
            solicitudFormal.getSolicitudInicialId()
          );
        return solicitudInicial?.getId();
      }
    } catch (e) {
      // Log del error pero no lanzar excepción para no interrumpir el flujo principal
      console.error("Error obteniendo solicitudInicialId", e);
    }
    return undefined;
  }

  /**
   * Notifica a analistas sobre nueva compra pendiente de revisión.
   *
   * Este método obtiene todos los analistas activos del sistema y les envía
   * una notificación sobre la nueva compra que requiere revisión.
   *
   * @param compra - Compra creada que requiere revisión
   * @param usuarioId - ID del usuario que creó la compra
   * @param solicitudInicialId - ID de la solicitud inicial asociada (opcional)
   */
  private async notificarAnalistas(
    compra: Compra,
    usuarioId: number,
    solicitudInicialId: number | undefined
  ): Promise<void> {
    try {
      const analistaIds = await this.analistaRepo.obtenerIdsAnalistasActivos();

      // Obtener información contextual para la notificación
      const solicitudFormal =
        await this.solicitudFormalRepository.getSolicitudFormalById(
          compra.getSolicitudFormalId()
        );

      const estadoSolicitud = solicitudFormal?.getEstado() || "desconocido";
      let mensajePrioridad = "Nueva compra pendiente de revisión";
      let prioridad = "media";

      // Ajustar mensaje y prioridad según el estado
      if (estadoSolicitud === "pendiente_aprobacion_inicial") {
        mensajePrioridad =
          "⚠️ Compra creada - Esperando aprobación de solicitud formal";
        prioridad = "baja";
      } else if (estadoSolicitud === "pendiente") {
        mensajePrioridad = "📋 Compra creada - Solicitud formal pendiente";
        prioridad = "media";
      }

      const notificaciones = analistaIds.map((analistaId) =>
        this.notificationService.emitNotification({
          userId: analistaId,
          type: "compra",
          message: mensajePrioridad,
          metadata: {
            compraId: compra.getId(),
            descripcion: compra.getDescripcion(),
            monto: compra.getMontoTotal(),
            prioridad: prioridad,
            estadoSolicitudFormal: estadoSolicitud,
            requiereAprobacionSolicitud: estadoSolicitud !== "aprobada",
          },
        })
      );

      await Promise.all(notificaciones);
    } catch (error) {
      // Registrar error en historial si falla la notificación
      await this.historialRepository.registrarEvento({
        usuarioId: usuarioId,
        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
        entidadAfectada: "compras",
        entidadId: compra.getId(),
        detalles: {
          error: "Error notificando a analistas",
          error_detalle: error instanceof Error ? error.message : String(error),
        },
        solicitudInicialId: solicitudInicialId,
      });
    }
  }
}
