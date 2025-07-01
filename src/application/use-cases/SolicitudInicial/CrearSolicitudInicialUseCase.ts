// src/application/use-cases/SolicitudInicial/CrearSolicitudInicialUseCase.ts
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { ContratoRepositoryPort } from "../../ports/ContratoRepositoryPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { VerazPort } from "../../ports/VerazPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { Cliente } from "../../../domain/entities/Cliente";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";

export class CrearSolicitudInicialUseCase {
    constructor(
        private readonly solicitudInicialRepository: SolicitudInicialRepositoryPort,
        private readonly contratoRepository: ContratoRepositoryPort,
        private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
        private readonly verazService: VerazPort,
        private readonly notificationService: NotificationPort,
        private readonly clienteRepository: ClienteRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort
    ) {}

    async execute(
        dniCliente: string,
        cuilCliente: string,
        comercianteId: number,
        reciboSueldo?: Buffer
    ): Promise<SolicitudInicial> {
        try {
            let cliente: Cliente;
            try {
                cliente = await this.clienteRepository.findByDni(dniCliente);
            } catch {
                // Crear con datos mínimos si no existe
                cliente = new Cliente(
                0, 
                'Nombre temporal', 
                'Apellido temporal',
                dniCliente,
                cuilCliente
                );
                await this.clienteRepository.save(cliente);
            }
            // 1. Verificar si el cliente tiene crédito activo
            const tieneCreditoActivo = await this.tieneCreditoActivo(dniCliente);
            if (tieneCreditoActivo) {
                // Notificar al comerciante que no puede crear solicitud
                await this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "solicitud_inicial",
                    message: `El cliente con DNI ${dniCliente} ya tiene un crédito activo`
                });

                // Registrar evento de rechazo
                await this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
                    entidadAfectada: 'solicitudes_iniciales',
                    entidadId: 0, // No hay entidad aún
                    detalles: {
                        motivo: "Cliente con crédito activo",
                        dni_cliente: dniCliente
                    },
                    solicitudInicialId: undefined // No hay solicitud aún
                });

                throw new Error("El cliente ya tiene un crédito activo");
            }

            // Crear solicitud vinculada al cliente
            const solicitud = new SolicitudInicial(
                0,
                new Date(),
                "pendiente",
                dniCliente,
                cliente.getId(),
                cuilCliente,
                reciboSueldo,
                comercianteId
            );

            // 3. Guardar solicitud inicial
            const solicitudCreada = await this.solicitudInicialRepository.createSolicitudInicial(solicitud);

            const solicitudInicialId = solicitudCreada.getId();
            console.log(`Solicitud inicial creada con ID: ${solicitudCreada.getId()}`);

            // Registrar evento de creación
            await this.historialRepository.registrarEvento({
                usuarioId: comercianteId,
                accion: HISTORIAL_ACTIONS.CREATE_SOLICITUD_INICIAL,
                entidadAfectada: 'solicitudes_iniciales',
                entidadId: solicitudCreada.getId(),
                detalles: {
                    dni_cliente: dniCliente,
                    comerciante_id: comercianteId,
                    estado: "pendiente"
                },
                    solicitudInicialId: solicitudInicialId
            });


            // 4. Consultar Veraz
            const estadoVeraz = await this.verazService.checkClienteStatus(dniCliente);
            console.log(`Estado Veraz para DNI ${dniCliente}:`, estadoVeraz);
            // 5. Actualizar estado según Veraz
            if (estadoVeraz.status === "aprobado") {
                solicitudCreada.setEstado("aprobada");
                await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
                // Registrar evento de aprobación automática
                await this.historialRepository.registrarEvento({
                    usuarioId: null, // Sistema automático
                    accion: HISTORIAL_ACTIONS.APPROVE_SOLICITUD_INICIAL,
                    entidadAfectada: 'solicitudes_iniciales',
                    entidadId: solicitudCreada.getId(),
                    detalles: {
                        sistema: "Veraz",
                        score: estadoVeraz.score,
                        motivo: estadoVeraz.motivo || "Aprobación automática"
                    },
                    solicitudInicialId: solicitudInicialId
                });
            } else if(estadoVeraz.status === "rechazado"){
                solicitudCreada.setEstado("rechazada");
                await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
                // Registrar evento de rechazo automático
                await this.historialRepository.registrarEvento({
                    usuarioId: null, // Sistema automático
                    accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
                    entidadAfectada: 'solicitudes_iniciales',
                    entidadId: solicitudCreada.getId(),
                    detalles: {
                        sistema: "Veraz",
                        score: estadoVeraz.score,
                        motivo: estadoVeraz.motivo || "Rechazo automático"
                    },
                    solicitudInicialId: solicitudInicialId
                });
                //throw new Error("Cliente no apto para crédito según Veraz");
            } else {
                solicitudCreada.setEstado("pendiente");
                await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
            }

            // 6. Notificar al cliente (simulado)
            console.log(`Notificación enviada al cliente DNI:${dniCliente} sobre su solicitud`);

            await this.notificationService.emitNotification({
                userId: Number(comercianteId),
                type: "solicitud_inicial",
                message: "Solicitud inicial creada exitosamente"
            });

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
                message: `Error al crear solicitud: ${errorMessage}`
            });

            // Registrar evento de error
            await this.historialRepository.registrarEvento({
                usuarioId: comercianteId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'solicitudes_iniciales',
                entidadId: 0, // No hay entidad aún
                detalles: {
                    error: error instanceof Error ? error.message : String(error),
                    etapa: "creacion_solicitud_inicial",
                    dni_cliente: dniCliente
                },
                    solicitudInicialId: undefined // No hay solicitud por error
            });
            
            throw error;
        }
    }

    private async tieneCreditoActivo(dniCliente: string): Promise<boolean> {
        // Obtener todas las solicitudes formales del cliente por DNI
        const solicitudesFormales = await this.solicitudFormalRepository.getSolicitudesFormalesByDni(dniCliente);
        console.log(`Solicitudes formales encontradas para DNI ${dniCliente}:`, solicitudesFormales.length);
        // Verificar cada solicitud formal para ver si tiene un contrato activo asociado
        for (const solicitud of solicitudesFormales) {
            const contratos = await this.contratoRepository.getContratosBySolicitudFormalId(solicitud.getId());
            console.log(`Contratos encontrados para solicitud formal ID ${solicitud.getId()}:`, contratos.length);
            // Verificar si hay al menos un contrato activo para esta solicitud
            const tieneContratoActivo = contratos.some(contrato => {
                const estado = contrato.getEstado().toLowerCase();
                console.log(`Estado del contrato ID ${contrato.getId()}: ${estado}`);
                return estado === "generado";
            });
            
            if (tieneContratoActivo) {
                return true;
            }
        }
        
        return false;
    }
}