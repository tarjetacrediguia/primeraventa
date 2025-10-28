// src/application/use-cases/SolicitudInicial/CrearSolicitudInicialUseCase.ts

/**
 * MÓDULO: Caso de Uso - Crear Solicitud Inicial
 *
 * Este módulo implementa la lógica de negocio para crear una nueva solicitud inicial de crédito.
 * Maneja la validación de clientes, verificación de créditos activos, integración con Nosis,
 * creación de solicitudes y notificaciones correspondientes.
 *
 * RESPONSABILIDADES:
 * - Validar que el cliente no tenga créditos activos
 * - Crear o recuperar información del cliente
 * - Integrar con servicio Nosis para validación automática
 * - Actualizar datos del cliente con información de Nosis
 * - Crear la solicitud inicial con estado apropiado
 * - Manejar aprobación/rechazo automático basado en Nosis
 * - Registrar eventos en el historial del sistema
 * - Enviar notificaciones al comerciante y analistas
 * - Manejar errores y excepciones
 *
 * FLUJO PRINCIPAL:
 * 1. Crear o recuperar cliente por CUIL
 * 2. Validar que no tenga créditos activos
 * 3. Crear solicitud inicial pendiente
 * 4. Integrar con Nosis para validación
 * 5. Actualizar datos del cliente con info de Nosis
 * 6. Aplicar reglas de aprobación automática (si está habilitado)
 * 7. Registrar eventos y enviar notificaciones
 */

import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { ContratoRepositoryPort } from "../../ports/ContratoRepositoryPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { Cliente } from "../../../domain/entities/Cliente";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";
import { NosisPort } from "../../ports/NosisPort";
import { GetDataNosisUseCase } from "../Nosis/GetDataNosisUseCase";
import {
  PersonalData,
  VerificationResult,
  VerifyDataNosisUseCase,
} from "../Nosis/VerifyDataNosisUseCase";
import { EntidadesService } from "../../../infrastructure/entidadesBancarias/EntidadesService";
import { RubrosLaboralesService } from "../../../infrastructure/RubrosLaborales/RubrosLaboralesService";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";
import {
  crearComentarioAnalista,
  crearComentarioComerciante,
} from "../../../infrastructure/utils/comentariosHelper";
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";

export type CrearSolicitudInicialResponse = {
  solicitud: SolicitudInicial;
  nosisData?: PersonalData;
  motivoRechazo?: string;
  reglasFallidas?: string[];
  entidadesSituacion2?: number[];
  entidadesDeuda?: number[];
  referenciasComerciales?: {
    referenciasValidas: string[];
    referenciasInvalidas: string[];
    totalValidas: number;
    totalInvalidas: number;
  };
};
/**
 * Caso de uso para crear una nueva solicitud inicial de crédito.
 *
 * Esta clase implementa la lógica completa para crear una solicitud inicial,
 * incluyendo validaciones de negocio, creación de entidades y manejo de eventos.
 */
export class CrearSolicitudInicialUseCase {
  /**
   * Constructor del caso de uso para crear solicitudes iniciales.
   *
   * @param solicitudInicialRepository - Puerto para operaciones de solicitudes iniciales
   * @param contratoRepository - Puerto para operaciones de contratos
   * @param solicitudFormalRepository - Puerto para operaciones de solicitudes formales
   * @param notificationService - Puerto para servicios de notificación
   * @param clienteRepository - Puerto para operaciones de clientes
   * @param historialRepository - Puerto para registro de eventos en historial
   * @param analistaRepository - Puerto para operaciones de analistas
   * @param nosisPort - Puerto para servicios de Nosis
   * @param nosisAutomatico - Booleano para activar modo automático de Nosis
   */
  constructor(
    private readonly solicitudInicialRepository: SolicitudInicialRepositoryPort,
    private readonly contratoRepository: ContratoRepositoryPort,
    private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
    private readonly notificationService: NotificationPort,
    private readonly clienteRepository: ClienteRepositoryPort,
    private readonly historialRepository: HistorialRepositoryPort,
    private readonly analistaRepository: AnalistaRepositoryPort,
    private readonly nosisPort: NosisPort,
    private readonly nosisAutomatico: boolean,
    private readonly entidadesService: EntidadesService,
    private readonly rubrosLaboralesService: RubrosLaboralesService,
    private readonly comercianteRepository: ComercianteRepositoryPort,
    private readonly compraRepository: CompraRepositoryPort
  ) {}

