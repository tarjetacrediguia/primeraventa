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
import { GetSituacionPersona } from "../Eureka/GetSituacionPersona";
import { EurekaAdapter } from "../../../infrastructure/adapters/eureka/eurekaAdapter";
import { SituacionPersonaResponse } from "../../ports/EurekaPort";

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

export class CrearSolicitudInicialUseCase {
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

  async execute(
    dniCliente: string,
    cuilCliente: string,
    comercianteId: number
  ): Promise<CrearSolicitudInicialResponse> {
    try {
      // ===== PASO 1: VERIFICAR SOLICITUDES EXISTENTES =====
      console.log(
        `Verificando solicitudes existentes para CUIL: ${cuilCliente}, comerciante: ${comercianteId}`
      );

      const solicitudesExistentes = await this.verificarSolicitudesExistentes(
        cuilCliente,
        comercianteId
      );

      if (solicitudesExistentes.tieneSolicitudOtroComercio) {
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
            nombre_comercio_original:
              solicitudesExistentes.nombreComercioOriginal,
          },
          solicitudInicialId: undefined,
        });

        throw new Error(
          `El cliente ya tiene una solicitud inicial en el sistema, creada por otro comercio.`
        );
      }

      if (solicitudesExistentes.tieneSolicitudMismoComercio) {
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

      // ===== PASO 2: VALIDAR CRÉDITO ACTIVO =====
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

      console.log(`✅ No hay créditos activos, continuando...`);

      // ===== PASO 3: INTEGRACIÓN CON NOSIS Y EUREKA (ANTES DE CREAR SOLICITUD) =====
      let nosisData: PersonalData | undefined;
      let resultadoNosis: VerificationResult | undefined;
      let situacionEureka: SituacionPersonaResponse | undefined;

      try {
        console.log(
          `🔍 Iniciando verificación con Nosis para CUIL: ${cuilCliente}`
        );

        // 3.1 Verificación con Nosis
        const getNosisData = new GetDataNosisUseCase(this.nosisPort);
        const nosisResponse = await getNosisData.execute(cuilCliente);

        console.log(`✅ Nosis: Datos obtenidos exitosamente`);

        // 3.2 Verificación con Eureka
        console.log(
          `🔍 Iniciando verificación con Eureka para CUIL: ${cuilCliente}`
        );
        try {
          const getSituacionPersona = new GetSituacionPersona(
            new EurekaAdapter()
          );
          situacionEureka = await getSituacionPersona.execute(cuilCliente);
          console.log(
            `✅ Eureka: Verificación exitosa - Estado: ${situacionEureka.Situacion}`
          );

          if (!situacionEureka.Situacion) {
            throw new Error("Respuesta de Eureka inválida: Estado no definido");
          }
        } catch (errorEureka) {
          const mensajeError =
            errorEureka instanceof Error
              ? errorEureka.message
              : "Error desconocido en Eureka";
          console.error(`❌ Eureka: Error en verificación - ${mensajeError}`);

          await this.notificationService.emitNotification({
            userId: Number(comercianteId),
            type: "error",
            message: `Error en verificación con sistema anterior (Eureka)`,
          });

          await this.historialRepository.registrarEvento({
            usuarioId: comercianteId,
            accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
            entidadAfectada: "solicitudes_iniciales",
            entidadId: 0,
            detalles: {
              error: mensajeError,
              servicio: "eureka",
              etapa: "verificacion_eureka",
              cuil_cliente: cuilCliente,
              tipo_error: this.clasificarErrorEureka(mensajeError),
            },
            solicitudInicialId: undefined,
          });

          throw new Error(
            `ERROR_EUREKA:${this.clasificarErrorEureka(
              mensajeError
            )}:${mensajeError}`
          );
        }

        // 3.3 Verificar datos de Nosis
        console.log(`🔍 Verificando datos de Nosis con reglas de negocio...`);
        const verifyNosis = new VerifyDataNosisUseCase(
          undefined,
          this.entidadesService,
          this.rubrosLaboralesService
        );

        resultadoNosis = await verifyNosis.execute(
          nosisResponse,
          situacionEureka
        );
        nosisData = resultadoNosis.personalData;

        console.log(
          `✅ Verificación Nosis completada - Estado: ${resultadoNosis.status}`
        );
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.startsWith("ERROR_EUREKA:")) {
            throw error;
          } else if (
            error.message.includes("Nosis") ||
            error.message.includes("nosis")
          ) {
            console.error(`❌ Nosis: Error en verificación - ${error.message}`);

            await this.notificationService.emitNotification({
              userId: Number(comercianteId),
              type: "error",
              message: `Error en verificación crediticia (Nosis)`,
            });

            await this.historialRepository.registrarEvento({
              usuarioId: comercianteId,
              accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
              entidadAfectada: "solicitudes_iniciales",
              entidadId: 0,
              detalles: {
                error: error.message,
                servicio: "nosis",
                etapa: "verificacion_nosis",
                cuil_cliente: cuilCliente,
                tipo_error: this.clasificarErrorNosis(error.message),
              },
              solicitudInicialId: undefined,
            });

            throw new Error(
              `ERROR_NOSIS:${this.clasificarErrorNosis(error.message)}:${
                error.message
              }`
            );
          }
        }

        console.error(`❌ Error general en integración:`, error);
        throw new Error(
          `ERROR_VERIFICACION:INTEGRACION:${
            error instanceof Error
              ? error.message
              : "Error desconocido en verificación crediticia"
          }`
        );
      }

      // ===== PASO 4: CREAR O RECUPERAR CLIENTE =====
      let cliente: Cliente;
      let clienteTemporal: Cliente;

      try {
        cliente = await this.clienteRepository.findByCuil(cuilCliente);
        clienteTemporal = cliente;
        console.log(`✅ Cliente encontrado con CUIL: ${cuilCliente}`);
      } catch (error) {
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

      // ===== PASO 5: CREAR SOLICITUD INICIAL (SOLO SI LAS VERIFICACIONES FUERON EXITOSAS) =====
      console.log(`✅ Creando solicitud inicial...`);

      const solicitud = new SolicitudInicial({
        id: 0,
        fechaCreacion: new Date(),
        estado: "pendiente",
        clienteId: clienteTemporal.getId(),
        comercianteId: comercianteId,
      });

      // ===== PASO 6: ACTUALIZAR DATOS DEL CLIENTE CON NOSIS =====
      if (nosisData) {
        try {
          this.actualizarDatosClienteConNosis(clienteTemporal, nosisData);
          await this.clienteRepository.update(clienteTemporal);
          console.log(
            `✅ Datos del cliente actualizados con información de Nosis`
          );
        } catch (error) {
          console.error(
            "Error actualizando datos del cliente con Nosis:",
            error
          );
        }
      }

      // ===== PASO 7: PERSISTIR SOLICITUD =====
      const solicitudCreada =
        await this.solicitudInicialRepository.createSolicitudInicial(
          solicitud,
          clienteTemporal
        );

      const solicitudInicialId = solicitudCreada.getId();

      // ===== PASO 8: APLICAR REGLAS DE APROBACIÓN AUTOMÁTICA =====
      if (this.nosisAutomatico && resultadoNosis) {
        await this.aplicarReglasAprobacionAutomatica(
          solicitudCreada,
          clienteTemporal,
          resultadoNosis,
          solicitudInicialId,
          comercianteId
        );
      } else {
        await this.notificarAnalistas(solicitudCreada, clienteTemporal);
      }

      // ===== PASO 9: REGISTRAR EVENTO EN HISTORIAL =====
      await this.historialRepository.registrarEvento({
        usuarioId: comercianteId,
        accion: HISTORIAL_ACTIONS.CREATE_SOLICITUD_INICIAL,
        entidadAfectada: "solicitudes_iniciales",
        entidadId: solicitudCreada.getId(),
        detalles: {
          dni_cliente: dniCliente,
          cuil_cliente: cuilCliente,
          comerciante_id: comercianteId,
          estado: solicitudCreada.getEstado(),
          nosis_exitoso: !!nosisData,
          eureka_exitoso: !!situacionEureka,
          estado_eureka: situacionEureka?.Situacion || "NO_DISPONIBLE",
        },
        solicitudInicialId: solicitudInicialId,
      });

      // ===== PASO 10: NOTIFICAR AL COMERCIANTE =====
      await this.notificationService.emitNotification({
        userId: Number(comercianteId),
        type: "solicitud_inicial",
        message: "Solicitud inicial creada exitosamente",
      });

      // ===== PASO 11: RETORNAR RESPUESTA =====
      return {
        solicitud: solicitudCreada,
        nosisData,
        motivoRechazo: resultadoNosis?.motivo,
        reglasFallidas: resultadoNosis?.reglasFallidas,
        entidadesSituacion2: resultadoNosis?.entidadesSituacion2,
        entidadesDeuda: resultadoNosis?.entidadesDeuda,
        referenciasComerciales: resultadoNosis?.referenciasComerciales,
      };
    } catch (error) {
      let errorMessage = "Error desconocido";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      await this.notificationService.emitNotification({
        userId: Number(comercianteId),
        type: "error",
        message: `Error al crear solicitud: ${errorMessage}`,
      });

      await this.historialRepository.registrarEvento({
        usuarioId: comercianteId,
        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
        entidadAfectada: "solicitudes_iniciales",
        entidadId: 0,
        detalles: {
          error: error instanceof Error ? error.message : String(error),
          etapa: "creacion_solicitud_inicial",
          dni_cliente: dniCliente,
          cuil_cliente: cuilCliente,
        },
        solicitudInicialId: undefined,
      });

      throw error;
    }
  }

  private clasificarErrorEureka(mensajeError: string): string {
    const mensaje = mensajeError.toLowerCase();

    if (mensaje.includes("timeout") || mensaje.includes("timed out")) {
      return "TIMEOUT";
    } else if (
      mensaje.includes("network") ||
      mensaje.includes("conexión") ||
      mensaje.includes("conexion")
    ) {
      return "CONEXION";
    } else if (
      mensaje.includes("401") ||
      mensaje.includes("authenticat") ||
      mensaje.includes("auth")
    ) {
      return "AUTENTICACION";
    } else if (mensaje.includes("404") || mensaje.includes("not found")) {
      return "ENDPOINT_NO_ENCONTRADO";
    } else if (mensaje.includes("500") || mensaje.includes("internal server")) {
      return "ERROR_SERVIDOR";
    } else if (
      mensaje.includes("invalid") ||
      mensaje.includes("inválido") ||
      mensaje.includes("invalido")
    ) {
      return "CUIL_INVALIDO";
    } else {
      return "DESCONOCIDO";
    }
  }

  private clasificarErrorNosis(mensajeError: string): string {
    const mensaje = mensajeError.toLowerCase();

    if (mensaje.includes("timeout") || mensaje.includes("timed out")) {
      return "TIMEOUT";
    } else if (
      mensaje.includes("network") ||
      mensaje.includes("conexión") ||
      mensaje.includes("conexion")
    ) {
      return "CONEXION";
    } else if (mensaje.includes("xml") || mensaje.includes("parse")) {
      return "RESPUESTA_INVALIDA";
    } else if (
      mensaje.includes("invalid") ||
      mensaje.includes("inválido") ||
      mensaje.includes("invalido")
    ) {
      return "CUIL_INVALIDO";
    } else {
      return "DESCONOCIDO";
    }
  }

  private actualizarDatosClienteConNosis(
    cliente: Cliente,
    nosisData: PersonalData
  ): void {
    if (nosisData.nombreCompleto?.nombre) {
      cliente.setNombreCompleto(nosisData.nombreCompleto.nombre);
    }
    if (nosisData.nombreCompleto?.apellido) {
      cliente.setApellido(nosisData.nombreCompleto.apellido);
    }
    if (nosisData.documentacion?.dni) {
      cliente.setDni(nosisData.documentacion.dni);
    }
    if (nosisData.documentacion?.cuil) {
      cliente.setCuil(nosisData.documentacion.cuil);
    }
    if (nosisData.documentacion?.fechaNacimiento) {
      cliente.setFechaNacimiento(
        new Date(nosisData.documentacion.fechaNacimiento)
      );
    }
    if (nosisData.documentacion?.sexo !== undefined) {
      cliente.setSexo(nosisData.documentacion.sexo);
    }
    if (nosisData.domicilio?.codigoPostal) {
      cliente.setCodigoPostal(nosisData.domicilio.codigoPostal);
    }
    if (nosisData.domicilio?.localidad) {
      cliente.setLocalidad(nosisData.domicilio.localidad);
    }
    if (nosisData.domicilio?.provincia) {
      cliente.setProvincia(nosisData.domicilio.provincia);
    }
    if (nosisData.domicilio?.numero) {
      cliente.setNumeroDomicilio(nosisData.domicilio.numero);
    }
    if (nosisData.documentacion?.nacionalidad) {
      cliente.setNacionalidad(nosisData.documentacion.nacionalidad);
    }
    if (nosisData.documentacion?.estadoCivil) {
      cliente.setEstadoCivil(nosisData.documentacion.estadoCivil);
    }

    if (nosisData.datosLaborales?.empleador) {
      cliente.setEmpleadorRazonSocial(
        nosisData.datosLaborales.empleador.razonSocial || null
      );
      cliente.setEmpleadorCuit(nosisData.datosLaborales.empleador.cuit || null);

      if (nosisData.datosLaborales.empleador.domicilio) {
        cliente.setEmpleadorDomicilio(
          `${nosisData.datosLaborales.empleador.domicilio.calle || ""} ${
            nosisData.datosLaborales.empleador.domicilio.numero || ""
          }`
        );
      }

      cliente.setEmpleadorTelefono(
        nosisData.datosLaborales.empleador.telefono || null
      );

      if (nosisData.datosLaborales.empleador.domicilio) {
        cliente.setEmpleadorCodigoPostal(
          nosisData.datosLaborales.empleador.domicilio.codigoPostal || null
        );
        cliente.setEmpleadorLocalidad(
          nosisData.datosLaborales.empleador.domicilio.localidad || null
        );
        cliente.setEmpleadorProvincia(
          nosisData.datosLaborales.empleador.domicilio.provincia || null
        );
      }

      if (nosisData.datosLaborales.empleador.rubro) {
        const descripcionCorta =
          this.rubrosLaboralesService.obtenerDescripcionCorta(
            nosisData.datosLaborales.empleador.rubro
          );
        cliente.setRubroEmpleador(
          descripcionCorta || nosisData.datosLaborales.empleador.rubro
        );
      }
    }
  }

  private async aplicarReglasAprobacionAutomatica(
    solicitud: SolicitudInicial,
    cliente: Cliente,
    resultadoNosis: VerificationResult,
    solicitudInicialId: number,
    comercianteId: number
  ): Promise<void> {
    if (resultadoNosis.status === "aprobado") {
      solicitud.setEstado("aprobada");
      await this.solicitudInicialRepository.updateSolicitudInicial(
        solicitud,
        cliente
      );

      solicitud.agregarComentario(
        crearComentarioComerciante("Solicitud aprobada automáticamente")
      );
      solicitud.agregarComentario(
        crearComentarioAnalista(
          this.generarComentariosAnalista(resultadoNosis, this.entidadesService)
        )
      );

      await this.historialRepository.registrarEvento({
        usuarioId: null,
        accion: HISTORIAL_ACTIONS.APPROVE_SOLICITUD_INICIAL,
        entidadAfectada: "solicitudes_iniciales",
        entidadId: solicitud.getId(),
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
          comentarioComerciante: this.generarComentariosComerciante(
            resultadoNosis,
            this.entidadesService
          ),
          comentarioAnalista: this.generarComentariosAnalista(
            resultadoNosis,
            this.entidadesService
          ),
        },
        solicitudInicialId,
      });
    } else if (resultadoNosis.status === "pendiente") {
      solicitud.setEstado("pendiente");
      solicitud.agregarComentario(
        crearComentarioComerciante(
          this.generarComentariosComerciante(
            resultadoNosis,
            this.entidadesService
          )
        )
      );
      solicitud.agregarComentario(
        crearComentarioAnalista(
          this.generarComentariosAnalista(resultadoNosis, this.entidadesService)
        )
      );

      await this.solicitudInicialRepository.updateSolicitudInicial(
        solicitud,
        cliente
      );

      await this.historialRepository.registrarEvento({
        usuarioId: null,
        accion: HISTORIAL_ACTIONS.PENDING_SOLICITUD_INICIAL,
        entidadAfectada: "solicitudes_iniciales",
        entidadId: solicitud.getId(),
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
          comentarioComerciante: this.generarComentariosComerciante(
            resultadoNosis,
            this.entidadesService
          ),
          comentarioAnalista: this.generarComentariosAnalista(
            resultadoNosis,
            this.entidadesService
          ),
        },
        solicitudInicialId,
      });
    } else if (resultadoNosis.status === "rechazado") {
      solicitud.setEstado("rechazada");
      solicitud.agregarComentario(
        crearComentarioComerciante(
          this.generarComentariosComerciante(
            resultadoNosis,
            this.entidadesService
          )
        )
      );
      solicitud.agregarComentario(
        crearComentarioAnalista(
          this.generarComentariosAnalista(resultadoNosis, this.entidadesService)
        )
      );

      await this.solicitudInicialRepository.updateSolicitudInicial(
        solicitud,
        cliente
      );

      await this.historialRepository.registrarEvento({
        usuarioId: null,
        accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
        entidadAfectada: "solicitudes_iniciales",
        entidadId: solicitud.getId(),
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
          comentarioComerciante: this.generarComentariosComerciante(
            resultadoNosis,
            this.entidadesService
          ),
          comentarioAnalista: this.generarComentariosAnalista(
            resultadoNosis,
            this.entidadesService
          ),
        },
        solicitudInicialId,
      });
    } else {
      solicitud.setEstado("pendiente");
      await this.solicitudInicialRepository.updateSolicitudInicial(
        solicitud,
        cliente
      );
      await this.notificarAnalistas(solicitud, cliente);
    }
  }

  private generarComentariosAnalista(
    resultadoNosis: VerificationResult,
    entidadesService: EntidadesService
  ): string {
    let comentario = "📊 INFORME DETALLADO DE VERIFICACIÓN\n\n";

    // 1. Información de Eureka
    if (resultadoNosis.eurekaMensajeAnalista) {
      comentario += "1. SISTEMA ANTERIOR (EUREKA):\n";
      comentario += `   ${resultadoNosis.eurekaMensajeAnalista}\n\n`;
    }

    // 2. Resultado general de Nosis
    comentario += "2. RESULTADO VERIFICACIÓN NOSIS:\n";
    comentario += `   • Estado: ${resultadoNosis.status.toUpperCase()}\n`;
    if (resultadoNosis.score) {
      comentario += `   • Score: ${resultadoNosis.score}\n`;
    }
    comentario += "\n";

    // 3. Criterios aprobados
    if (resultadoNosis.aprobados && resultadoNosis.aprobados.length > 0) {
      comentario += "3. ✅ CRITERIOS APROBADOS:\n";
      resultadoNosis.aprobados.forEach((aprobado, index) => {
        comentario += `   ${index + 1}. ${aprobado}\n`;
      });
      comentario += "\n";
    }

    // 4. Motivos de rechazo
    if (
      resultadoNosis.reglasFallidas &&
      resultadoNosis.reglasFallidas.length > 0
    ) {
      comentario += "4. ❌ MOTIVOS DE RECHAZO:\n";
      resultadoNosis.reglasFallidas.forEach((rechazo, index) => {
        comentario += `   ${index + 1}. ${rechazo}\n`;
      });
      comentario += "\n";
    }

    // 5. Pendientes de revisión
    if (resultadoNosis.pendientes && resultadoNosis.pendientes.length > 0) {
      comentario += "5. ⚠️ PENDIENTES DE REVISIÓN:\n";
      resultadoNosis.pendientes.forEach((pendiente, index) => {
        comentario += `   ${index + 1}. ${pendiente}\n`;
      });
      comentario += "\n";
    }

    // 6. Entidades en situación 2
    if (
      resultadoNosis.entidadesSituacion2 &&
      resultadoNosis.entidadesSituacion2.length > 0
    ) {
      const nombresEntidades = entidadesService.obtenerNombresEntidades(
        resultadoNosis.entidadesSituacion2
      );
      comentario += "6. 🟡 ENTIDADES EN SITUACIÓN 2 (ALERTA):\n";
      nombresEntidades.forEach((entidad, index) => {
        comentario += `   ${index + 1}. ${entidad}\n`;
      });
      comentario += `   • Total: ${resultadoNosis.entidadesSituacion2.length} entidades\n\n`;
    }

    // 7. Entidades con deuda grave (3-4-5)
    if (
      resultadoNosis.entidadesDeuda &&
      resultadoNosis.entidadesDeuda.length > 0
    ) {
      const nombresEntidades = entidadesService.obtenerNombresEntidades(
        resultadoNosis.entidadesDeuda
      );
      comentario += "7. 🔴 ENTIDADES CON DEUDA GRAVE (SIT 3-4-5):\n";
      nombresEntidades.forEach((entidad, index) => {
        comentario += `   ${index + 1}. ${entidad}\n`;
      });
      comentario += `   • Total: ${resultadoNosis.entidadesDeuda.length} entidades\n\n`;
    }

    // 8. Referencias comerciales
    if (resultadoNosis.referenciasComerciales) {
      const ref = resultadoNosis.referenciasComerciales;
      comentario += "8. 📋 REFERENCIAS COMERCIALES:\n";
      comentario += `   • Válidas: ${ref.totalValidas}\n`;
      if (ref.referenciasValidas.length > 0) {
        comentario += "   • Detalle referencias válidas:\n";
        ref.referenciasValidas.forEach((referencia, index) => {
          comentario += `     ${index + 1}. ${referencia}\n`;
        });
      }
      if (ref.referenciasInvalidas.length > 0) {
        comentario += `   • No válidas: ${ref.totalInvalidas}\n`;
        comentario += "   • Referencias excluidas (telefonía):\n";
        ref.referenciasInvalidas.forEach((referencia, index) => {
          comentario += `     ${index + 1}. ${referencia}\n`;
        });
      }
      comentario += "\n";
    }

    // 9. Resumen ejecutivo
    comentario += "9. 📈 RESUMEN EJECUTIVO:\n";
    const totalProblemas =
      (resultadoNosis.reglasFallidas?.length || 0) +
      (resultadoNosis.pendientes?.length || 0);

    if (totalProblemas === 0) {
      comentario +=
        "   • Cliente cumple con todos los criterios de aprobación\n";
      comentario += "   • Sin observaciones críticas\n";
    } else {
      comentario += `   • Total de observaciones: ${totalProblemas}\n`;
      comentario += `   • Motivos rechazo: ${
        resultadoNosis.reglasFallidas?.length || 0
      }\n`;
      comentario += `   • Pendientes revisión: ${
        resultadoNosis.pendientes?.length || 0
      }\n`;
    }

    return comentario;
  }

 private generarComentariosComerciante(
    resultadoNosis: VerificationResult,
    entidadesService: EntidadesService
): string {

  
    // Mensajes específicos para combinaciones (alta prioridad)
    if (resultadoNosis.reglasFallidas) {
        for (const regla of resultadoNosis.reglasFallidas) {
            if (
                regla.includes("Combinación rechazada") ||
                (regla.includes("1 referencia comercial +") &&
                    regla.includes("deudas = RECHAZADO"))
            ) {
                return this.formatearMensajeComerciante("RECHAZADO", [regla]);
            }
        }
    }

    // 1. RECHAZOS de Nosis (prioridad alta)
    if (
        resultadoNosis.reglasFallidas &&
        resultadoNosis.reglasFallidas.length > 0
    ) {
        const motivosRechazo: string[] = [];

        // 🔥 AGREGAR DEUDAS DETECTADAS PRIMERO
    if (resultadoNosis.entidadesDeuda && resultadoNosis.entidadesDeuda.length > 0) {
        const nombresEntidades = entidadesService.obtenerNombresEntidades(resultadoNosis.entidadesDeuda);
        nombresEntidades.forEach(nombre => {
            motivosRechazo.push(`deuda activa con ${nombre} - situación 5 (incumplimiento grave)`);
        });
    }

        resultadoNosis.reglasFallidas.forEach((regla) => {
            if (regla.includes("entidades en situación 2")) {
                const match = regla.match(/(\d+) entidades/);
                const cantidad = match ? match[1] : "varias";
                // OBTENER NOMBRES DE ENTIDADES PARA SITUACIÓN 2
                const nombresEntidades = resultadoNosis.entidadesSituacion2 && resultadoNosis.entidadesSituacion2.length > 0
                    ? entidadesService.obtenerNombresEntidades(resultadoNosis.entidadesSituacion2).join(", ")
                    : "entidades varias";
                motivosRechazo.push(
                    `${cantidad} alertas crediticias en entidades bancarias: ${nombresEntidades}`
                );
            } else if (regla.includes("entidades con deuda")) {
              /*
                const match = regla.match(/(\d+) entidades/);
                const cantidad = match ? match[1] : "varias";
                // OBTENER NOMBRES DE ENTIDADES PARA DEUDAS
                const nombresEntidades = resultadoNosis.entidadesDeuda && resultadoNosis.entidadesDeuda.length > 0
                    ? entidadesService.obtenerNombresEntidades(resultadoNosis.entidadesDeuda).join(", ")
                    : "entidades varias";
                motivosRechazo.push(
                    `deudas activas con ${cantidad} entidades: ${nombresEntidades}`
                );
                */
               return; // Ya se agregaron arriba
            } else if (regla.includes("referencias comerciales")) {
                const match = regla.match(/(\d+) referencias comerciales válidas/);
                if (match) {
                    // MOSTRAR TODAS LAS REFERENCIAS COMERCIALES VÁLIDAS
                    const referenciasValidas = resultadoNosis.referenciasComerciales?.referenciasValidas || [];
                    const referenciasLista = referenciasValidas.length > 0 
                        ? referenciasValidas.join(", ")
                        : "no especificadas";
                    motivosRechazo.push(
                        `${match[1]} referencias comerciales (máximo permitido: 2): ${referenciasLista}`
                    );
                } else {
                    motivosRechazo.push(
                        "no cumple con criterios de referencias comerciales"
                    );
                }
            } else if (regla.includes("tarjeta Crediguía")) {
                motivosRechazo.push("tarjeta Crediguía activa");
            } else if (regla.includes("aporte")) {
                
                    //motivosRechazo.push("no cumple con el mínimo de aportes requerido");
                
            } else if (regla.includes("jubilado")) {
                motivosRechazo.push("cliente jubilado");
            } else if (regla.includes("monotributista")) {
                motivosRechazo.push("monotributista sin empleo registrado");
            } else if (regla.includes("situación laboral")) {
                motivosRechazo.push("sin situación laboral registrada");
            } else {
                // Extraer solo la parte principal del mensaje
                const partePrincipal = regla.split(":")[0] || regla;
                motivosRechazo.push(partePrincipal.toLowerCase());
            }
        });

        // ✅ Si hay referencias pendientes, agregarlas al mensaje de rechazo
        if (resultadoNosis.pendientes && resultadoNosis.pendientes.length > 0) {
            const referenciasPendientes = resultadoNosis.pendientes.filter(p => 
                p.includes('referencias comerciales') || p.includes('referencia comercial')
            );
            
            if (referenciasPendientes.length > 0) {
                // Extraer las referencias válidas para mostrarlas específicamente
                const referenciasValidas = resultadoNosis.referenciasComerciales?.referenciasValidas || [];
                if (referenciasValidas.length > 0) {
                    motivosRechazo.push(`tiene referencia comercial pendiente de validación: ${referenciasValidas.join(", ")} - solicitar libre de deuda`);
                }
            }
        }

        return this.formatearMensajeComerciante("RECHAZADO", motivosRechazo);
    }

    // 2. PENDIENTES de Nosis (prioridad media)
    if (resultadoNosis.pendientes && resultadoNosis.pendientes.length > 0) {
        const motivosPendientes: string[] = [];

        resultadoNosis.pendientes.forEach((pendiente) => {
            if (pendiente.includes("entidades en situación 2")) {
                // OBTENER NOMBRES DE ENTIDADES PARA SITUACIÓN 2
                const nombresEntidades = resultadoNosis.entidadesSituacion2 && resultadoNosis.entidadesSituacion2.length > 0
                    ? entidadesService.obtenerNombresEntidades(resultadoNosis.entidadesSituacion2).join(", ")
                    : "entidades varias";
                motivosPendientes.push(`1 alerta crediticia en entidad bancaria: ${nombresEntidades}`);
            } else if (pendiente.includes("entidades con deuda")) {
                const match = pendiente.match(/(\d+) entidades/);
                const cantidad = match ? match[1] : "algunas";
                // OBTENER NOMBRES DE ENTIDADES PARA DEUDAS
                const nombresEntidades = resultadoNosis.entidadesDeuda && resultadoNosis.entidadesDeuda.length > 0
                    ? entidadesService.obtenerNombresEntidades(resultadoNosis.entidadesDeuda).join(", ")
                    : "entidades varias";
                motivosPendientes.push(`deudas con ${cantidad} entidades: ${nombresEntidades}`);
            } else if (pendiente.includes("referencias comerciales") || pendiente.includes("referencia comercial válida")) {
                const referenciasValidas = resultadoNosis.referenciasComerciales?.referenciasValidas || [];
                const referenciasLista = referenciasValidas.length > 0 
                    ? referenciasValidas.join(", ")
                    : "no especificadas";
                
                if (referenciasValidas.length === 1) {
                    motivosPendientes.push(`tiene 1 referencia comercial a validar: ${referenciasLista} - solicitar libre de deuda`);
                } else if (referenciasValidas.length === 2) {
                    motivosPendientes.push(`tiene 2 referencias comerciales a validar: ${referenciasLista} - solicitar libres de deuda`);
                } else {
                    motivosPendientes.push(`referencias comerciales a validar: ${referenciasLista}`);
                }
            } else {
                motivosPendientes.push(pendiente.toLowerCase());
            }
        });

        return this.formatearMensajeComerciante("PENDIENTE", motivosPendientes);
    }

    // 3. Información de Eureka (prioridad baja)
    if (resultadoNosis.eurekaMensajeComerciante) {
        return this.formatearMensajeComerciante("INFORMACIÓN SISTEMA ANTERIOR", [
            resultadoNosis.eurekaMensajeComerciante,
        ]);
    }

    // 4. Estado aprobado
    if (resultadoNosis.status === "aprobado") {
        return this.formatearMensajeComerciante("APROBADO", [
            "Solicitud aprobada automáticamente",
        ]);
    }

    return this.formatearMensajeComerciante("EN PROCESO", [
        "Solicitud en proceso de evaluación",
    ]);
}

  /**
   * Formatea el mensaje para el comerciante con estructura clara y numerada
   */
