// src/application/use-cases/SolicitudInicial/CrearSolicitudInicialUseCase.ts

/**
 * MÓDULO: Caso de Uso - Crear Solicitud Inicial
 *
 * Este módulo implementa la lógica de negocio para crear una nueva solicitud inicial de crédito.
 * Maneja la validación de clientes, verificación de créditos activos, creación de solicitudes
 * y notificaciones correspondientes.
 *
 * RESPONSABILIDADES:
 * - Validar que el cliente no tenga créditos activos
 * - Crear o recuperar información del cliente
 * - Crear la solicitud inicial con estado pendiente
 * - Registrar eventos en el historial del sistema
 * - Enviar notificaciones al comerciante
 * - Manejar errores y excepciones
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
import { PageEmbeddingMismatchedContextError } from "pdf-lib";

export type CrearSolicitudInicialResponse = {
  solicitud: SolicitudInicial;
  nosisData?: PersonalData;
  motivoRechazo?: string;
  reglasFallidas?: string[];
};
/**
 * Caso de uso para crear una nueva solicitud inicial de crédito.
 *
 * Esta clase implementa la lógica completa para crear una solicitud inicial,
 * incluyendo validaciones de negocio, creación de entidades y manejo de eventos.
 */
export class CrearSolicitudInicialUseCase {
  /**
   * Constructor del caso de uso.
   *
   * @param solicitudInicialRepository - Puerto para operaciones de solicitudes iniciales
   * @param contratoRepository - Puerto para operaciones de contratos
   * @param solicitudFormalRepository - Puerto para operaciones de solicitudes formales
   * @param verazService - Puerto para servicios de Veraz (actualmente deshabilitado)
   * @param notificationService - Puerto para servicios de notificación
   * @param clienteRepository - Puerto para operaciones de clientes
   * @param historialRepository - Puerto para registro de eventos en historial
   * @param analistaRepository - Puerto para operaciones de analistas
   * @param verazAutomatico - Booleano para activar modo automático de Veraz
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
    private readonly nosisAutomatico: boolean
  ) {}

  /**
   * Ejecuta la creación de una solicitud inicial de crédito.
   *
   * Este método implementa el flujo completo de creación de solicitud inicial:
   * 1. Busca o crea el cliente según el DNI proporcionado
   * 2. Verifica que el cliente no tenga créditos activos
   * 3. Crea la solicitud inicial con estado pendiente
   * 4. Registra el evento en el historial
   * 5. Envía notificaciones al comerciante
   *
   * @param dniCliente - DNI del cliente para la solicitud
   * @param cuilCliente - CUIL del cliente para la solicitud
   * @param comercianteId - ID del comerciante que crea la solicitud
   * @param reciboSueldo - Buffer opcional con el recibo de sueldo del cliente
   * @returns Promise<SolicitudInicial> - La solicitud inicial creada
   * @throws Error - Si el cliente ya tiene un crédito activo o si ocurre un error en el proceso
   */
  async execute(
    dniCliente: string,
    cuilCliente: string,
    comercianteId: number
  ): Promise<CrearSolicitudInicialResponse> {
    try {
      let cliente: Cliente;
      let clienteTemporal: Cliente;
      try {
      cliente = await this.clienteRepository.findByCuil(cuilCliente);
      } catch (error) {
        // No se encontró el cliente, se creará uno nuevo
      } finally {
          
      // Crear con datos mínimos si no existe
        cliente = new Cliente(
        0,
        "Nombre temporal",
        "Apellido temporal",
        dniCliente,
        cuilCliente
      );
        clienteTemporal = await this.clienteRepository.save(cliente);
      }
      
      
      // 1. Verificar si el cliente tiene crédito activo
      const tieneCreditoActivo = await this.tieneCreditoActivo(cuilCliente); // Usar CUIL en lugar de DNI
      if (tieneCreditoActivo) {
        // Notificar al comerciante que no puede crear solicitud
        await this.notificationService.emitNotification({
          userId: Number(comercianteId),
          type: "solicitud_inicial",
          message: `El cliente con CUIL ${cuilCliente} ya tiene un crédito activo`,
        });

        // Registrar evento de rechazo
        await this.historialRepository.registrarEvento({
          usuarioId: comercianteId,
          accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
          entidadAfectada: "solicitudes_iniciales",
          entidadId: 0, // No hay entidad aún
          detalles: {
            motivo: "Cliente con crédito activo",
            dni_cliente: cuilCliente,
          },
          solicitudInicialId: undefined, // No hay solicitud aún
        });

        throw new Error("El cliente ya tiene un crédito activo");
      }

      // Crear solicitud vinculada al cliente
      const solicitud = new SolicitudInicial(
        0,
        new Date(),
        "pendiente",
        clienteTemporal.getId(),
        comercianteId
      );

      // 3. Guardar solicitud inicial
      const solicitudCreada =
        await this.solicitudInicialRepository.createSolicitudInicial(
          solicitud,
          clienteTemporal
        );

      const solicitudInicialId = solicitudCreada.getId();

      // Registrar evento de creación
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

      let nosisData: PersonalData | undefined;
      let motivoRechazo: string | undefined;
      let reglasFallidas: string[] | undefined;

      try {
        const getNosisData = new GetDataNosisUseCase(this.nosisPort);
        const nosisResponse = await getNosisData.execute(cuilCliente);
        const verifyNosis = new VerifyDataNosisUseCase();
        const resultadoNosis = await verifyNosis.execute(nosisResponse);
        nosisData = resultadoNosis.personalData;
        ///////////////////// Actualizar datos del cliente con info de Nosis //////////////
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


        //Datos laborales
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
            nosisData.datosLaborales.empleador.domicilio && nosisData.datosLaborales.empleador.domicilio.codigoPostal 
              ? nosisData.datosLaborales.empleador.domicilio.codigoPostal
              : null
          );

          clienteTemporal.setEmpleadorLocalidad(
            nosisData.datosLaborales.empleador.domicilio && nosisData.datosLaborales.empleador.domicilio.localidad
              ? nosisData.datosLaborales.empleador.domicilio.localidad
              : null
          );
          clienteTemporal.setEmpleadorProvincia(
            nosisData.datosLaborales.empleador.domicilio && nosisData.datosLaborales.empleador.domicilio.provincia
              ? nosisData.datosLaborales.empleador.domicilio.provincia
              : null
          );
          
        }
        await this.clienteRepository.update(clienteTemporal);
        //////////////////// FIN Actualizar datos del cliente con info de Nosis //////////////
        console.log("Actualizando cliente con datos de Nosis:", clienteTemporal);
        if (this.nosisAutomatico) {
          const getNosisData = new GetDataNosisUseCase(this.nosisPort);
          const nosisData = await getNosisData.execute(cuilCliente);

          const verifyNosis = new VerifyDataNosisUseCase();
          const resultadoNosis = await verifyNosis.execute(nosisData);

          if (resultadoNosis.status === "aprobado") {
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
          } else if (resultadoNosis.status === "rechazado") {
            motivoRechazo = resultadoNosis.motivo;
            reglasFallidas = resultadoNosis.reglasFallidas;
            solicitudCreada.setEstado("rechazada");
            solicitud.setMotivoRechazo(motivoRechazo ?? "");
            solicitud.agregarComentario(`Rechazo: ${motivoRechazo}`);
            //se guarda el motivo de rechazo en la solicitud
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
              },
              solicitudInicialId,
            });
          } else {
            solicitudCreada.setEstado("pendiente");
            await this.solicitudInicialRepository.updateSolicitudInicial(
              solicitudCreada,
              clienteTemporal
            );
            await this.notificarAnalistas(solicitudCreada, clienteTemporal);
          }
        } else {
          // Modo manual
          await this.notificarAnalistas(solicitudCreada, clienteTemporal);
        }
      } catch (error) {
        console.error("Error obteniendo datos de Nosis:", error);
      }

      // Notificación al comerciante (existente)
      await this.notificationService.emitNotification({
        userId: Number(comercianteId),
        type: "solicitud_inicial",
        message: "Solicitud inicial creada exitosamente",
      });

      return {
        solicitud: solicitudCreada,
        nosisData,
        motivoRechazo,
        reglasFallidas,
      };
    } catch (error) {
      // Notificar error al comerciante
      let errorMessage = "Error desconocido";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      await this.notificationService.emitNotification({
        userId: Number(comercianteId),
        type: "error",
        message: `Error al crear solicitud: ${errorMessage}`,
      });

      // Registrar evento de error
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