  /**
   * Ejecuta la creación de una solicitud inicial de crédito.
   *
   * Este método implementa el flujo completo de creación de solicitud inicial:
   * 1. Busca o crea el cliente según el CUIL proporcionado
   * 2. Verifica que el cliente no tenga créditos activos
   * 3. Crea la solicitud inicial con estado pendiente
   * 4. Integra con Nosis para validación automática
   * 5. Actualiza datos del cliente con información de Nosis
   * 6. Aplica reglas de aprobación automática (si está habilitado)
   * 7. Registra eventos en el historial
   * 8. Envía notificaciones al comerciante y analistas
   *
   * INTEGRACIÓN CON NOSIS:
   * - Obtiene datos personales y laborales del cliente
   * - Actualiza información del cliente con datos de Nosis
   * - Aplica reglas de aprobación automática si nosisAutomatico está habilitado
   * - Maneja estados: aprobado, pendiente, rechazado
   *
   * VALIDACIONES REALIZADAS:
   * - Cliente no debe tener créditos activos
   * - CUIL debe ser válido
   * - Datos de Nosis deben ser procesables
   *
   * @param dniCliente - DNI del cliente para la solicitud
   * @param cuilCliente - CUIL del cliente para la solicitud
   * @param comercianteId - ID del comerciante que crea la solicitud
   * @returns Promise<CrearSolicitudInicialResponse> - Respuesta con solicitud y datos de Nosis
   * @throws Error - Si el cliente ya tiene un crédito activo o si ocurre un error en el proceso
   */
  async execute(
    dniCliente: string,
    cuilCliente: string,
    comercianteId: number
  ): Promise<CrearSolicitudInicialResponse> {
    try {
      // ===== PASO 1: VERIFICAR SOLICITUDES EXISTENTES PRIMERO =====
      console.log(
        `Verificando solicitudes existentes para CUIL: ${cuilCliente}, comerciante: ${comercianteId}`
      );

      const solicitudesExistentes = await this.verificarSolicitudesExistentes(
        cuilCliente,
        comercianteId
      );

      // 🚨 PRIMERO: Verificar si hay solicitudes de OTRO comercio
if (solicitudesExistentes.tieneSolicitudOtroComercio) {
  console.log(
    `❌ Cliente ya tiene solicitud de otro comercio: ${solicitudesExistentes.nombreComercioOriginal}`
  );

  await this.notificationService.emitNotification({
    userId: Number(comercianteId),
    type: "solicitud_inicial",
    message: `El cliente con CUIL ${cuilCliente} ya tiene una solicitud inicial creada por otro comercio`,
  });

  await this.historialRepository.registrarEvento({
    usuarioId: comercianteId,
    accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
    entidadAfectada: "solicitudes_iniciales",
    entidadId: 0,
    detalles: {
      motivo: "Cliente ya tiene solicitud de otro comercio",
      cuil_cliente: cuilCliente,
      comerciante_original: solicitudesExistentes.comercianteOriginal,
      nombre_comercio_original: solicitudesExistentes.nombreComercioOriginal,
    },
    solicitudInicialId: undefined,
  });

  throw new Error(
    `El cliente ya tiene una solicitud inicial en el sistema. Comercio original: ${solicitudesExistentes.nombreComercioOriginal}`
  );
}

// 🚨 SEGUNDO: Verificar si hay solicitudes del MISMO comerciante
if (solicitudesExistentes.tieneSolicitudMismoComercio) {
  console.log(`❌ El comerciante ya tiene una solicitud para este cliente`);

  await this.notificationService.emitNotification({
    userId: Number(comercianteId),
    type: "solicitud_inicial",
    message: `Ya existe una solicitud inicial para el cliente con CUIL ${cuilCliente} en su comercio`,
  });

  await this.historialRepository.registrarEvento({
    usuarioId: comercianteId,
    accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
    entidadAfectada: "solicitudes_iniciales",
    entidadId: 0,
    detalles: {
      motivo: "Comerciante ya tiene solicitud para este cliente",
      cuil_cliente: cuilCliente,
      comerciante_id: comercianteId,
    },
    solicitudInicialId: undefined,
  });

  throw new Error(
    `Ya existe una solicitud inicial para este cliente en su comercio. No puede crear múltiples solicitudes.`
  );
}

console.log(`✅ No hay solicitudes bloqueantes, continuando...`);

      // ===== PASO 2: CREAR O RECUPERAR CLIENTE =====
      let cliente: Cliente;
      let clienteTemporal: Cliente;

      try {
        // Intentar buscar cliente existente por CUIL
        cliente = await this.clienteRepository.findByCuil(cuilCliente);
        clienteTemporal = cliente;
        console.log(`✅ Cliente encontrado con CUIL: ${cuilCliente}`);
      } catch (error) {
        // No se encontró el cliente, crear uno nuevo
        console.log(`📝 Creando nuevo cliente con CUIL: ${cuilCliente}`);
        cliente = new Cliente({
          id: 0,
          nombreCompleto: "Nombre temporal",
          apellido: "Apellido temporal",
          dni: dniCliente,
          cuil: cuilCliente,
        });
        clienteTemporal = await this.clienteRepository.save(cliente);
      }

      // ===== PASO 3: VALIDAR CRÉDITO ACTIVO =====
      console.log(`🔍 Validando créditos activos para CUIL: ${cuilCliente}`);
      const tieneCreditoActivo = await this.tieneCreditoActivo(cuilCliente);
      if (tieneCreditoActivo) {
        console.log(`❌ Cliente tiene crédito activo`);
        await this.notificationService.emitNotification({
          userId: Number(comercianteId),
          type: "solicitud_inicial",
          message: `El cliente con CUIL ${cuilCliente} ya tiene un crédito activo`,
        });

        await this.historialRepository.registrarEvento({
          usuarioId: comercianteId,
          accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
          entidadAfectada: "solicitudes_iniciales",
          entidadId: 0,
          detalles: {
            motivo: "Cliente con crédito activo",
            cuil_cliente: cuilCliente,
          },
          solicitudInicialId: undefined,
        });

        throw new Error("El cliente ya tiene un crédito activo");
      }

      console.log(`✅ No hay créditos activos, creando solicitud...`);

      // ===== PASO 3: CREAR SOLICITUD INICIAL =====
      // Crear solicitud inicial vinculada al cliente
      const solicitud = new SolicitudInicial({
        id: 0,
        fechaCreacion: new Date(),
        estado: "pendiente",
        clienteId: clienteTemporal.getId(),
        comercianteId: comercianteId,
      });

      // ===== PASO 4: PERSISTIR SOLICITUD =====
      // Guardar solicitud inicial en la base de datos
      const solicitudCreada =
        await this.solicitudInicialRepository.createSolicitudInicial(
          solicitud,
          clienteTemporal
        );

      const solicitudInicialId = solicitudCreada.getId();

      // ===== PASO 5: REGISTRAR EVENTO EN HISTORIAL =====
      // Registrar evento de creación exitosa en historial
      await this.historialRepository.registrarEvento({
        usuarioId: comercianteId,
        accion: HISTORIAL_ACTIONS.CREATE_SOLICITUD_INICIAL,
        entidadAfectada: "solicitudes_iniciales",
        entidadId: solicitudCreada.getId(),
        detalles: {
          dni_cliente: dniCliente,
          comerciante_id: comercianteId,
          estado: "pendiente",
        },
        solicitudInicialId: solicitudInicialId,
      });

      // ===== PASO 6: INTEGRACIÓN CON NOSIS =====
      // Variables para almacenar datos de Nosis y resultados
      let nosisData: PersonalData | undefined;
      let motivoRechazo: string | undefined;
      let reglasFallidas: string[] | undefined;
      let entidadesSituacion2: number[] | undefined;
      let entidadesDeuda: number[] | undefined;
      let referenciasComerciales: any | undefined;

      try {
        // Obtener datos del cliente desde Nosis
        const getNosisData = new GetDataNosisUseCase(this.nosisPort);
        const nosisResponse = await getNosisData.execute(cuilCliente);

        // Verificar y validar datos de Nosis
        const verifyNosis = new VerifyDataNosisUseCase(
          undefined,
          this.entidadesService,
          this.rubrosLaboralesService
        );
        const resultadoNosis = await verifyNosis.execute(nosisResponse);
        nosisData = resultadoNosis.personalData;

        nosisData = resultadoNosis.personalData;
        motivoRechazo = resultadoNosis.motivo;
        reglasFallidas = resultadoNosis.reglasFallidas;
        entidadesSituacion2 = resultadoNosis.entidadesSituacion2;
        entidadesDeuda = resultadoNosis.entidadesDeuda;
        referenciasComerciales = resultadoNosis.referenciasComerciales;

        // Generar comentarios según el rol (se asume que es comerciante en este contexto)
        const comentarioComerciante = this.generarComentariosComerciante(
          resultadoNosis,
          this.entidadesService
        );

        // Para el analista, se guarda el comentario detallado en la base de datos
        const comentarioAnalista = this.generarComentariosAnalista(
          resultadoNosis,
          this.entidadesService
        );

        // ===== PASO 7: ACTUALIZAR DATOS DEL CLIENTE CON NOSIS =====
        // Actualizar información personal del cliente con datos de Nosis
        clienteTemporal.setNombreCompleto(
          nosisData && nosisData.nombreCompleto?.nombre
            ? nosisData.nombreCompleto.nombre
            : ""
        );
        clienteTemporal.setApellido(
          nosisData && nosisData.nombreCompleto?.apellido
            ? nosisData.nombreCompleto.apellido
            : ""
        );
        clienteTemporal.setDni(
          nosisData && nosisData.documentacion?.dni
            ? nosisData.documentacion.dni
            : dniCliente
        );
        clienteTemporal.setCuil(
          nosisData && nosisData.documentacion?.cuil
            ? nosisData.documentacion.cuil
            : cuilCliente
        );
        clienteTemporal.setFechaNacimiento(
          nosisData && nosisData.documentacion?.fechaNacimiento
            ? new Date(nosisData.documentacion.fechaNacimiento)
            : null
        );

        clienteTemporal.setSexo(
          nosisData &&
            nosisData.documentacion &&
            typeof nosisData.documentacion.sexo !== "undefined"
            ? nosisData.documentacion.sexo
            : null
        );
        clienteTemporal.setCodigoPostal(
          nosisData && nosisData.domicilio && nosisData.domicilio.codigoPostal
            ? nosisData.domicilio.codigoPostal
            : null
        );
        clienteTemporal.setLocalidad(
          nosisData && nosisData.domicilio && nosisData.domicilio.localidad
            ? nosisData.domicilio.localidad
            : null
        );
        clienteTemporal.setProvincia(
          nosisData && nosisData.domicilio && nosisData.domicilio.provincia
            ? nosisData.domicilio.provincia
            : null
        );
        clienteTemporal.setNumeroDomicilio(
          nosisData && nosisData.domicilio && nosisData.domicilio.numero
            ? nosisData.domicilio.numero
            : null
        );
        clienteTemporal.setNacionalidad(
          nosisData && nosisData.documentacion?.nacionalidad
            ? nosisData.documentacion.nacionalidad
            : null
        );
        clienteTemporal.setEstadoCivil(
          nosisData && nosisData.documentacion?.estadoCivil
            ? nosisData.documentacion.estadoCivil
            : null
        );

        // Actualizar datos laborales del cliente con información de Nosis
        if (
          nosisData &&
          nosisData.datosLaborales &&
          nosisData.datosLaborales.empleador
        ) {
          clienteTemporal.setEmpleadorRazonSocial(
            nosisData.datosLaborales.empleador.razonSocial || null
          );
          clienteTemporal.setEmpleadorCuit(
            nosisData.datosLaborales.empleador.cuit || null
          );
          clienteTemporal.setEmpleadorDomicilio(
            nosisData.datosLaborales.empleador.domicilio
              ? `${nosisData.datosLaborales.empleador.domicilio.calle || ""} ${
                  nosisData.datosLaborales.empleador.domicilio.numero || ""
                }`
              : null
          );
          clienteTemporal.setEmpleadorTelefono(
            nosisData.datosLaborales.empleador.telefono || null
          );
          clienteTemporal.setEmpleadorCodigoPostal(
            nosisData.datosLaborales.empleador.domicilio &&
              nosisData.datosLaborales.empleador.domicilio.codigoPostal
              ? nosisData.datosLaborales.empleador.domicilio.codigoPostal
              : null
          );

          clienteTemporal.setEmpleadorLocalidad(
            nosisData.datosLaborales.empleador.domicilio &&
              nosisData.datosLaborales.empleador.domicilio.localidad
              ? nosisData.datosLaborales.empleador.domicilio.localidad
              : null
          );
          clienteTemporal.setEmpleadorProvincia(
            nosisData.datosLaborales.empleador.domicilio &&
              nosisData.datosLaborales.empleador.domicilio.provincia
              ? nosisData.datosLaborales.empleador.domicilio.provincia
              : null
          );
          if (nosisData.datosLaborales.empleador.rubro) {
    const descripcionCorta = this.rubrosLaboralesService.obtenerDescripcionCorta(
      nosisData.datosLaborales.empleador.rubro
    );
    // Guardar la descripción corta, o si no existe, guardar el código original
    clienteTemporal.setRubroEmpleador(descripcionCorta || nosisData.datosLaborales.empleador.rubro);
  } else {
    clienteTemporal.setRubroEmpleador(null);
  }
        }

        // Persistir actualizaciones del cliente en la base de datos
        await this.clienteRepository.update(clienteTemporal);
        // ===== PASO 8: APLICAR REGLAS DE APROBACIÓN AUTOMÁTICA =====
        // Aplicar reglas de aprobación automática si está habilitado
        if (this.nosisAutomatico) {
          if (resultadoNosis.status === "aprobado") {
            // Aprobar automáticamente la solicitud
            solicitudCreada.setEstado("aprobada");
            await this.solicitudInicialRepository.updateSolicitudInicial(
              solicitudCreada,
              clienteTemporal
            );
            // Agregar comentarios diferenciados
            solicitudCreada.agregarComentario(
              crearComentarioComerciante("Solicitud aprobada automáticamente")
            );
            solicitudCreada.agregarComentario(
              crearComentarioAnalista(comentarioAnalista)
            );
            await this.historialRepository.registrarEvento({
              usuarioId: null,
              accion: HISTORIAL_ACTIONS.APPROVE_SOLICITUD_INICIAL,
              entidadAfectada: "solicitudes_iniciales",
              entidadId: solicitudCreada.getId(),
              detalles: {
                sistema: "Nosis",
                score: resultadoNosis.score,
                motivo: resultadoNosis.motivo,
                reglasFallidas: resultadoNosis.reglasFallidas,
                pendientes: resultadoNosis.pendientes,
                aprobados: resultadoNosis.aprobados,
                entidadesSituacion2: resultadoNosis.entidadesSituacion2,
                entidadesDeuda: resultadoNosis.entidadesDeuda,
                referenciasComerciales: resultadoNosis.referenciasComerciales,
                comentarioComerciante: comentarioComerciante,
                comentarioAnalista: comentarioAnalista,
              },
              solicitudInicialId,
            });
          } else if (resultadoNosis.status === "pendiente") {
            // Mantener estado pendiente para revisión manual
            motivoRechazo = resultadoNosis.motivo;
            reglasFallidas = resultadoNosis.reglasFallidas;
            solicitudCreada.setEstado("pendiente");
            solicitud.setMotivoRechazo(motivoRechazo ?? "");

            // Agregar comentarios diferenciados
            solicitudCreada.agregarComentario(
              crearComentarioComerciante(comentarioComerciante)
            );
            solicitudCreada.agregarComentario(
              crearComentarioAnalista(comentarioAnalista)
            );

            await this.solicitudInicialRepository.updateSolicitudInicial(
              solicitudCreada,
              clienteTemporal
            );

            //solicitud.agregarComentario(`Pendiente: ${resultadoNosis.motivo}`);

            await this.historialRepository.registrarEvento({
              usuarioId: null,
              accion: HISTORIAL_ACTIONS.PENDING_SOLICITUD_INICIAL,
              entidadAfectada: "solicitudes_iniciales",
              entidadId: solicitudCreada.getId(),
              detalles: {
                sistema: "Nosis",
                score: resultadoNosis.score,
                motivo: resultadoNosis.motivo,
                reglasFallidas: resultadoNosis.reglasFallidas,
                pendientes: resultadoNosis.pendientes,
                aprobados: resultadoNosis.aprobados,
                entidadesSituacion2: resultadoNosis.entidadesSituacion2,
                entidadesDeuda: resultadoNosis.entidadesDeuda,
                referenciasComerciales: resultadoNosis.referenciasComerciales,
                comentarioComerciante: comentarioComerciante,
                comentarioAnalista: comentarioAnalista,
              },
              solicitudInicialId,
            });
          } else if (resultadoNosis.status === "rechazado") {
            // Rechazar automáticamente la solicitud
            motivoRechazo = resultadoNosis.motivo;
            reglasFallidas = resultadoNosis.reglasFallidas;
            solicitudCreada.setEstado("rechazada");
            solicitud.setMotivoRechazo(motivoRechazo ?? "");

            // Agregar comentarios diferenciados
            solicitudCreada.agregarComentario(
              crearComentarioComerciante(comentarioComerciante)
            );
            solicitudCreada.agregarComentario(
              crearComentarioAnalista(comentarioAnalista)
            );

            // Guardar el motivo de rechazo en la solicitud
            await this.solicitudInicialRepository.updateSolicitudInicial(
              solicitudCreada,
              clienteTemporal
            );

            await this.historialRepository.registrarEvento({
              usuarioId: null,
              accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
              entidadAfectada: "solicitudes_iniciales",
              entidadId: solicitudCreada.getId(),
              detalles: {
                sistema: "Nosis",
                score: resultadoNosis.score,
                motivo: resultadoNosis.motivo,
                reglasFallidas: resultadoNosis.reglasFallidas,
                pendientes: resultadoNosis.pendientes,
                aprobados: resultadoNosis.aprobados,
                entidadesSituacion2: resultadoNosis.entidadesSituacion2,
                entidadesDeuda: resultadoNosis.entidadesDeuda,
                referenciasComerciales: resultadoNosis.referenciasComerciales,
                comentarioComerciante: comentarioComerciante,
                comentarioAnalista: comentarioAnalista,
              },
              solicitudInicialId,
            });
          } else {
            // Estado desconocido, mantener pendiente para revisión
            solicitudCreada.setEstado("pendiente");
            await this.solicitudInicialRepository.updateSolicitudInicial(
              solicitudCreada,
              clienteTemporal
            );
            await this.notificarAnalistas(solicitudCreada, clienteTemporal);
          }
        } else {
          // ===== MODO MANUAL =====
          // Modo manual: notificar a analistas para revisión
          await this.notificarAnalistas(solicitudCreada, clienteTemporal);
        }
      } catch (error) {
        // ===== MANEJO DE ERRORES DE NOSIS =====
        // Registrar error de integración con Nosis pero continuar el proceso
        console.error("Error obteniendo datos de Nosis:", error);
      }

      // ===== PASO 9: NOTIFICAR AL COMERCIANTE =====
      // Enviar notificación al comerciante sobre la creación exitosa
      await this.notificationService.emitNotification({
        userId: Number(comercianteId),
        type: "solicitud_inicial",
        message: "Solicitud inicial creada exitosamente",
      });

      // ===== PASO 10: RETORNAR RESPUESTA =====
      // Retornar respuesta con solicitud y datos de Nosis
      return {
        solicitud: solicitudCreada,
        nosisData,
        motivoRechazo,
        reglasFallidas,
        entidadesSituacion2,
        entidadesDeuda,
        referenciasComerciales,
      };
    } catch (error) {
      // ===== MANEJO DE ERRORES GENERALES =====
      // Determinar mensaje de error apropiado
      let errorMessage = "Error desconocido";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Notificar error al comerciante
      await this.notificationService.emitNotification({
        userId: Number(comercianteId),
        type: "error",
        message: `Error al crear solicitud: ${errorMessage}`,
      });

      // Registrar evento de error en historial
      await this.historialRepository.registrarEvento({
        usuarioId: comercianteId,
        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
        entidadAfectada: "solicitudes_iniciales",
        entidadId: 0, // No hay entidad aún
        detalles: {
          error: error instanceof Error ? error.message : String(error),
          etapa: "creacion_solicitud_inicial",
          dni_cliente: dniCliente,
        },
        solicitudInicialId: undefined, // No hay solicitud por error
      });

      // Re-lanzar el error para que sea manejado por el controlador
      throw error;
    }
  }

