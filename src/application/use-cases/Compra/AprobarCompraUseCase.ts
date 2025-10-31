// src/application/use-cases/Compra/AprobarCompraUseCase.ts

/**
 * MÓDULO: Caso de Uso - Aprobar Compra
 *
 * Este módulo implementa la lógica de negocio para aprobar una compra pendiente.
 * Incluye validaciones de estado, verificación de límites de crédito, registro
 * en historial y notificaciones a los usuarios involucrados.
 *
 * RESPONSABILIDADES:
 * - Validar que la compra existe y está en estado PENDIENTE
 * - Verificar que la solicitud formal asociada está aprobada
 * - Confirmar que el monto no excede el límite de crédito
 * - Manejar ampliaciones de crédito automáticamente si es necesario
 * - Asignar número de autorización y cuenta bancaria
 * - Actualizar estado de la compra a "APROBADA"
 * - Registrar evento en el historial del sistema
 * - Notificar al comerciante sobre la aprobación
 * - Manejar errores y excepciones del proceso
 *
 * FLUJO PRINCIPAL:
 * 1. Validación de existencia y estado de compra
 * 2. Validación de solicitud formal asociada
 * 3. Verificación de límites de crédito y ampliaciones
 * 4. Asignación de datos bancarios
 * 5. Actualización de estado a APROBADA
 * 6. Persistencia de cambios
 * 7. Registro en historial
 * 8. Notificación a comerciante
 */

import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { Compra, EstadoCompra } from "../../../domain/entities/Compra";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

export class AprobarCompraUseCase {
  /**
   * Constructor del caso de uso para aprobar compras
   *
   * @param compraRepository - Repositorio para operaciones de compra
   * @param solicitudFormalRepository - Repositorio para operaciones de solicitud formal
   * @param historialRepository - Repositorio para registro de eventos en historial
   * @param notificationService - Servicio para envío de notificaciones
   * @param clienteRepository - Repositorio para operaciones de cliente
   */
  constructor(
    private readonly compraRepository: CompraRepositoryPort,
    private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
    private readonly historialRepository: HistorialRepositoryPort,
    private readonly notificationService: NotificationPort,
    private readonly clienteRepository: ClienteRepositoryPort,
    private readonly solicitudInicialRepository: SolicitudInicialRepositoryPort
  ) {}

  /**
   * Ejecuta la aprobación de una compra pendiente.
   *
   * Este método implementa el flujo completo de aprobación:
   * 1. Obtiene la compra por ID
   * 2. Valida estado pendiente
   * 3. Verifica solicitud formal asociada
   * 4. Confirma límite de crédito y maneja ampliaciones
   * 5. Asigna número de autorización y cuenta bancaria
   * 6. Actualiza estado a aprobada
   * 7. Registra evento en historial
   * 8. Notifica a comerciante
   *
   * VALIDACIONES REALIZADAS:
   * - Compra debe existir y estar en estado PENDIENTE
   * - Solicitud formal debe existir y estar aprobada
   * - Monto no debe exceder límite de crédito (a menos que tenga ampliación)
   * - Número de autorización y cuenta deben ser proporcionados
   *
   * @param id - ID de la compra a aprobar
   * @param usuarioId - ID del usuario que realiza la aprobación
   * @param numeroAutorizacion - Número de autorización bancaria
   * @param numeroCuenta - Número de cuenta bancaria
   * @returns Promise<Compra> - Compra actualizada con estado APROBADA
   * @throws Error - Si no se cumplen las validaciones o ocurre un error
   */
  async execute(
    id: number,
    usuarioId: number,
    numeroAutorizacion: string,
    numeroCuenta: string
  ): Promise<Compra> {
    try {
      // ===== PASO 1: OBTENER Y VALIDAR COMPRA =====
      // Buscar la compra por ID
      const compra = await this.compraRepository.getCompraById(id);

      // Verificar que la compra existe
      if (!compra) {
        // Obtener ID de solicitud formal para el historial de errores
        const solicitudFormalIdSinCompra =
          await this.compraRepository.getSolicitudFormalIdByCompraId(id);
        let solicitudInicialIdSinCompra: number | undefined;

        if (solicitudFormalIdSinCompra) {
          const solicitudFormalSinCompra =
            await this.solicitudFormalRepository.getSolicitudFormalById(
              solicitudFormalIdSinCompra
            );
          solicitudInicialIdSinCompra =
            solicitudFormalSinCompra?.getSolicitudInicialId();
        }

        // Registrar evento de error en historial
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "compras",
          entidadId: id,
          detalles: {
            error: `Compra no encontrada: ${id}`,
            etapa: "obtencion_compra",
          },
          solicitudInicialId: solicitudInicialIdSinCompra,
        });
        throw new Error(`No existe una compra con ID: ${id}`);
      }

