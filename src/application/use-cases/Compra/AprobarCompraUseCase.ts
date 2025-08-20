// src/application/use-cases/Compra/AprobarCompraUseCase.ts

/**
 * MÓDULO: Caso de Uso - Aprobar Compra
 *
 * Este módulo implementa la lógica de negocio para aprobar una compra pendiente.
 * Incluye validaciones de estado, verificación de límites de crédito, registro
 * en historial y notificaciones a los usuarios involucrados.
 *
 * RESPONSABILIDADES:
 * - Validar que la compra existe y está pendiente
 * - Verificar que la solicitud formal asociada está aprobada
 * - Confirmar que el monto no excede el límite de crédito
 * - Actualizar estado de la compra a "aprobada"
 * - Registrar evento en el historial del sistema
 * - Notificar al comerciante y al cliente sobre la aprobación
 * - Manejar errores y excepciones del proceso
 */

import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { Compra, EstadoCompra } from "../../../domain/entities/Compra";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";

export class AprobarCompraUseCase {
  constructor(
    private readonly compraRepository: CompraRepositoryPort,
    private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
    private readonly historialRepository: HistorialRepositoryPort,
    private readonly notificationService: NotificationPort,
    private readonly clienteRepository: ClienteRepositoryPort
  ) {}

  /**
   * Ejecuta la aprobación de una compra pendiente.
   *
   * Este método implementa el flujo completo de aprobación:
   * 1. Obtiene la compra por ID
   * 2. Valida estado pendiente
   * 3. Verifica solicitud formal asociada
   * 4. Confirma límite de crédito
   * 5. Actualiza estado a aprobada
   * 6. Registra evento en historial
   * 7. Notifica a comerciante y cliente
   *
   * @param id - ID de la compra a aprobar
   * @param usuarioId - ID del usuario que realiza la aprobación
   * @returns Promise<Compra> - Compra actualizada
   * @throws Error - Si no se cumplen las validaciones o ocurre un error
   */
  async execute(
    id: number, 
    usuarioId: number,
    numeroTarjeta: string,
    numeroCuenta: string
    ): Promise<Compra> {
    try {
      // 1. Obtener compra por ID
      const compra = await this.compraRepository.getCompraById(id);
      if (!compra) {
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
        // Registrar evento de error
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
      const solicitudFormalId = compra.getSolicitudFormalId();
      const solicitudFormal =
        await this.solicitudFormalRepository.getSolicitudFormalById(
          solicitudFormalId
        );
      const solicitudInicialId = solicitudFormal?.getSolicitudInicialId();
        // Registrar número de tarjeta y cuenta
      compra.setNumeroTarjeta(numeroTarjeta);
      compra.setNumeroCuenta(numeroCuenta);


      // 2. Validar estado actual
      if (compra.getEstado() !== EstadoCompra.PENDIENTE) {
        // Registrar evento de estado inválido
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "compras",
          entidadId: id,
          detalles: {
            error: `Estado inválido para aprobación: ${compra.getEstado()}`,
            estado_actual: compra.getEstado(),
          },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error(
          `La compra ${id} no está pendiente. Estado actual: ${compra.getEstado()}`
        );
      }

      // 3. Verificar solicitud formal asociada

      if (!solicitudFormal) {
        // Registrar evento de solicitud no encontrada
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

      if (solicitudFormal.getEstado() !== "aprobada") {
        // Registrar evento de estado inválido
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
      // 4. Validar monto ponderado vs límite de crédito
      const montoPonderado = compra.getMontoTotalPonderado();
      const limiteActual = solicitudFormal.getLimiteCompleto();
      const tieneAmpliacion = solicitudFormal.getSolicitaAmpliacionDeCredito();

      if (montoPonderado > limiteActual) {
        if (!tieneAmpliacion) {
          // Registrar evento de límite excedido sin ampliación
          await this.historialRepository.registrarEvento({
            usuarioId: usuarioId,
            accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
            entidadAfectada: "compras",
            entidadId: id,
            detalles: {
              error: "Límite de crédito excedido sin ampliación solicitada",
              monto_ponderado: montoPonderado,
              limite_credito: limiteActual,
              tiene_ampliacion: false
            },
            solicitudInicialId: solicitudInicialId,
          });
          throw new Error(`El monto ponderado (${montoPonderado}) excede el límite de crédito (${limiteActual}) y no se solicitó ampliación.`);
        }

        // Aprobar nuevo límite automáticamente con el monto ponderado
        solicitudFormal.setNuevoLimiteCompletoSolicitado(montoPonderado);


        // Registrar evento de ampliación aprobada automáticamente
        await this.historialRepository.registrarEvento({
          usuarioId: usuarioId,
          accion: HISTORIAL_ACTIONS.AMPLIACION_CREDITO_APROBADA,
          entidadAfectada: 'solicitudes_formales',
          entidadId: solicitudFormal.getId(),
          detalles: {
            monto_anterior: limiteActual,
            nuevo_limite: montoPonderado,
            compra_id: id
          },
          solicitudInicialId: solicitudInicialId
        });
      }

      // 5. Actualizar estado
      compra.setEstado(EstadoCompra.APROBADA);

      compra.setAnalistaAprobadorId(usuarioId);

      // 6. Guardar cambios
      await this.solicitudFormalRepository.updateSolicitudFormal(solicitudFormal);
      const compraActualizada = await this.compraRepository.updateCompra(
        compra, compra.getClienteId()
      );

      // 7. Registrar aprobación en historial
      await this.historialRepository.registrarEvento({
        usuarioId: usuarioId,
        accion: HISTORIAL_ACTIONS.APROBAR_COMPRA,
        entidadAfectada: "compras",
        entidadId: id,
        detalles: {
          monto_total: compra.getMontoTotal(),
          cantidad_cuotas: compra.getCantidadCuotas(),
          items_count: compra.getItems().length,
        },
        solicitudInicialId: solicitudInicialId,
      });

      // 8. Obtener cliente para notificación
      const cliente = await this.clienteRepository.findById(
        solicitudFormal.getClienteId()
      );

      // 9. Notificar al comerciante
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

      return compraActualizada;
    } catch (error) {
      // Registrar evento de error
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
        console.error(
          "Error obteniendo solicitudInicialId para historial de error",
          e
        );
      }

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

      // Notificar error
      await this.notificationService.emitNotification({
        userId: usuarioId,
        type: "error",
        message: `Error al aprobar compra ${id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });

      throw error;
    }
  }
}