  /**
   * Verifica si un cliente tiene un crédito activo basado en sus solicitudes formales y contratos.
   *
   * Este método privado consulta todas las solicitudes formales del cliente por DNI
   * y verifica si alguna tiene contratos asociados con estado "generado" (activo).
   *
   * @param   cuilCliente - CUIL del cliente a verificar
   * @returns Promise<boolean> - true si el cliente tiene un crédito activo, false en caso contrario
   */
  private async tieneCreditoActivo(cuilCliente: string): Promise<boolean> {
    // Usar CUIL en lugar de DNI
    const solicitudesFormales =
      await this.solicitudFormalRepository.getSolicitudesFormalesByCuil(
        cuilCliente
      );

    for (const solicitud of solicitudesFormales) {
      const contratos =
        await this.contratoRepository.getContratosBySolicitudFormalId(
          solicitud.getId()
        );
      const tieneContratoActivo = contratos.some(
        (contrato) => contrato.getEstado().toLowerCase() === "generado"
      );

      if (tieneContratoActivo) {
        return true;
      }
    }
    return false;
  }

  /**
   * Notifica a todos los analistas activos sobre una nueva solicitud inicial.
   *
   * Este método envía una notificación a todos los analistas registrados en el sistema
   * para que revisen la nueva solicitud inicial creada.
   *
   * @param solicitud - La solicitud inicial que se ha creado
   */
  private async notificarAnalistas(
    solicitud: SolicitudInicial,
    cliente: Cliente
  ): Promise<void> {
    try {
      const analistaIds =
        await this.analistaRepository.obtenerIdsAnalistasActivos();
      const notificaciones = analistaIds.map((analistaId) =>
        this.notificationService.emitNotification({
          userId: analistaId,
          type: "solicitud_inicial",
          message: "Nueva solicitud inicial requiere revisión",
          metadata: {
            solicitudId: solicitud.getId(),
            cuilCliente: cliente.getCuil(),
            comercianteId: solicitud.getComercianteId(),
            prioridad: "media",
          },
        })
      );
      await Promise.all(notificaciones);
    } catch (error) {
      console.error("Error notificando a analistas:", error);
      // Registrar error opcional
    }
  }

private async verificarSolicitudesExistentes(
  cuilCliente: string,
  comercianteIdActual: number
): Promise<{
  tieneSolicitudOtroComercio: boolean;
  tieneSolicitudMismoComercio: boolean;
  comercianteOriginal?: number;
  nombreComercioOriginal?: string;
}> {
  try {
    console.log(`🔍 Buscando solicitudes para CUIL: ${cuilCliente}`);

    const solicitudesCliente = await this.solicitudInicialRepository.getSolicitudesInicialesByCuil(cuilCliente);
    console.log(`📊 Encontradas ${solicitudesCliente.length} solicitudes para el cliente`);

    if (solicitudesCliente.length === 0) {
      console.log(`✅ No hay solicitudes existentes`);
      return { 
        tieneSolicitudOtroComercio: false, 
        tieneSolicitudMismoComercio: false 
      };
    }

    // 🚨 FILTRAR SOLO ESTADOS QUE BLOQUEAN NUEVAS SOLICITUDES
    const solicitudesBloqueantes = await this.filtrarSolicitudesBloqueantes(
      solicitudesCliente, 
      comercianteIdActual
    );

    console.log(`📊 Solicitudes bloqueantes totales: ${solicitudesBloqueantes.length}`);

    if (solicitudesBloqueantes.length === 0) {
      return { 
        tieneSolicitudOtroComercio: false, 
        tieneSolicitudMismoComercio: false 
      };
    }

    // Separar entre solicitudes del mismo comerciante y de otros comercios
    const solicitudesMismoComercio = solicitudesBloqueantes.filter(
      solicitud => solicitud.getComercianteId() === comercianteIdActual
    );
    
    const solicitudesOtroComercio = solicitudesBloqueantes.filter(
      solicitud => solicitud.getComercianteId() !== comercianteIdActual
    );

    console.log(`📊 Solicitudes bloqueantes mismo comercio: ${solicitudesMismoComercio.length}`);
    console.log(`📊 Solicitudes bloqueantes otro comercio: ${solicitudesOtroComercio.length}`);

    // Si hay solicitudes de otros comercios, priorizar ese mensaje
    if (solicitudesOtroComercio.length > 0) {
      const solicitudOriginal = solicitudesOtroComercio[0];
      const comercianteOriginalId = solicitudOriginal.getComercianteId();
      let nombreComercioOriginal = "Comercio no disponible";

      if (comercianteOriginalId) {
        try {
          const comercianteOriginal = await this.comercianteRepository.findById(comercianteOriginalId);
          nombreComercioOriginal = comercianteOriginal.getNombreComercio();
          console.log(`🏪 Comercio original: ${nombreComercioOriginal}`);
        } catch (error) {
          console.error("Error obteniendo datos del comerciante original:", error);
        }
      }

      return {
        tieneSolicitudOtroComercio: true,
        tieneSolicitudMismoComercio: false, // Aunque pueda haber del mismo, priorizamos el mensaje de otro comercio
        comercianteOriginal: comercianteOriginalId,
        nombreComercioOriginal,
      };
    }

    // Si hay solicitudes del mismo comerciante
    if (solicitudesMismoComercio.length > 0) {
      return {
        tieneSolicitudOtroComercio: false,
        tieneSolicitudMismoComercio: true,
      };
    }

    return { 
      tieneSolicitudOtroComercio: false, 
      tieneSolicitudMismoComercio: false 
    };
  } catch (error) {
    console.error("❌ Error en verificación de solicitudes existentes:", error);
    return { 
      tieneSolicitudOtroComercio: false, 
      tieneSolicitudMismoComercio: false 
    };
  }
}

/**
 * Filtra las solicitudes que realmente deberían bloquear nuevas solicitudes
 * Considera el estado de las compras asociadas y diferencia entre mismo y otro comerciante
 */
private async filtrarSolicitudesBloqueantes(
  solicitudesCliente: SolicitudInicial[],
  comercianteIdActual: number
): Promise<SolicitudInicial[]> {
  const solicitudesBloqueantes: SolicitudInicial[] = [];

  for (const solicitud of solicitudesCliente) {
    const solicitudComercianteId = solicitud.getComercianteId();
    const esMismoComerciante = solicitudComercianteId === comercianteIdActual;
    const esOtroComercio = !esMismoComerciante;
    
    const estado = solicitud.getEstado();
    
    console.log(
      `📋 Analizando Solicitud ID: ${solicitud.getId()}, ` +
      `Estado: ${estado}, Comerciante: ${solicitudComercianteId}, ` +
      `EsMismoComerciante: ${esMismoComerciante}`
    );

    // ✅ LÓGICA DE BLOQUEO ACTUALIZADA - DIFERENCIAR MISMO VS OTRO COMERCIO
    let esBloqueante = false;

    if (esMismoComerciante) {
      // 🚨 PARA EL MISMO COMERCIANTE: BLOQUEAR SIEMPRE (excepto expirada)
      switch (estado) {
        case "pendiente":
        case "aprobada":
        case "rechazada":
          esBloqueante = true;
          console.log(`   🚫 BLOQUEANTE (mismo comercio): Estado ${estado}`);
          break;
        case "expirada":
          esBloqueante = false;
          console.log(`   ✅ PERMITIDA (mismo comercio): Solicitud expirada`);
          break;
        default:
          esBloqueante = false;
      }
    } else {
      // 🚨 PARA OTRO COMERCIO: LÓGICA ESPECÍFICA
      switch (estado) {
        case "pendiente":
          // Bloquea - ya está en evaluación en otro comercio
          esBloqueante = true;
          console.log(`   🚫 BLOQUEANTE (otro comercio): Solicitud pendiente en evaluación`);
          break;

        case "rechazada":
          // Bloquea - evita shopping de créditos rechazados
          esBloqueante = true;
          console.log(`   🚫 BLOQUEANTE (otro comercio): Solicitud rechazada`);
          break;

        case "aprobada":
          // ✅ CAMBIO CLAVE: Solo bloquea si tiene compras ACTIVAS
          // Si está aprobada pero SIN compras, PERMITIR que otro comercio cree solicitud
          const tieneComprasActivas = await this.tieneComprasActivas(solicitud);
          esBloqueante = tieneComprasActivas;
          console.log(`   ${tieneComprasActivas ? '🚫 BLOQUEANTE' : '✅ PERMITIDA'} (otro comercio): Solicitud aprobada ${tieneComprasActivas ? 'CON' : 'SIN'} compras activas`);
          break;

        case "expirada":
          // Nunca bloquea - el crédito venció
          esBloqueante = false;
          console.log(`   ✅ PERMITIDA (otro comercio): Solicitud expirada`);
          break;

        default:
          esBloqueante = false;
          console.log(`   ⚠️  Estado no manejado: ${estado}`);
      }
    }

    if (esBloqueante) {
      solicitudesBloqueantes.push(solicitud);
    }
  }

  return solicitudesBloqueantes;
}

/**
 * Verifica si una solicitud inicial tiene compras activas asociadas
 * Una compra activa es cualquier compra que NO esté rechazada
 */
private async tieneComprasActivas(solicitudInicial: SolicitudInicial): Promise<boolean> {
  try {
    // Obtener la solicitud formal asociada
    const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalBySolicitudInicialId(
      solicitudInicial.getId()
    );

    if (!solicitudFormal) {
      console.log(`   📦 No hay solicitud formal asociada`);
      return false; // No hay solicitud formal, no hay compras
    }

    // Obtener compras asociadas a la solicitud formal
    const compras = await this.compraRepository.getComprasBySolicitudFormalId(
      solicitudFormal.getId()
    );

    // Buscar si hay alguna compra que NO esté rechazada
    const tieneComprasActivas = compras.some((compra: { getEstado: () => string; }) => 
      compra.getEstado().toLowerCase() !== 'rechazada'
    );

    console.log(`   📦 Compras encontradas: ${compras.length}, Activas: ${tieneComprasActivas}`);
    
    return tieneComprasActivas;

  } catch (error) {
    console.error(`   ❌ Error verificando compras:`, error);
    // En caso de error, asumir que no hay compras activas para no bloquear incorrectamente
    return false;
  }
}

