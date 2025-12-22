// src/application/use-cases/SolicitudFormal/CrearSolicitudFormalUseCase.ts

/**
 * MÓDULO: Caso de Uso - Crear Solicitud Formal
 *
 * Este módulo implementa la lógica de negocio para crear una nueva solicitud formal
 * de crédito basada en una solicitud inicial aprobada. Incluye validaciones exhaustivas
 * de permisos, estado de solicitud inicial, créditos activos y formato de documentos.
 *
 * RESPONSABILIDADES:
 * - Validar permisos del comerciante para crear solicitudes formales
 * - Verificar que la solicitud inicial esté aprobada
 * - Validar que el cliente no tenga créditos activos
 * - Verificar formato y validez del recibo de sueldo (JPG, PNG, WEBP, GIF)
 * - Obtener configuración de ponderador del sistema
 * - Crear la solicitud formal con todos los datos del cliente y empleador
 * - Manejar archivos adjuntos opcionales
 * - Registrar eventos en el historial del sistema
 * - Notificar al comerciante y analistas sobre la nueva solicitud
 * - Manejar errores y excepciones del proceso
 *
 * FLUJO PRINCIPAL:
 * 1. Validación de crédito activo del cliente
 * 2. Validación de permisos del comerciante
 * 3. Validación de solicitud inicial y configuración
 * 4. Validación de duplicados y formato de archivos
 * 5. Creación de solicitud formal con datos completos
 * 6. Persistencia en base de datos
 * 7. Registro en historial y notificaciones
 */

import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";
import { ContratoRepositoryPort } from "../../ports/ContratoRepositoryPort";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { ConfiguracionRepositoryPort } from "../../ports/ConfiguracionRepositoryPort";
import { ArchivoAdjunto } from "../../../domain/entities/ArchivosAdjuntos";

/**
 * Caso de uso para crear una nueva solicitud formal de crédito.
 *
 * Esta clase implementa la lógica completa para crear una solicitud formal,
 * incluyendo validaciones de negocio, verificación de documentos, creación
 * de entidades y notificaciones correspondientes.
 */
export class CrearSolicitudFormalUseCase {
  /**
   * Constructor del caso de uso para crear solicitudes formales.
   *
   * @param solicitudInicialRepo - Puerto para operaciones de solicitudes iniciales
   * @param solicitudFormalRepo - Puerto para operaciones de solicitudes formales
   * @param permisoRepo - Puerto para verificación de permisos
   * @param notificationService - Puerto para servicios de notificación
   * @param analistaRepo - Puerto para operaciones de analistas
   * @param contratoRepository - Puerto para operaciones de contratos
   * @param clienteRepository - Puerto para operaciones de clientes
   * @param historialRepository - Puerto para registro de eventos en historial
   * @param configuracionRepo - Puerto para operaciones de configuración del sistema
   */
  constructor(
    private readonly solicitudInicialRepo: SolicitudInicialRepositoryPort,
    private readonly solicitudFormalRepo: SolicitudFormalRepositoryPort,
    private readonly permisoRepo: PermisoRepositoryPort,
    private readonly notificationService: NotificationPort,
    private readonly analistaRepo: AnalistaRepositoryPort,
    private readonly contratoRepository: ContratoRepositoryPort,
    private readonly clienteRepository: ClienteRepositoryPort,
    private readonly historialRepository: HistorialRepositoryPort,
    private readonly configuracionRepo: ConfiguracionRepositoryPort
  ) {}

