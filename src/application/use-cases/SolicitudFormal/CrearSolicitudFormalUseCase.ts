// src/application/use-cases/SolicitudFormal/CrearSolicitudFormalUseCase.ts
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

export class CrearSolicitudFormalUseCase {
    constructor(
        private readonly solicitudInicialRepo: SolicitudInicialRepositoryPort,
        private readonly solicitudFormalRepo: SolicitudFormalRepositoryPort,
        private readonly permisoRepo: PermisoRepositoryPort,
        private readonly notificationService: NotificationPort,
        private readonly analistaRepo: AnalistaRepositoryPort,
        private readonly contratoRepository: ContratoRepositoryPort,
        private readonly clienteRepository: ClienteRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort
    ) {}

    async execute(
        solicitudInicialId: number,
        comercianteId: number,
        datosSolicitud: {
            nombreCompleto: string;
            apellido: string;
            dni: string;
            telefono: string;
            email: string;
            recibo: Buffer;
            aceptaTarjeta: boolean;
            fechaNacimiento: Date;
            domicilio: string;
            datosEmpleador: string;
            referentes: any[];
        },
        comentarioInicial: string = "Solicitud creada por comerciante"
    ): Promise<SolicitudFormal> {
        try {
            // Verificar crédito activo
            const tieneCredito = await this.tieneCreditoActivo(datosSolicitud.dni);
            if (tieneCredito) {
                // Registrar evento de rechazo por crédito activo
                await this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_FORMAL,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: 0,
                    detalles: {
                        motivo: "Cliente con crédito activo",
                        dni_cliente: datosSolicitud.dni,
                        
                    },
                    solicitudInicialId: solicitudInicialId
                });
                
                throw new Error("El cliente ya tiene un crédito activo");
            }
            // 1. Verificar permisos del comerciante
            const tienePermiso = await this.permisoRepo.usuarioTienePermiso(
                comercianteId, 
                "create_solicitudFormal" // Permiso necesario
            );
            