  /**
   * Genera comentarios detallados para analistas
   */
  private generarComentariosAnalista(
    resultadoNosis: VerificationResult,
    entidadesService: EntidadesService
  ): string {
      let comentario = "";

  // Agregar información de Eureka si está disponible
  if (resultadoNosis.eurekaMensajeAnalista) {
    comentario += `${resultadoNosis.eurekaMensajeAnalista}\n\n`;
  }

  comentario += `Resultado Nosis: ${resultadoNosis.status}. `;

    if (
      resultadoNosis.reglasFallidas &&
      resultadoNosis.reglasFallidas.length > 0
    ) {
      comentario += `Rechazos: ${resultadoNosis.reglasFallidas.join("; ")}. `;
    }

    if (resultadoNosis.pendientes && resultadoNosis.pendientes.length > 0) {
      comentario += `Pendientes: ${resultadoNosis.pendientes.join("; ")}. `;
    }

    if (resultadoNosis.aprobados && resultadoNosis.aprobados.length > 0) {
      comentario += `Aprobados: ${resultadoNosis.aprobados.join("; ")}. `;
    }

    // Información de entidades si existe
    if (
      resultadoNosis.entidadesSituacion2 &&
      resultadoNosis.entidadesSituacion2.length > 0
    ) {
      const nombresEntidades = entidadesService.obtenerNombresEntidades(
        resultadoNosis.entidadesSituacion2
      );
      comentario += `Entidades situación 2: ${nombresEntidades.join(", ")}. `;
    }

    if (
      resultadoNosis.entidadesDeuda &&
      resultadoNosis.entidadesDeuda.length > 0
    ) {
      const nombresEntidades = entidadesService.obtenerNombresEntidades(
        resultadoNosis.entidadesDeuda
      );
      comentario += `Entidades con deuda: ${nombresEntidades.join(", ")}. `;
    }

    // Información de referencias comerciales
    if (resultadoNosis.referenciasComerciales) {
      const ref = resultadoNosis.referenciasComerciales;
      comentario += `Ref. válidas: ${
        ref.totalValidas
      } (${ref.referenciasValidas.join(", ")}). `;
      comentario += `Ref. no válidas: ${
        ref.totalInvalidas
      } (${ref.referenciasInvalidas.join(", ")}). `;
    }

    return comentario;
  }