      // ===== VALIDAR ESTADOS VÁLIDOS PARA APROBACIÓN =====
      // Permitir aprobar compras pendientes O rechazadas (para cambiar de rechazada a aprobada)
      if (
        compra.getEstado() !== EstadoCompra.PENDIENTE &&
        compra.getEstado() !== EstadoCompra.RECHAZADA
      ) {
        const solicitudInicialId = await this.obtenerSolicitudInicialId(
          compra.getId()
        );

        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "compras",
          entidadId: id,
          detalles: {
            error: `Estado inválido para aprobación: ${compra.getEstado()}`,
            estado_actual: compra.getEstado(),
            estados_permitidos: ["pendiente", "rechazada"],
          },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error(
          `La compra ${id} no puede ser aprobada desde el estado actual: ${compra.getEstado()}. Solo se pueden aprobar compras pendientes o rechazadas.`
        );
      }

      // Obtener solicitud formal asociada
      const solicitudFormalId = compra.getSolicitudFormalId();
      const solicitudFormal =
        await this.solicitudFormalRepository.getSolicitudFormalById(
          solicitudFormalId
        );
      const solicitudInicialId = solicitudFormal?.getSolicitudInicialId();

    

      // ===== PASO 4: VALIDAR SOLICITUD FORMAL ASOCIADA =====
      // Verificar que la solicitud formal existe
      if (!solicitudFormal) {
        // Registrar evento de solicitud no encontrada en historial
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "compras",
          entidadId: id,
          detalles: {
            error: `Solicitud formal no encontrada: ${compra.getSolicitudFormalId()}`,
            etapa: "validacion_solicitud_formal",
          },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error(
          `Solicitud formal asociada no existe: ${compra.getSolicitudFormalId()}`
        );
      }

      // Verificar que la solicitud formal esté en estado "aprobada"
      if (solicitudFormal.getEstado() !== "aprobada") {
        // Registrar evento de estado inválido en historial
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "compras",
          entidadId: id,
          detalles: {
            error: `Solicitud formal no aprobada: ${solicitudFormal.getEstado()}`,
            estado_actual: solicitudFormal.getEstado(),
          },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error(
          `La solicitud formal asociada no está aprobada: ${solicitudFormal.getEstado()}`
        );
      }
      // ===== PASO 5: VALIDAR LÍMITES DE CRÉDITO Y MANEJAR AMPLIACIONES =====
      // Obtener datos para validación de límites
      const montoCompra = compra.getMontoTotal();
      const limiteActual = solicitudFormal.getLimiteCompleto();
      const tieneAmpliacion = solicitudFormal.getSolicitaAmpliacionDeCredito();

