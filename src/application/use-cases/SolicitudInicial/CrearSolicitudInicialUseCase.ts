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
import { VerazPort } from "../../ports/VerazPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { Cliente } from "../../../domain/entities/Cliente";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

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
        private readonly verazService: VerazPort,
        private readonly notificationService: NotificationPort,
        private readonly clienteRepository: ClienteRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly analistaRepository: AnalistaRepositoryPort, 
        private readonly verazAutomatico: boolean
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

            // VERIFICACION AUTOMÁTICA DE SOLICITUDES INICIALES POR VERAZ O NOSIS
            // Descomentar el bloque de Veraz si se desea activar la verificación automática
            /*
            // VERIFICACIÓN AUTOMÁTICA CON NOSIS
                if (this.nosisAutomatico) {
                    const getNosisData = new GetDataNosisUseCase(this.nosisPort);
                    const nosisData = await getNosisData.execute(dniCliente);
                    
                    const verifyNosis = new VerifyDataNosisUseCase();
                    const resultadoNosis = await verifyNosis.execute(nosisData);

                    if (resultadoNosis.status === "aprobado") {
                    solicitudCreada.setEstado("aprobada");
                    await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
                    
                    await this.historialRepository.registrarEvento({
                        usuarioId: null,
                        accion: HISTORIAL_ACTIONS.APPROVE_SOLICITUD_INICIAL,
                        entidadAfectada: 'solicitudes_iniciales',
                        entidadId: solicitudCreada.getId(),
                        detalles: {
                        sistema: "Nosis",
                        score: resultadoNosis.score,
                        motivo: resultadoNosis.motivo
                        },
                        solicitudInicialId
                    });
                    } 
                    else if (resultadoNosis.status === "rechazado") {
                    solicitudCreada.setEstado("rechazada");
                    await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
                    
                    await this.historialRepository.registrarEvento({
                        usuarioId: null,
                        accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
                        entidadAfectada: 'solicitudes_iniciales',
                        entidadId: solicitudCreada.getId(),
                        detalles: {
                        sistema: "Nosis",
                        score: resultadoNosis.score,
                        motivo: resultadoNosis.motivo
                        },
                        solicitudInicialId
                    });
                    } 
                    else {
                    solicitudCreada.setEstado("pendiente");
                    await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
                    await this.notificarAnalistas(solicitudCreada);
                    }
                } 
                else {
                    // Modo manual
                    await this.notificarAnalistas(solicitudCreada);
                }
*/
            // 6. Notificar al cliente (simulado)

            if (this.verazAutomatico) {
                // ===== BLOQUE VERAZ DESCOMENTADO =====
                const estadoVeraz = await this.verazService.checkClienteStatus(dniCliente);
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
                } else {
                    solicitudCreada.setEstado("pendiente");
                    await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
                }
                // ===== FIN BLOQUE VERAZ =====
            } else {
                // MODO MANUAL: Notificar a analistas
                await this.notificarAnalistas(solicitudCreada);
            }

            // Notificación al comerciante (existente)
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

    /**
     * Verifica si un cliente tiene un crédito activo basado en sus solicitudes formales y contratos.
     * 
     * Este método privado consulta todas las solicitudes formales del cliente por DNI
     * y verifica si alguna tiene contratos asociados con estado "generado" (activo).
     * 
     * @param dniCliente - DNI del cliente a verificar
     * @returns Promise<boolean> - true si el cliente tiene un crédito activo, false en caso contrario
     */
    private async tieneCreditoActivo(dniCliente: string): Promise<boolean> {
        // Obtener todas las solicitudes formales del cliente por DNI
        const solicitudesFormales = await this.solicitudFormalRepository.getSolicitudesFormalesByDni(dniCliente);
        // Verificar cada solicitud formal para ver si tiene un contrato activo asociado
        for (const solicitud of solicitudesFormales) {
            const contratos = await this.contratoRepository.getContratosBySolicitudFormalId(solicitud.getId());
            // Verificar si hay al menos un contrato activo para esta solicitud
            const tieneContratoActivo = contratos.some(contrato => {
                const estado = contrato.getEstado().toLowerCase();
                return estado === "generado";
            });
            
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
    private async notificarAnalistas(solicitud: SolicitudInicial): Promise<void> {
        try {
            const analistaIds = await this.analistaRepository.obtenerIdsAnalistasActivos();
            const notificaciones = analistaIds.map(analistaId => 
                this.notificationService.emitNotification({
                    userId: analistaId,
                    type: "solicitud_inicial",
                    message: "Nueva solicitud inicial requiere revisión",
                    metadata: {
                        solicitudId: solicitud.getId(),
                        dniCliente: solicitud.getDniCliente(),
                        comercianteId: solicitud.getComercianteId(),
                        prioridad: "media"
                    }
                })
            );
            await Promise.all(notificaciones);
        } catch (error) {
            console.error("Error notificando a analistas:", error);
            // Registrar error opcional
        }
    }

}