  /**
   * Genera comentarios específicos para comerciantes con motivos exactos
   */
  private generarComentariosComerciante(
  resultadoNosis: VerificationResult,
  entidadesService: EntidadesService
): string {
  // SOLO usar mensaje de Eureka si no hay reglas fallidas (rechazos)
  if (resultadoNosis.eurekaMensajeComerciante && 
      (!resultadoNosis.reglasFallidas || resultadoNosis.reglasFallidas.length === 0)) {
    return resultadoNosis.eurekaMensajeComerciante;
  }
  
  // Si hay reglas fallidas, priorizar los motivos de rechazo
  if (resultadoNosis.status === "rechazado") {
    let motivo = "Solicitud rechazada";

    if (resultadoNosis.reglasFallidas && resultadoNosis.reglasFallidas.length > 0) {
      const motivosPrincipales: string[] = [];

      // Verificar si el rechazo es por rubros especiales
      const detalleRubro = this.obtenerDetalleRubroRechazo(resultadoNosis.reglasFallidas);
      if (detalleRubro) {
        return `Solicitud rechazada: rubro - ${detalleRubro.rubro}${detalleRubro.razones ? `, ${detalleRubro.razones}` : ''}`;
      }

      // Lógica para otros tipos de rechazo
      for (const regla of resultadoNosis.reglasFallidas) {
        if (regla.includes("entidades en situación 2")) {
          const match = regla.match(/(\d+) entidades/);
          const cantidad = match ? match[1] : "varias";
          motivosPrincipales.push(`tiene ${cantidad} entidades en situación 2`);
        } else if (regla.includes("entidades con deuda")) {
          const match = regla.match(/(\d+) entidades/);
          const cantidad = match ? match[1] : "varias";
          motivosPrincipales.push(`tiene deuda con ${cantidad} entidades`);
        } else if (regla.includes("referencias comerciales")) {
          const match = regla.match(/(\d+) referencias comerciales válidas/);
          if (match) {
            motivosPrincipales.push(`tiene ${match[1]} referencias comerciales válidas (máximo permitido: 2)`);
          } else {
            motivosPrincipales.push("no cumple con criterios de referencias comerciales");
          }
        } else if (regla.includes("tarjeta Crediguía")) {
          motivosPrincipales.push("tiene tarjeta Crediguía activa");
        } else if (regla.includes("aporte")) {
          motivosPrincipales.push("no cumple con el mínimo de aportes requerido");
        } else if (regla.includes("jubilado")) {
          motivosPrincipales.push("es jubilado");
        } else if (regla.includes("monotributista")) {
          motivosPrincipales.push("es monotributista sin empleo registrado");
        } else if (regla.includes("situación laboral")) {
          motivosPrincipales.push("no tiene situación laboral registrada");
        } else {
          const partePrincipal = regla.split(":")[0] || regla;
          motivosPrincipales.push(partePrincipal.toLowerCase());
        }
      }

      if (motivosPrincipales.length > 0) {
        motivo += `: ${motivosPrincipales.join(", ")}`;
      }
    }

    return motivo;
  } else if (resultadoNosis.status === "pendiente") {
    // Usar mensaje de Eureka solo si no hay otros pendientes más importantes
    if (resultadoNosis.eurekaMensajeComerciante && 
        (!resultadoNosis.pendientes || resultadoNosis.pendientes.length === 0)) {
      return resultadoNosis.eurekaMensajeComerciante;
    }
    
    let motivo = "Solicitud pendiente de revisión manual";
    if (resultadoNosis.pendientes && resultadoNosis.pendientes.length > 0) {
      const motivosPendientes: string[] = [];
      for (const pendiente of resultadoNosis.pendientes) {
        if (pendiente.includes("entidades en situación 2")) {
          motivosPendientes.push("tiene 1 entidad en situación 2");
        } else if (pendiente.includes("entidades con deuda")) {
          const match = pendiente.match(/(\d+) entidades/);
          const cantidad = match ? match[1] : "algunas";
          motivosPendientes.push(`tiene deuda con ${cantidad} entidades`);
        } else if (pendiente.includes("referencias comerciales")) {
          const match = pendiente.match(/(\d+) referencia/);
          if (match) {
            motivosPendientes.push(`tiene ${match[1]} referencia(s) comercial(es) válida(s)`);
          } else {
            motivosPendientes.push("requiere validación de referencias comerciales");
          }
        } else {
          motivosPendientes.push(pendiente.toLowerCase());
        }
      }
      if (motivosPendientes.length > 0) {
        motivo += `: ${motivosPendientes.join(", ")}`;
      }
    }
    return motivo;
  } else if (resultadoNosis.status === "aprobado") {
    // Para aprobados, sí usar el mensaje de Eureka
    return resultadoNosis.eurekaMensajeComerciante || "Solicitud aprobada automáticamente";
  }

  return "Solicitud en proceso de evaluación";
}