private formatearMensajeComerciante(
    estado: string,
    motivos: string[]
): string {
    let mensaje = "";

    switch (estado) {
        case "RECHAZADO":
            mensaje = "❌ SOLICITUD RECHAZADA\n\n";
            mensaje += "Motivos principales (información para solicitar libres de deuda):\n";
            motivos.forEach((motivo, index) => {
                mensaje += `${index + 1}. ${motivo}\n`;
            });
            break;

        case "PENDIENTE":
            mensaje = "⚠️ SOLICITUD PENDIENTE DE REVISIÓN\n\n";
            mensaje += "Se requiere validación manual (información para solicitar libres de deuda):\n";
            motivos.forEach((motivo, index) => {
                // Destacar referencias comerciales
                if (motivo.includes("referencias comerciales")) {
                    mensaje += `⭐ ${index + 1}. ${motivo} ⭐\n`;
                } else {
                    mensaje += `${index + 1}. ${motivo}\n`;
                }
            });
            break;

        case "APROBADO":
            mensaje = "✅ SOLICITUD APROBADA\n\n";
            mensaje += motivos.join("\n");
            break;

        case "INFORMACIÓN SISTEMA ANTERIOR":
            mensaje = "📋 INFORMACIÓN DEL SISTEMA ANTERIOR\n\n";
            mensaje += motivos.join("\n");
            break;

        default:
            mensaje = "🔄 SOLICITUD EN PROCESO\n\n";
            mensaje += motivos.join("\n");
    }

    return mensaje;
}

  private async tieneCreditoActivo(cuilCliente: string): Promise<boolean> {
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
      const solicitudesCliente =
        await this.solicitudInicialRepository.getSolicitudesInicialesByCuil(
          cuilCliente
        );
      console.log(
        `📊 Encontradas ${solicitudesCliente.length} solicitudes para el cliente`
      );

      if (solicitudesCliente.length === 0) {
        return {
          tieneSolicitudOtroComercio: false,
          tieneSolicitudMismoComercio: false,
        };
      }

      const solicitudesBloqueantes = await this.filtrarSolicitudesBloqueantes(
        solicitudesCliente,
        comercianteIdActual
      );
      console.log(
        `📊 Solicitudes bloqueantes totales: ${solicitudesBloqueantes.length}`
      );

      if (solicitudesBloqueantes.length === 0) {
        return {
          tieneSolicitudOtroComercio: false,
          tieneSolicitudMismoComercio: false,
        };
      }

      const solicitudesMismoComercio = solicitudesBloqueantes.filter(
        (solicitud) => solicitud.getComercianteId() === comercianteIdActual
      );

      const solicitudesOtroComercio = solicitudesBloqueantes.filter(
        (solicitud) => solicitud.getComercianteId() !== comercianteIdActual
      );

      console.log(
        `📊 Solicitudes bloqueantes mismo comercio: ${solicitudesMismoComercio.length}`
      );
      console.log(
        `📊 Solicitudes bloqueantes otro comercio: ${solicitudesOtroComercio.length}`
      );

      if (solicitudesOtroComercio.length > 0) {
        const solicitudOriginal = solicitudesOtroComercio[0];
        const comercianteOriginalId = solicitudOriginal.getComercianteId();
        let nombreComercioOriginal = "Comercio no disponible";

        if (comercianteOriginalId) {
          try {
            const comercianteOriginal =
              await this.comercianteRepository.findById(comercianteOriginalId);
            nombreComercioOriginal = comercianteOriginal.getNombreComercio();
            console.log(`🏪 Comercio original: ${nombreComercioOriginal}`);
          } catch (error) {
            console.error(
              "Error obteniendo datos del comerciante original:",
              error
            );
          }
        }

        return {
          tieneSolicitudOtroComercio: true,
          tieneSolicitudMismoComercio: false,
          comercianteOriginal: comercianteOriginalId,
          nombreComercioOriginal,
        };
      }

      if (solicitudesMismoComercio.length > 0) {
        return {
          tieneSolicitudOtroComercio: false,
          tieneSolicitudMismoComercio: true,
        };
      }

      return {
        tieneSolicitudOtroComercio: false,
        tieneSolicitudMismoComercio: false,
      };
    } catch (error) {
      console.error(
        "❌ Error en verificación de solicitudes existentes:",
        error
      );
      return {
        tieneSolicitudOtroComercio: false,
        tieneSolicitudMismoComercio: false,
      };
    }
  }

  private async filtrarSolicitudesBloqueantes(
    solicitudesCliente: SolicitudInicial[],
    comercianteIdActual: number
  ): Promise<SolicitudInicial[]> {
    const solicitudesBloqueantes: SolicitudInicial[] = [];

    for (const solicitud of solicitudesCliente) {
      const solicitudComercianteId = solicitud.getComercianteId();
      const esMismoComerciante = solicitudComercianteId === comercianteIdActual;
      const estado = solicitud.getEstado();

      console.log(
        `📋 Analizando Solicitud ID: ${solicitud.getId()}, Estado: ${estado}, Comerciante: ${solicitudComercianteId}`
      );

      let esBloqueante = false;

      if (esMismoComerciante) {
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
        switch (estado) {
          case "pendiente":
            esBloqueante = true;
            console.log(
              `   🚫 BLOQUEANTE (otro comercio): Solicitud pendiente en evaluación`
            );
            break;
          case "rechazada":
            esBloqueante = true;
            console.log(
              `   🚫 BLOQUEANTE (otro comercio): Solicitud rechazada`
            );
            break;
          case "aprobada":
            const tieneComprasActivas = await this.tieneComprasActivas(
              solicitud
            );
            esBloqueante = tieneComprasActivas;
            console.log(
              `   ${
                tieneComprasActivas ? "🚫 BLOQUEANTE" : "✅ PERMITIDA"
              } (otro comercio): Solicitud aprobada ${
                tieneComprasActivas ? "CON" : "SIN"
              } compras activas`
            );
            break;
          case "expirada":
            esBloqueante = false;
            console.log(`   ✅ PERMITIDA (otro comercio): Solicitud expirada`);
            break;
          default:
            esBloqueante = false;
        }
      }

      if (esBloqueante) {
        solicitudesBloqueantes.push(solicitud);
      }
    }

    return solicitudesBloqueantes;
  }

  private async tieneComprasActivas(
    solicitudInicial: SolicitudInicial
  ): Promise<boolean> {
    try {
      const solicitudFormal =
        await this.solicitudFormalRepository.getSolicitudFormalBySolicitudInicialId(
          solicitudInicial.getId()
        );

      if (!solicitudFormal) {
        console.log(`   📦 No hay solicitud formal asociada`);
        return false;
      }

      const compras = await this.compraRepository.getComprasBySolicitudFormalId(
        solicitudFormal.getId()
      );
      const tieneComprasActivas = compras.some(
        (compra: { getEstado: () => string }) =>
          compra.getEstado().toLowerCase() !== "rechazada"
      );

      console.log(
        `   📦 Compras encontradas: ${compras.length}, Activas: ${tieneComprasActivas}`
      );
      return tieneComprasActivas;
    } catch (error) {
      console.error(`   ❌ Error verificando compras:`, error);
      return false;
    }
  }
}
