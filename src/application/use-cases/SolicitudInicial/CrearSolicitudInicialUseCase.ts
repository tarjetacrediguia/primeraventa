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
  VerifyDataNosisUseCase,
} from "../Nosis/VerifyDataNosisUseCase";
import { EntidadesService } from "../../../infrastructure/entidadesBancarias/EntidadesService";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

export type CrearSolicitudInicialResponse = {
  solicitud: SolicitudInicial;
  nosisData?: PersonalData;
  motivoRechazo?: string;
  reglasFallidas?: string[];
  entidadesSituacion2?: number[];
  entidadesDeuda?: number[];
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
    private readonly comercianteRepository: ComercianteRepositoryPort
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
    console.log(`Verificando solicitudes existentes para CUIL: ${cuilCliente}, comerciante: ${comercianteId}`);
    
    const solicitudesExistentes = await this.verificarSolicitudesExistentes(cuilCliente, comercianteId);
    
    if (solicitudesExistentes.tieneSolicitudOtroComercio) {
      console.log(`❌ Cliente ya tiene solicitud de otro comercio: ${solicitudesExistentes.nombreComercioOriginal}`);
      
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
          nombre_comercio_original: solicitudesExistentes.nombreComercioOriginal
        },
        solicitudInicialId: undefined,
      });

      throw new Error(`El cliente ya tiene una solicitud inicial en el sistema. Comercio original: ${solicitudesExistentes.nombreComercioOriginal}`);
    }

    console.log(`✅ No hay solicitudes de otros comercios, continuando...`);
      
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
        cuil: cuilCliente
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
        id:0,
        fechaCreacion:new Date(),
        estado:"pendiente",
        clienteId: clienteTemporal.getId(),
        comercianteId: comercianteId
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

      try {
        // Obtener datos del cliente desde Nosis
        const getNosisData = new GetDataNosisUseCase(this.nosisPort);
        const nosisResponse = await getNosisData.execute(cuilCliente);
        
        // Verificar y validar datos de Nosis
        const verifyNosis = new VerifyDataNosisUseCase(undefined, this.entidadesService);
        const resultadoNosis = await verifyNosis.execute(nosisResponse);
        nosisData = resultadoNosis.personalData;
        
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
            solicitud.agregarComentario(`Aprobado: Nosis automático`);
            await this.historialRepository.registrarEvento({
              usuarioId: null,
              accion: HISTORIAL_ACTIONS.APPROVE_SOLICITUD_INICIAL,
              entidadAfectada: "solicitudes_iniciales",
              entidadId: solicitudCreada.getId(),
              detalles: {
                sistema: "Nosis",
                score: resultadoNosis.score,
                motivo: resultadoNosis.motivo,
              },
              solicitudInicialId,
            });
          } else if (resultadoNosis.status === "pendiente") {
            // Mantener estado pendiente para revisión manual
            motivoRechazo = resultadoNosis.motivo;
            reglasFallidas = resultadoNosis.reglasFallidas;
            solicitudCreada.setEstado("pendiente");
            solicitud.setMotivoRechazo(motivoRechazo ?? "");

            // Agregar comentario con información detallada de entidades
            solicitud.agregarComentario(`Pendiente: ${motivoRechazo}`);

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
                entidadesSituacion2: resultadoNosis.entidadesSituacion2,
                entidadesDeuda: resultadoNosis.entidadesDeuda
              },
              solicitudInicialId,
            });
          } else if (resultadoNosis.status === "rechazado") {
            // Rechazar automáticamente la solicitud
            motivoRechazo = resultadoNosis.motivo;
            reglasFallidas = resultadoNosis.reglasFallidas;
            solicitudCreada.setEstado("rechazada");
            solicitud.setMotivoRechazo(motivoRechazo ?? "");

            // Agregar comentario con información detallada de entidades
            let comentario = `Rechazo: ${motivoRechazo}`;
            if (resultadoNosis.entidadesSituacion2 && resultadoNosis.entidadesSituacion2.length > 0) {
              const nombresEntidades = this.entidadesService.obtenerNombresEntidades(resultadoNosis.entidadesSituacion2);
              comentario += `. Entidades en situación 2: ${nombresEntidades.join(', ')}`;
            }
            if (resultadoNosis.entidadesDeuda && resultadoNosis.entidadesDeuda.length > 0) {
              const nombresEntidades = this.entidadesService.obtenerNombresEntidades(resultadoNosis.entidadesDeuda);
              comentario += `. Entidades con deuda: ${nombresEntidades.join(', ')}`;
            }
            
            solicitud.agregarComentario(comentario);
            
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
                entidadesSituacion2: resultadoNosis.entidadesSituacion2,
                entidadesDeuda: resultadoNosis.entidadesDeuda
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

  /**
   * Verifica si el cliente ya tiene solicitudes iniciales de otros comercios
   * @param cuilCliente - CUIL del cliente a verificar
   * @param comercianteIdActual - ID del comerciante que intenta crear la solicitud
   * @returns Información sobre solicitudes existentes de otros comercios
   */
  private async verificarSolicitudesExistentes(
  cuilCliente: string, 
  comercianteIdActual: number
): Promise<{
  tieneSolicitudOtroComercio: boolean;
  comercianteOriginal?: number;
  nombreComercioOriginal?: string;
}> {
  try {
    console.log(`🔍 Buscando solicitudes para CUIL: ${cuilCliente}`);
    
    const solicitudesCliente = await this.solicitudInicialRepository.getSolicitudesInicialesByCuil(cuilCliente);
    console.log(`📊 Encontradas ${solicitudesCliente.length} solicitudes para el cliente`);
    
    if (solicitudesCliente.length === 0) {
      console.log(`✅ No hay solicitudes existentes`);
      return { tieneSolicitudOtroComercio: false };
    }

    // Filtrar solicitudes que no sean del comerciante actual
    const solicitudesOtroComercio = solicitudesCliente.filter(solicitud => {
      const solicitudComercianteId = solicitud.getComercianteId();
      const esOtroComercio = solicitudComercianteId !== comercianteIdActual;
      const estadoValido = ['pendiente', 'aprobada', 'rechazada'].includes(solicitud.getEstado());
      
      console.log(`Solicitud ID: ${solicitud.getId()}, Comerciante: ${solicitudComercianteId}, Estado: ${solicitud.getEstado()}, EsOtroComercio: ${esOtroComercio}, EstadoValido: ${estadoValido}`);
      
      return esOtroComercio && estadoValido;
    });

    console.log(`📊 Solicitudes de otros comercios: ${solicitudesOtroComercio.length}`);

    if (solicitudesOtroComercio.length === 0) {
      return { tieneSolicitudOtroComercio: false };
    }

    // Obtener información del comerciante original
    const solicitudOriginal = solicitudesOtroComercio[0];
    const comercianteOriginalId = solicitudOriginal.getComercianteId();
    let nombreComercioOriginal = 'Comercio no disponible';
    
    if (comercianteOriginalId) {
      try {
        const comercianteOriginal = await this.comercianteRepository.findById(comercianteOriginalId);
        nombreComercioOriginal = comercianteOriginal.getNombreComercio();
        console.log(`🏪 Comercio original: ${nombreComercioOriginal}`);
      } catch (error) {
        console.error('Error obteniendo datos del comerciante original:', error);
      }
    }

    return {
      tieneSolicitudOtroComercio: true,
      comercianteOriginal: comercianteOriginalId,
      nombreComercioOriginal
    };
  } catch (error) {
    console.error('❌ Error en verificación de solicitudes existentes:', error);
    // En caso de error, permitir continuar (fail-open)
    return { tieneSolicitudOtroComercio: false };
  }
}

  /**
   * Método auxiliar para obtener datos del comerciante
   */
  private async obtenerComerciantePorId(comercianteId: number): Promise<any> {
    // Aquí necesitarías inyectar el repositorio de comerciantes
    // Por simplicidad, asumimos que existe un método para esto
    // En una implementación real, deberías inyectar ComercianteRepositoryPort
    throw new Error('Método obtenerComerciantePorId no implementado');
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