  /**
 * Determina el rubro específico y las razones detalladas del rechazo
 */
private obtenerDetalleRubroRechazo(reglasFallidas: string[]): { rubro: string, razones: string } | null {
  for (const regla of reglasFallidas) {
    // Detectar empleado doméstico
    if (regla.includes("Empleado doméstico RECHAZADO")) {
      const razones = this.extraerRazonesEspecificas(regla);
      return { 
        rubro: "Doméstico", 
        razones: razones 
      };
    }
    
    // Detectar rubros de construcción/contratación
    if (regla.includes("Trabaja en rubro de construcción/contratación")) {
      // Extraer el código y descripción del rubro del mensaje
      const rubroMatch = regla.match(/\(([^)]+)\)/);
      let rubroEspecifico = "Construcción o Contratación de personal";
      
      if (rubroMatch && rubroMatch[1]) {
        const [codigo, descripcion] = rubroMatch[1].split(" - ");
        
        // Determinar el tipo específico basado en la descripción
        if (descripcion) {
          const descripcionLower = descripcion.toLowerCase();
          
          if (descripcionLower.includes("construcción") || descripcionLower.includes("construccion")) {
            rubroEspecifico = "Construcción";
          } else if (descripcionLower.includes("contratación") || descripcionLower.includes("contratacion") || 
                     descripcionLower.includes("personal") || descripcionLower.includes("empleo")) {
            rubroEspecifico = "Contratación de personal";
          } else {
            rubroEspecifico = descripcion;
          }
        }
      }

      const razones = this.extraerRazonesEspecificas(regla);
      return { 
        rubro: rubroEspecifico, 
        razones: razones 
      };
    }
  }
  