            if (!tienePermiso) {
                // Registrar evento de falta de permisos
                await this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: 0,
                    detalles: {
                        motivo: "Falta de permisos",
                        permiso_requerido: "create_solicitudFormal"
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("No tiene permisos para enviar solicitudes formales");
            }

            // 2. Obtener solicitud inicial
            const solicitudInicial = await this.solicitudInicialRepo.getSolicitudInicialById(solicitudInicialId);
            if (!solicitudInicial) {
                // Registrar evento de solicitud inicial no encontrada
                await this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: 0,
                    detalles: {
                        error: "Solicitud inicial no encontrada",
                        solicitud_inicial_id: solicitudInicialId
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("Solicitud inicial no encontrada");
            }

            // 3. Verificar estado de la solicitud inicial
            if (solicitudInicial.getEstado() !== "aprobada") {
                // Registrar evento de estado no aprobado
                await this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: 0,
                    detalles: {
                        error: "Solicitud inicial no aprobada",
                        estado_actual: solicitudInicial.getEstado(),
                        solicitud_inicial_id: solicitudInicialId
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("La solicitud inicial no está aprobada");
            }

            // 4. Verificar que no exista ya una solicitud formal para esta inicial
            const existentes = await this.solicitudFormalRepo.getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId);
            if (existentes.length > 0) {
                // Registrar evento de solicitud duplicada
                await this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: 0,
                    detalles: {
                        error: "Solicitud formal ya existe",
                        solicitud_inicial_id: solicitudInicialId,
                        solicitud_formal_id: existentes[0].getId()
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("Ya existe una solicitud formal para esta solicitud inicial");
            }

            const signature = datosSolicitud.recibo.subarray(0, 3);
            if (!(signature[0] === 0xFF && signature[1] === 0xD8 && signature[2] === 0xFF)) {
                // Registrar evento de recibo inválido
                await this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: 0,
                    detalles: {
                        error: "Recibo no es JPG válido"
                    },
                    solicitudInicialId: solicitudInicialId
                });
            throw new Error('El recibo no es una imagen JPG válida');
            }

            if (typeof datosSolicitud.recibo === 'string') {
            const buffer = Buffer.from(datosSolicitud.recibo, 'base64');
            const fileType = await import('file-type');
            const type = await fileType.fileTypeFromBuffer(buffer);
            
            if (!type || !type.mime.startsWith('image/')) {
                // Registrar evento de tipo inválido
                    await this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: {
                            error: "Recibo no es una imagen"
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                throw new Error('El recibo debe ser una imagen válida');
            }
            
            if (type.mime !== 'image/jpeg') {
                // Registrar evento de formato incorrecto
                    await this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'solicitudes_formales',
                        entidadId: 0,
                        detalles: {
                            error: "Recibo no es JPG"
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                throw new Error('Solo se aceptan imágenes en formato JPG');
            }
            
            datosSolicitud.recibo = buffer;
            }

            // 5. Crear la solicitud formal con comentario inicial
            const solicitudFormal = new SolicitudFormal(
                0, // ID se asignará automáticamente
                solicitudInicialId,
                comercianteId,
                datosSolicitud.nombreCompleto,
                datosSolicitud.apellido,
                datosSolicitud.dni,
                datosSolicitud.telefono,
                datosSolicitud.email,
                new Date(),
                typeof datosSolicitud.recibo === "string"
                    ? Buffer.from(datosSolicitud.recibo, "base64")
                    : datosSolicitud.recibo,
                "pendiente",
                datosSolicitud.aceptaTarjeta,
                datosSolicitud.fechaNacimiento,
                datosSolicitud.domicilio,
                datosSolicitud.datosEmpleador,
                datosSolicitud.referentes,
                [comentarioInicial]
            );
            (solicitudFormal as any).solicitudInicialId = solicitudInicialId;
            (solicitudFormal as any).comercianteId = comercianteId;
            
            // 6. Vincular con solicitud inicial (propiedad adicional necesaria)
            (solicitudFormal as any).solicitudInicialId = solicitudInicialId;
            // 7. Guardar en la base de datos
            const solicitudCreada = await this.solicitudFormalRepo.createSolicitudFormal(solicitudFormal);
             // Registrar evento de creación de solicitud formal
            await this.historialRepository.registrarEvento({
                usuarioId: comercianteId,
                accion: HISTORIAL_ACTIONS.CREATE_SOLICITUD_FORMAL,
                entidadAfectada: 'solicitudes_formales',
                entidadId: solicitudCreada.getId(),
                detalles: {
                    solicitud_inicial_id: solicitudInicialId,
                    estado: "pendiente",
                    cliente: `${datosSolicitud.nombreCompleto} ${datosSolicitud.apellido}`
                },
                solicitudInicialId: solicitudInicialId
            });
            // 8. Notificar al cliente
            await this.notificationService.emitNotification({
                userId: solicitudCreada.getComercianteId(),
                type: "solicitud_formal",
                message: "Solicitud formal creada exitosamente"
            });
            // 9. Notificar a los analistas
            await this.notificarAnalistas(solicitudCreada);

            return solicitudCreada;
        } catch (error) {
            // Notificar error al comerciante
            let errorMessage = "Error desconocido";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            await this.notificationService.emitNotification({
                userId: Number(comercianteId),
                type: "error",
                message: `Error al crear solicitud formal: ${errorMessage}`
            });

            // Registrar evento de error
            await this.historialRepository.registrarEvento({
                usuarioId: comercianteId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'solicitudes_formales',
                entidadId: 0,
                detalles: {
                    error: error instanceof Error ? error.message : String(error),
                    etapa: "creacion_solicitud_formal",
                    solicitud_inicial_id: solicitudInicialId
                },
                solicitudInicialId: solicitudInicialId
            });
            
            throw error;
        }
    }

private async notificarAnalistas(solicitud: SolicitudFormal): Promise<void> {
        try {
            // 1. Obtener todos los IDs de analistas usando el repositorio
            const analistaIds = await this.analistaRepo.obtenerIdsAnalistasActivos();
            // 2. Enviar notificación individual a cada analista
            const notificaciones = analistaIds.map(analistaId => 
                this.notificationService.emitNotification({
                    userId: analistaId,
                    type: "solicitud_formal",
                    message: "Nueva solicitud formal requiere revisión",
                    metadata: {
                        solicitudId: solicitud.getId(),
                        cliente: `${solicitud.getNombreCompleto()} ${solicitud.getApellido()}`,
                        comercianteId: solicitud.getComercianteId(),
                        prioridad: "alta"
                    }
                })
            );
            
            await Promise.all(notificaciones);
        } catch (error) {
            console.error("Error notificando a analistas:", error);

            // Registrar evento de error en notificación
            await this.historialRepository.registrarEvento({
                usuarioId: solicitud.getComercianteId(),
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'solicitudes_formales',
                entidadId: solicitud.getId(),
                detalles: {
                    error: "Error notificando a analistas",
                    etapa: "notificacion_analistas"
                },
                solicitudInicialId: solicitud.getSolicitudInicialId()
            });
            // Opcional: Notificar a administradores sobre fallo
        }
    }

    private async tieneCreditoActivo(dniCliente: string): Promise<boolean> {
        // Obtener todas las solicitudes formales del cliente por DNI
        //const solicitudesFormales = await this.solicitudFormalRepo.getSolicitudesFormalesByDni(dniCliente);
        const cliente = await this.clienteRepository.findByDni(dniCliente);
        //verificar si el cliente tiene un contrato generado
        const contrato = await this.contratoRepository.getContratoById(cliente.getId().toString());
        // Verificar cada solicitud formal para ver si tiene un contrato activo asociado
        if (contrato) {
            const tieneContratoActivo = contrato.getEstado() === "generado";
            
            if (tieneContratoActivo) {
                return true;
            }
        }
        
        return false;
    }
}