      // Verificar si el monto excede el límite actual
      if (montoCompra > limiteActual) {
        // CASO 1: No tiene ampliación de crédito solicitada -> ERROR
        if (!tieneAmpliacion) {
          // Registrar evento de límite excedido sin ampliación en historial
          await this.historialRepository.registrarEvento({
            usuarioId: usuarioId,
            accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
            entidadAfectada: "compras",
            entidadId: id,
            detalles: {
              error: "Límite de crédito excedido sin ampliación solicitada",
              monto_compra: montoCompra,
              limite_credito: limiteActual,
              tiene_ampliacion: false,
            },
            solicitudInicialId: solicitudInicialId,
          });
          throw new Error(
            `El monto de la compra (${montoCompra}) excede el límite de crédito (${limiteActual}) y no se solicitó ampliación.`
          );
        }

        // CASO 2: Tiene ampliación de crédito solicitada -> APROBAR AUTOMÁTICAMENTE
        // Aprobar nuevo límite automáticamente con el monto de la compra
        solicitudFormal.setNuevoLimiteCompletoSolicitado(montoCompra);

        // Registrar evento de ampliación aprobada automáticamente en historial
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.AMPLIACION_CREDITO_APROBADA,
          entidadAfectada: "solicitudes_formales",
          entidadId: solicitudFormal.getId(),
          detalles: {
            monto_anterior: limiteActual,
            nuevo_limite: montoCompra,
            compra_id: id,
          },
          solicitudInicialId: solicitudInicialId,
        });
      }

      // ===== PASO 2: ASIGNAR DATOS BANCARIOS =====
      // Asignar número de autorización y cuenta bancaria a la compra
      compra.setNumeroAutorizacion(numeroAutorizacion);
      compra.setNumeroCuenta(numeroCuenta);

      

      // ===== PASO 6: ACTUALIZAR ESTADO DE LA COMPRA =====
      // Cambiar estado de la compra a APROBADA
      compra.setEstado(EstadoCompra.APROBADA);

      // Asignar ID del analista que aprueba la compra
      compra.setAnalistaAprobadorId(usuarioId);

      // ===== PASO 7: PERSISTIR CAMBIOS =====
      // Actualizar solicitud formal (en caso de ampliación de crédito)
      await this.solicitudFormalRepository.updateSolicitudFormal(
        solicitudFormal
      );

      // Actualizar compra en base de datos
      const compraActualizada = await this.compraRepository.updateCompra(
        compra,
        compra.getClienteId()
      );

      // ===== APROBACIÓN EN CASCADA DE SOLICITUDES ASOCIADAS =====
      await this.aprobarSolicitudesAsociadas(compraActualizada, usuarioId);

      // ===== RECHAZAR SOLICITUDES INICIALES DUPLICADAS =====
      await this.rechazarSolicitudesInicialesDuplicadas(
        compraActualizada,
        solicitudFormal,
        usuarioId
      );

      // ===== PASO 8: REGISTRAR APROBACIÓN EN HISTORIAL =====
      // Registrar evento de aprobación exitosa en historial
      await this.historialRepository.registrarEvento({
        usuarioId: usuarioId,
        accion: HISTORIAL_ACTIONS.APROBAR_COMPRA,
        entidadAfectada: "compras",
        entidadId: id,
        detalles: {
          monto_total: compra.getMontoTotal(),
          cantidad_cuotas: compra.getCantidadCuotas(),
          estado_anterior: compra.getEstado(),
        },
        solicitudInicialId: solicitudInicialId,
      });

      // ===== PASO 9: NOTIFICAR AL COMERCIANTE =====
      // Enviar notificación al comerciante sobre la aprobación
      await this.notificationService.emitNotification({
        userId: solicitudFormal.getComercianteId(),
        type: "compra",
        message: `Compra aprobada: ${compra.getDescripcion()}`,
        metadata: {
          compraId: id,
          monto: compra.getMontoTotal(),
          estado: "aprobada",
        },
      });

      // Retornar la compra actualizada exitosamente
      return compraActualizada;
    } catch (error) {
      // ===== MANEJO DE ERRORES =====
      // Obtener ID de solicitud inicial para el historial de errores
      let solicitudInicialIdError: number | undefined;
      try {
        const solicitudFormalId =
          await this.compraRepository.getSolicitudFormalIdByCompraId(id);
        if (solicitudFormalId) {
          const solicitudFormal =
            await this.solicitudFormalRepository.getSolicitudFormalById(
              solicitudFormalId
            );
          solicitudInicialIdError = solicitudFormal?.getSolicitudInicialId();
        }
      } catch (e) {
        // Log del error pero no interrumpir el flujo principal
        console.error(
          "Error obteniendo solicitudInicialId para historial de error",
          e
        );
      }

      // Registrar evento de error en historial
      await this.historialRepository.registrarEvento({
        usuarioId: usuarioId,
        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
        entidadAfectada: "compras",
        entidadId: id,
        detalles: {
          error: error instanceof Error ? error.message : String(error),
          etapa: "aprobacion_compra",
        },
        solicitudInicialId: solicitudInicialIdError,
      });

      // Enviar notificación de error al usuario
      await this.notificationService.emitNotification({
        userId: usuarioId,
        type: "error",
        message: `Error al aprobar compra ${id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });

      // Re-lanzar el error para que sea manejado por el controlador
      throw error;
    }
  }

  /**
   * Aprobar en cascada las solicitudes formales e iniciales asociadas
   */
  private async aprobarSolicitudesAsociadas(
    compra: Compra,
    usuarioId: number
  ): Promise<void> {
    try {
      // Obtener solicitud formal asociada
      const solicitudFormal =
        await this.solicitudFormalRepository.getSolicitudFormalById(
          compra.getSolicitudFormalId()
        );

      if (!solicitudFormal) {
        console.warn(
          `No se encontró solicitud formal para la compra ${compra.getId()}`
        );
        return;
      }

      const solicitudInicialId = solicitudFormal.getSolicitudInicialId();

      // Aprobar solicitud formal si no está ya aprobada
      if (solicitudFormal.getEstado() !== "aprobada") {
        const estadoAnteriorFormal = solicitudFormal.getEstado();
        solicitudFormal.setEstado("aprobada");
        solicitudFormal.setAnalistaAprobadorId(usuarioId);

        await this.solicitudFormalRepository.updateSolicitudFormal(
          solicitudFormal
        );

        // Registrar en historial
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.APROBAR_SOLICITUD_FORMAL_AUTOMATICO,
          entidadAfectada: "solicitudes_formales",
          entidadId: solicitudFormal.getId(),
          detalles: {
            compra_id: compra.getId(),
            estado_anterior: estadoAnteriorFormal,
          },
          solicitudInicialId: solicitudInicialId,
        });

        console.log(
          `✅ Solicitud formal ${solicitudFormal.getId()} aprobada automáticamente por aprobación de compra. Estado anterior: ${estadoAnteriorFormal}`
        );
      }

      // Aprobar solicitud inicial si no está ya aprobada
      const solicitudInicial =
        await this.solicitudInicialRepository.getSolicitudInicialById(
          solicitudInicialId
        );

      if (solicitudInicial && solicitudInicial.getEstado() !== "aprobada") {
        // Obtener cliente para la actualización
        const cliente = await this.clienteRepository.findById(
          solicitudInicial.getClienteId()
        );

        if (cliente) {
          const estadoAnteriorInicial = solicitudInicial.getEstado();
          solicitudInicial.setEstado("aprobada");
          solicitudInicial.setAnalistaAprobadorId(usuarioId);

          await this.solicitudInicialRepository.updateSolicitudInicialAprobaciónRechazo(
            solicitudInicial,
            cliente
          );

          // Registrar en historial
          await this.historialRepository.registrarEvento({
            usuarioId: usuarioId,
            accion: HISTORIAL_ACTIONS.APROBAR_SOLICITUD_INICIAL_AUTOMATICO,
            entidadAfectada: "solicitudes_iniciales",
            entidadId: solicitudInicialId,
            detalles: {
              compra_id: compra.getId(),
              estado_anterior: estadoAnteriorInicial,
            },
            solicitudInicialId: solicitudInicialId,
          });

          console.log(
            `✅ Solicitud inicial ${solicitudInicialId} aprobada automáticamente por aprobación de compra. Estado anterior: ${estadoAnteriorInicial}`
          );
        }
      }
    } catch (error) {
      console.error("❌ Error en aprobación en cascada de solicitudes:", error);
      // No lanzamos el error para no interrumpir el flujo principal de aprobación de compra
      // Pero registramos el error en el historial
      await this.historialRepository.registrarEvento({
        usuarioId: usuarioId,
        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
        entidadAfectada: "compras",
        entidadId: compra.getId(),
        detalles: {
          error: `Error en aprobación en cascada: ${
            error instanceof Error ? error.message : String(error)
          }`,
          etapa: "aprobacion_cascada_solicitudes",
        },
        solicitudInicialId: await this.obtenerSolicitudInicialId(
          compra.getId()
        ),
      });
    }
  }

  /**
   * MÉTODO AUXILIAR: Obtener ID de solicitud inicial
   */
  private async obtenerSolicitudInicialId(
    compraId: number
  ): Promise<number | undefined> {
    try {
      const solicitudFormalId =
        await this.compraRepository.getSolicitudFormalIdByCompraId(compraId);

      if (!solicitudFormalId) return undefined;

      const solicitudFormal =
        await this.solicitudFormalRepository.getSolicitudFormalById(
          solicitudFormalId
        );

      return solicitudFormal?.getSolicitudInicialId();
    } catch (e) {
      console.error("Error obteniendo solicitudInicialId", e);
      return undefined;
    }
  }

  /**
   * Rechaza automáticamente las demás solicitudes iniciales del mismo cliente
   * cuando se concreta una compra
   */
  private async rechazarSolicitudesInicialesDuplicadas(
    compra: Compra,
    solicitudFormal: any,
    usuarioId: number
  ): Promise<void> {
    try {
      // Obtener la solicitud inicial asociada a esta compra
      const solicitudInicialOrigen =
        await this.solicitudInicialRepository.getSolicitudInicialById(
          solicitudFormal.getSolicitudInicialId()
        );

      if (!solicitudInicialOrigen) {
        console.warn(
          `No se encontró solicitud inicial para la compra ${compra.getId()}`
        );
        return;
      }

      // Obtener CUIL del cliente
      const cuilCliente = solicitudInicialOrigen.getCuilCliente();
      if (!cuilCliente) {
        console.warn(
          `No se pudo obtener CUIL del cliente para la compra ${compra.getId()}`
        );
        return;
      }

      console.log(
        `🔄 Rechazando solicitudes duplicadas para CUIL: ${cuilCliente}, compra: ${compra.getId()}`
      );

      // Usar el método del repositorio que ahora devuelve las solicitudes rechazadas
      const solicitudesRechazadas =
        await this.compraRepository.rechazarSolicitudesInicialesPorCompra(
          cuilCliente,
          solicitudInicialOrigen.getId()
        );

      // Registrar en el historial y notificar por cada solicitud rechazada
      for (const solicitud of solicitudesRechazadas) {
        // Registrar en historial usando el puerto
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.RECHAZO_AUTOMATICO_SOLICITUDES_DUPLICADAS,
          entidadAfectada: "solicitudes_iniciales",
          entidadId: solicitud.id,
          detalles: {
            motivo: "Rechazada por concreción de compra en otro local",
            cuil_cliente: cuilCliente,
            solicitud_inicial_excluida: solicitudInicialOrigen.getId(),
            compra_id: compra.getId(),
          },
          solicitudInicialId: solicitud.id,
        });

        // Notificar al comerciante afectado usando el puerto
        if (solicitud.comercianteId) {
          await this.notificationService.emitNotification({
            userId: solicitud.comercianteId,
            type: "solicitud_inicial",
            message: `Solicitud rechazada: El cliente con CUIL ${cuilCliente} concretó una compra en otro comercio`,
            metadata: {
              motivo: "compra_concretada_otro_comercio",
              cuil_cliente: cuilCliente,
              solicitud_inicial_id: solicitud.id,
            },
          });
        }
      }

      console.log(
        `✅ ${solicitudesRechazadas.length} solicitudes duplicadas rechazadas para CUIL: ${cuilCliente}`
      );
    } catch (error) {
      console.error("❌ Error rechazando solicitudes duplicadas:", error);
      // No lanzar error para no interrumpir el flujo principal de aprobación de compra
    }
  }
}