  return null;
}

/**
 * Extrae las razones específicas de deudas y/o falta de aportes del mensaje de rechazo
 */
private extraerRazonesEspecificas(mensajeRechazo: string): string {
  const razones: string[] = [];

  // Buscar patrones específicos en el mensaje
  if (mensajeRechazo.includes("no tiene 12 meses de aportes completos")) {
    razones.push("no tiene 12 meses de aportes completos");
  }
  
  if (mensajeRechazo.includes("tiene deudas")) {
    razones.push("tiene deudas");
  }

  // Si no encontramos patrones específicos, intentar extraer la parte después de "RECHAZADO - "
  if (razones.length === 0) {
    const rechazoMatch = mensajeRechazo.split("RECHAZADO - ");
    if (rechazoMatch.length > 1) {
      return rechazoMatch[1].toLowerCase();
    }
  }

  return razones.join(" y ");
}

  /**
   * Método auxiliar para obtener datos del comerciante
   */
  private async obtenerComerciantePorId(comercianteId: number): Promise<any> {
    // Aquí necesitarías inyectar el repositorio de comerciantes
    // Por simplicidad, asumimos que existe un método para esto
    // En una implementación real, deberías inyectar ComercianteRepositoryPort
    throw new Error("Método obtenerComerciantePorId no implementado");
  }
}

/*
{
  "idSolicitudInicial": 1,
  "importeNeto":1500000,
  "comentarioInicial":"Solicitud creada por comerciante",
  "solicitaAmpliacionDeCredito":false,
  "datosEmpleador":{
    "razonSocialEmpleador":"Acme S.A",
    "cuitEmpleador":"123456",
    "cargoEmpleador":"cargo en la empresa",
    "sectorEmpleador": "sector en la empresa",
    "codigoPostalEmpleador":"8300",
    "localidadEmpleador":"NEUQUEN",
    "provinciaEmpleador":"NEUQUEN",
    "telefonoEmpleador":"299456789"
  },
  "cliente": {
    "nombreCompleto": "Benito",
    "apellido": "Dongato",
    "telefono": "+549555222669",
    "email": "Benito.Dongato@example.com",
    "aceptaTarjeta": true,
    "fechaNacimiento": "1985-05-15",
    "domicilio": "Calle Falsa 123, Buenos Aires",
    "sexo":"M",
    "codigoPostal":"8300",
    "localidad":"NEUQUEN",
    "provincia":"NEUQUEN",
    "numeroDomicilio":"1234",
    "barrio":"Barrio Falso",
    "recibo":"/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCA
*/