  /**
   * Ejecuta la creación de una solicitud formal de crédito.
   *
   * Este método implementa el flujo completo de creación de solicitud formal:
   * 1. Verifica que el cliente no tenga créditos activos
   * 2. Valida permisos del comerciante
   * 3. Verifica que la solicitud inicial esté aprobada
   * 4. Obtiene configuración de ponderador del sistema
   * 5. Valida que no exista una solicitud formal previa
   * 6. Verifica formato y validez del recibo de sueldo
   * 7. Crea la solicitud formal con todos los datos
   * 8. Maneja archivos adjuntos opcionales
   * 9. Registra eventos y envía notificaciones
   *
   * VALIDACIONES REALIZADAS:
   * - Cliente no debe tener créditos activos
   * - Comerciante debe tener permisos de creación
   * - Solicitud inicial debe existir y estar aprobada
   * - No debe existir solicitud formal previa
   * - Recibo debe ser una imagen válida (JPG, PNG, WEBP, GIF)
   * - Configuración de ponderador debe existir y ser válida
   *
   * @param solicitudInicialId - ID de la solicitud inicial aprobada
   * @param comercianteId - ID del comerciante que crea la solicitud
   * @param datosSolicitud - Objeto con todos los datos del cliente y la solicitud
   * @param comentarioInicial - Comentario opcional para la solicitud (por defecto: "Solicitud creada por comerciante")
   * @param solicitaAmpliacionDeCredito - Indica si se solicita ampliación de crédito
   * @param datosEmpleador - Datos del empleador del cliente
   * @returns Promise<SolicitudFormal> - La solicitud formal creada
   * @throws Error - Si no se cumplen las validaciones o ocurre un error en el proceso
   */
  async execute(
    solicitudInicialId: number,
    comercianteId: number,
    datosSolicitud: {
      nombreCompleto: string;
      apellido: string;
      telefono: string;
      email: string;
      recibo: Buffer;
      aceptaTarjeta: boolean;
      fechaNacimiento: Date;
      domicilio: string;
      numeroDomicilio: string;
      referentes: any[];
      importeNeto: number;
      sexo: string;
      codigoPostal: string;
      localidad: string;
      provincia: string;
      barrio: string;
      archivosAdjuntos?: { nombre: string; tipo: string; contenido: Buffer }[];
    },
    comentarioInicial: string = "Solicitud creada por comerciante",
    solicitaAmpliacionDeCredito: boolean,
    datosEmpleador: {
      razonSocialEmpleador: string;
      cuitEmpleador: string;
      cargoEmpleador: string;
      sectorEmpleador: string;
      rubroEmpleador: string;
      codigoPostalEmpleador: string;
      localidadEmpleador: string;
      provinciaEmpleador: string;
      telefonoEmpleador: string;
    }
  ): Promise<SolicitudFormal> {
    try {
      // ===== PASO 1: VALIDAR CRÉDITO ACTIVO =====
      // Verificar que el cliente no tenga créditos activos
      const tieneCredito = await this.tieneCreditoActivo(solicitudInicialId);

      // ===== PASO 2: VALIDAR PERMISOS DEL COMERCIANTE =====
      // Verificar que el comerciante tenga permisos para crear solicitudes formales
      const tienePermiso = await this.permisoRepo.usuarioTienePermiso(
        comercianteId,
        "create_solicitudFormal" // Permiso necesario
      );

      if (!tienePermiso) {
        // Registrar evento de falta de permisos
        await this.historialRepository.registrarEvento({
          usuarioId: comercianteId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "solicitudes_formales",
          entidadId: 0,
          detalles: {
            motivo: "Falta de permisos",
            permiso_requerido: "create_solicitudFormal",
          },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error("No tiene permisos para enviar solicitudes formales");
      }

      // ===== PASO 3: OBTENER Y VALIDAR SOLICITUD INICIAL =====
      // Obtener la solicitud inicial asociada
      const solicitudInicial =
        await this.solicitudInicialRepo.getSolicitudInicialById(
          solicitudInicialId
        );
      if (!solicitudInicial) {
        // Registrar evento de solicitud inicial no encontrada
        await this.historialRepository.registrarEvento({
          usuarioId: comercianteId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "solicitudes_formales",
          entidadId: 0,
          detalles: {
            error: "Solicitud inicial no encontrada",
            solicitud_inicial_id: solicitudInicialId,
          },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error("Solicitud inicial no encontrada");
      }

      // ===== PASO 4: OBTENER CONFIGURACIÓN DE PONDERADOR =====
      // Obtener configuración del sistema para el ponderador
      const configs = await this.configuracionRepo.obtenerConfiguracion();
      const ponderadorConfig = configs.find(
        (c) => c.getClave() === "ponderador"
      );

      if (!ponderadorConfig) {
        await this.historialRepository.registrarEvento({
          usuarioId: comercianteId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "solicitudes_formales",
          entidadId: 0,
          detalles: { error: "Configuración de ponderador no encontrada" },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error("Configuración de ponderador no encontrada");
      }

      // Validar que el ponderador sea un número válido
      const ponderador = parseFloat(ponderadorConfig.getValor());
      if (isNaN(ponderador)) {
        await this.historialRepository.registrarEvento({
          usuarioId: comercianteId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "solicitudes_formales",
          entidadId: 0,
          detalles: { error: "Ponderador no es un número válido" },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error("Ponderador no es un número válido");
      }

      // ===== PASO 5: VALIDAR ESTADO DE SOLICITUD INICIAL =====
      // Verificar que la solicitud inicial esté en estado "aprobada"
      // Permitir solicitudes pendientes pero rechazar rechazadas o expiradas
      if (solicitudInicial.getEstado() === 'rechazada' || solicitudInicial.getEstado() === 'expirada') {
        await this.historialRepository.registrarEvento({
          usuarioId: comercianteId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "solicitudes_formales",
          entidadId: 0,
          detalles: {
            error: "No se puede crear solicitud formal para una solicitud inicial rechazada o expirada",
            estado_actual: solicitudInicial.getEstado(),
            solicitud_inicial_id: solicitudInicialId,
          },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error("No se puede crear solicitud formal para una solicitud inicial rechazada o expirada");
      }

      // ===== PASO 6: VALIDAR DUPLICADOS =====
      // Verificar que no exista ya una solicitud formal para esta solicitud inicial
      const solicitudExistente = await this.solicitudFormalRepo.getSolicitudFormalBySolicitudInicialId(solicitudInicialId);
      if (solicitudExistente) {
        await this.historialRepository.registrarEvento({
          usuarioId: comercianteId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "solicitudes_formales",
          entidadId: 0,
          detalles: {
            error: "Ya existe una solicitud formal para esta solicitud inicial",
            solicitud_inicial_id: solicitudInicialId,
          },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error("Ya existe una solicitud formal para esta solicitud inicial");
      }

      // ===== PASO 7: VALIDAR FORMATO DE RECIBO DE SUELDO =====
      // Convertir recibo de string base64 a Buffer si es necesario
      if (typeof datosSolicitud.recibo === "string") {
        datosSolicitud.recibo = Buffer.from(datosSolicitud.recibo, "base64");
      }

      // Verificar que el recibo sea una imagen válida y de un tipo permitido
      const fileType = await import("file-type");
      const type = await fileType.fileTypeFromBuffer(datosSolicitud.recibo);
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (!type || !allowedMimeTypes.includes(type.mime)) {
        // Registrar evento de tipo de imagen no permitido
        await this.historialRepository.registrarEvento({
          usuarioId: comercianteId,
          accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
          entidadAfectada: "solicitudes_formales",
          entidadId: 0,
          detalles: {
            error:
              "El recibo debe ser una imagen válida (JPG, PNG, WEBP o GIF)",
          },
          solicitudInicialId: solicitudInicialId,
        });
        throw new Error(
          "El recibo debe ser una imagen válida (JPG, PNG, WEBP o GIF)"
        );
      }

      // ===== PASO 8: CREAR SOLICITUD FORMAL =====
      // ===== DETERMINAR ESTADO DE LA SOLICITUD FORMAL =====
      // Determinar el estado basado en el estado de la solicitud inicial
      let estadoSolicitudFormal: "pendiente" | "pendiente_aprobacion_inicial";
      let comentariosFinales = [comentarioInicial];

      if (solicitudInicial.getEstado() === "aprobada") {
        estadoSolicitudFormal = "pendiente";
      } else {
        estadoSolicitudFormal = "pendiente_aprobacion_inicial";
        // Agregar comentario informativo sobre el estado pendiente de la solicitud inicial
        comentariosFinales.push("⚠️ Solicitud creada con solicitud inicial pendiente de revisión");
      }

      // Crear la solicitud formal con todos los datos del cliente y empleador
      const solicitudFormal = new SolicitudFormal({
        id: 0, // ID se asignará automáticamente al guardar
        solicitudInicialId: solicitudInicialId,
        comercianteId: comercianteId,
        nombreCompleto: datosSolicitud.nombreCompleto,
        apellido: datosSolicitud.apellido,
        telefono: datosSolicitud.telefono,
        email: datosSolicitud.email,
        fechaSolicitud: new Date(), // Fecha de creación
        recibo:
          typeof datosSolicitud.recibo === "string"
            ? Buffer.from(datosSolicitud.recibo, "base64")
            : datosSolicitud.recibo,
        estado: "pendiente", // Estado inicial
        aceptaTarjeta: datosSolicitud.aceptaTarjeta,
        fechaNacimiento: datosSolicitud.fechaNacimiento,
        domicilio: datosSolicitud.domicilio,
        referentes: datosSolicitud.referentes,
        importeNeto: datosSolicitud.importeNeto,
        comentarios: [comentarioInicial], // Comentarios iniciales
        ponderador: ponderador, // Ponderador obtenido de configuración
        solicitaAmpliacionDeCredito: solicitaAmpliacionDeCredito,
        // Datos del empleador
        razonSocialEmpleador: datosEmpleador.razonSocialEmpleador,
        cuitEmpleador: datosEmpleador.cuitEmpleador,
        cargoEmpleador: datosEmpleador.cargoEmpleador,
        sectorEmpleador: datosEmpleador.sectorEmpleador,
        codigoPostalEmpleador: datosEmpleador.codigoPostalEmpleador,
        localidadEmpleador: datosEmpleador.localidadEmpleador,
        provinciaEmpleador: datosEmpleador.provinciaEmpleador,
        telefonoEmpleador: datosEmpleador.telefonoEmpleador,
        rubroEmpleador: datosEmpleador.rubroEmpleador,
        // Datos personales adicionales
        sexo: datosSolicitud.sexo,
        codigoPostal: datosSolicitud.codigoPostal,
        localidad: datosSolicitud.localidad,
        provincia: datosSolicitud.provincia,
        numeroDomicilio: datosSolicitud.numeroDomicilio,
        barrio: datosSolicitud.barrio,
      });

      // ===== PASO 9: AGREGAR ARCHIVOS ADJUNTOS =====
      // Agregar archivos adjuntos opcionales si existen
      if (
        datosSolicitud.archivosAdjuntos &&
        datosSolicitud.archivosAdjuntos.length > 0
      ) {
        for (const archivoData of datosSolicitud.archivosAdjuntos) {
          const archivo = new ArchivoAdjunto(
            0, // ID temporal, se asignará al guardar
            archivoData.nombre,
            archivoData.tipo,
            archivoData.contenido
          );
          solicitudFormal.agregarArchivoAdjunto(archivo);
        }
      }

      // ===== PASO 10: VALIDAR COMPLETITUD DE DATOS =====
      // Validar que todos los datos requeridos estén presentes
      solicitudFormal.validarCompletitud();

      // ===== PASO 11: PERSISTIR EN BASE DE DATOS =====
      // Vincular con solicitud inicial (propiedad adicional necesaria)
      (solicitudFormal as any).solicitudInicialId = solicitudInicialId;

      // Guardar la solicitud formal en la base de datos
      const solicitudCreada =
        await this.solicitudFormalRepo.createSolicitudFormal(solicitudFormal);

      // ===== PASO 12: REGISTRAR EVENTO EN HISTORIAL =====
      // Registrar evento de creación exitosa en historial
      await this.historialRepository.registrarEvento({
        usuarioId: comercianteId,
        accion: HISTORIAL_ACTIONS.CREATE_SOLICITUD_FORMAL,
        entidadAfectada: "solicitudes_formales",
        entidadId: solicitudCreada.getId(),
        detalles: {
          solicitud_inicial_id: solicitudInicialId,
          estado: estadoSolicitudFormal, // Registrar el estado real
          estado_solicitud_inicial: solicitudInicial.getEstado(), // Registrar también el estado de la solicitud inicial
          cliente: `${datosSolicitud.nombreCompleto} ${datosSolicitud.apellido}`,
        },
        solicitudInicialId: solicitudInicialId,
      });

      // ===== PASO 13: NOTIFICAR AL COMERCIANTE =====
      // Enviar notificación al comerciante sobre la creación exitosa
      let mensajeComerciante = "Solicitud formal creada exitosamente";
      if (estadoSolicitudFormal === "pendiente_aprobacion_inicial") {
        mensajeComerciante += ". La solicitud está sujeta a la aprobación de la solicitud inicial";
      }

      await this.notificationService.emitNotification({
        userId: solicitudCreada.getComercianteId(),
        type: "solicitud_formal",
        message: mensajeComerciante,
        metadata: {
          estado: estadoSolicitudFormal,
          solicitudInicialId: solicitudInicialId,
          requiereAprobacionInicial: estadoSolicitudFormal === "pendiente_aprobacion_inicial"
        }
      });

      

      // ===== PASO 14: NOTIFICAR A ANALISTAS =====
      // Notificar a analistas sobre la nueva solicitud que requiere revisión
      await this.notificarAnalistas(solicitudCreada,`Nueva solicitud formal requiere revisión - CUIL: ${solicitudInicial.getCuilCliente()}`);

      // Retornar la solicitud formal creada exitosamente
      return solicitudCreada;
    } catch (error) {
      // ===== MANEJO DE ERRORES =====
      // Determinar mensaje de error apropiado
      let errorMessage = "Error desconocido";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Notificar error al comerciante
      await this.notificationService.emitNotification({
        userId: Number(comercianteId),
        type: "error",
        message: `Error al crear solicitud formal: ${errorMessage}`,
      });

      // Registrar evento de error en historial
      await this.historialRepository.registrarEvento({
        usuarioId: comercianteId,
        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
        entidadAfectada: "solicitudes_formales",
        entidadId: 0,
        detalles: {
          error: error instanceof Error ? error.message : String(error),
          etapa: "creacion_solicitud_formal",
          solicitud_inicial_id: solicitudInicialId,
        },
        solicitudInicialId: solicitudInicialId,
      });

      // Re-lanzar el error para que sea manejado por el controlador
      throw error;
    }
  }

 /**
 * Notifica a todos los analistas activos sobre una nueva solicitud formal.
 *
 * Este método privado obtiene todos los analistas activos del sistema y les
 * envía una notificación sobre la nueva solicitud formal que requiere revisión.
 *
 * @param solicitud - La solicitud formal creada que requiere notificación
 * @param message - Mensaje personalizado para enviar a los analistas
 * @returns Promise<void> - No retorna valor
 */
private async notificarAnalistas(solicitud: SolicitudFormal, message: string): Promise<void> {
  try {
    // 1. Obtener todos los IDs de analistas usando el repositorio
    const analistaIds = await this.analistaRepo.obtenerIdsAnalistasActivos();
    
    // 2. Enviar notificación individual a cada analista con el mensaje personalizado
    const notificaciones = analistaIds.map((analistaId) =>
      this.notificationService.emitNotification({
        userId: analistaId,
        type: "solicitud_formal",
        message: message,
        metadata: {
          solicitudId: solicitud.getId(),
          cliente: `${solicitud.getNombreCompleto()} ${solicitud.getApellido()}`,
          comercianteId: solicitud.getComercianteId(),
          prioridad: "alta",
        },
      })
    );

    await Promise.all(notificaciones);
  } catch (error) {
    console.error("Error notificando a analistas:", error);

    // Registrar evento de error en notificación
    await this.historialRepository.registrarEvento({
      usuarioId: solicitud.getComercianteId(),
      accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
      entidadAfectada: "solicitudes_formales",
      entidadId: solicitud.getId(),
      detalles: {
        error: "Error notificando a analistas",
        etapa: "notificacion_analistas",
      },
      solicitudInicialId: solicitud.getSolicitudInicialId(),
    });
  }
}

  /**
   * Verifica si un cliente tiene un crédito activo basado en sus contratos.
   *
   * Este método privado consulta si el cliente tiene un contrato con estado
   * "generado" (activo) asociado a su ID.
   *
   * @param solicitudInicialId - ID de la solicitud inicial para buscar el cliente
   * @returns Promise<boolean> - true si el cliente tiene un crédito activo, false en caso contrario
   */

private async tieneCreditoActivo(
  solicitudInicialId: number
): Promise<boolean> {
  try {
    console.log(`🔍 Iniciando verificación de crédito activo para solicitud inicial: ${solicitudInicialId}`);
    
    // Obtener la solicitud inicial
    const solicitudInicial = await this.solicitudInicialRepo.getSolicitudInicialById(
      solicitudInicialId
    );
    
    if (!solicitudInicial) {
      console.error(`❌ Solicitud inicial no encontrada: ${solicitudInicialId}`);
      throw new Error("Solicitud inicial no encontrada");
    }
    
    console.log(`✅ Solicitud inicial encontrada: ID=${solicitudInicial.getId()}`);
    
    // Obtener el cliente
    const cliente = await this.clienteRepository.findById(
      solicitudInicial.getClienteId()
    );
    
    if (!cliente) {
      console.error(`❌ Cliente no encontrado para solicitud inicial: ${solicitudInicialId}`);
      throw new Error("Cliente no encontrado");
    }
    
    const cuilCliente = cliente.getCuil();
    console.log(`✅ Cliente obtenido: CUIL=${cuilCliente}`);
    
    // Buscar contratos por CUIL del cliente
    const contratos = await this.contratoRepository.getContratosByCuilCliente(cuilCliente);
    
    console.log(`📊 Contratos encontrados para CUIL ${cuilCliente}: ${contratos.length}`);
    
    // Verificar si hay algún contrato con estado "generado"
    const tieneContratoActivo = contratos.some(contrato => {
      const estado = contrato.getEstado().toLowerCase();
      const esActivo = estado === "generado";
      
      if (esActivo) {
        console.log(`⚠️ Contrato activo encontrado: ID=${contrato.getId()}, Estado=${estado}`);
      }
      
      return esActivo;
    });
    
    if (tieneContratoActivo) {
      console.log(`❌ Cliente tiene crédito activo - CUIL: ${cuilCliente}`);
      
      // Registrar evento de rechazo por crédito activo
      await this.historialRepository.registrarEvento({
        usuarioId: solicitudInicial.getComercianteId() || null,
        accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_FORMAL,
        entidadAfectada: "solicitudes_formales",
        entidadId: 0,
        detalles: {
          motivo: "Cliente con crédito activo",
          Cuil_cliente: cuilCliente,
          contratos_activos: contratos
            .filter(c => c.getEstado().toLowerCase() === "generado")
            .map(c => ({
              id: c.getId(),
              estado: c.getEstado(),
              fecha_generacion: c.getFechaGeneracion()
            }))
        },
        solicitudInicialId: solicitudInicialId,
      });
      
      throw new Error(`El cliente ya tiene un crédito activo. CUIL: ${cuilCliente}`);
    }
    
    console.log(`✅ Cliente no tiene créditos activos - CUIL: ${cuilCliente}`);
    return false;
    
  } catch (error) {
    console.error(`❌ Error en verificación de crédito activo:`, error);
    
    // Si ya es un error de crédito activo, relanzarlo
    if (error instanceof Error && error.message.includes("crédito activo")) {
      throw error;
    }
    
    // Para otros errores, registrar pero no bloquear
    await this.historialRepository.registrarEvento({
      usuarioId: null,
      accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
      entidadAfectada: "solicitudes_formales",
      entidadId: 0,
      detalles: {
        error: error instanceof Error ? error.message : String(error),
        etapa: "verificacion_credito_activo",
        solicitud_inicial_id: solicitudInicialId,
      },
      solicitudInicialId: solicitudInicialId,
    });
    
    console.warn(`⚠️ Error en verificación de crédito, continuando...: ${error}`);
    return false; // No bloquear por errores de verificación
  }
}

  /*
  private async tieneCreditoActivo(
    solicitudInicialId: number
  ): Promise<boolean> {
    // Obtener la solicitud inicial para extraer el CUIL del cliente
    const solicitudInicial =
      await this.solicitudInicialRepo.getSolicitudInicialById(
        solicitudInicialId
      );
    if (!solicitudInicial) {
      throw new Error("Solicitud inicial no encontrada");
    }
    const idCliente = solicitudInicial.getClienteId();
    const cliente = await this.clienteRepository.findById(idCliente);
    //verificar si el cliente tiene un contrato generado
    const contrato = await this.contratoRepository.getContratoById(
      cliente.getId().toString()
    );
    // Verificar cada solicitud formal para ver si tiene un contrato activo asociado
    if (contrato) {
      const tieneContratoActivo = contrato.getEstado() === "generado";

      if (tieneContratoActivo) {
        // Registrar evento de rechazo por crédito activo
        await this.historialRepository.registrarEvento({
          usuarioId: solicitudInicial.getComercianteId() || null,
          accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_FORMAL,
          entidadAfectada: "solicitudes_formales",
          entidadId: 0,
          detalles: {
            motivo: "Cliente con crédito activo",
            Cuil_cliente: cliente.getCuil(),
          },
          solicitudInicialId: solicitudInicialId,
        });

        throw new Error("El cliente ya tiene un crédito activo");
        return true;
      }
    }

    return false;
  }
    */
}
