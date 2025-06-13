// src/application/use-cases/tareas/ExpirarSolicitudesInicialesUseCase.ts
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { Cliente } from "../../../domain/entities/Cliente";
import { ConfiguracionRepositoryPort } from "../../ports/ConfiguracionRepositoryPort";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

export class ExpirarSolicitudesInicialesUseCase {
    constructor(
        private readonly solicitudInicialRepository: SolicitudInicialRepositoryPort,
        private readonly configuracionRepository: ConfiguracionRepositoryPort,
        private readonly clienteRepository: ClienteRepositoryPort,
        private readonly analistaRepository: AnalistaRepositoryPort,
        private readonly comercianteRepository: ComercianteRepositoryPort,
        private readonly notificationService: NotificationPort,
    ) {}

    async execute(): Promise<void> {
        try {
            // 1. Obtener días de expiración desde configuración
            const diasExpiracion = await this.configuracionRepository.obtenerDiasExpiracion();
            
            // 2. Obtener solicitudes a expirar
            const solicitudes = await this.solicitudInicialRepository.obtenerSolicitudesAExpirar(diasExpiracion);
            
            if (solicitudes.length === 0) {
                console.log('No hay solicitudes para expirar');
                return;
            }
            
            // 3. Procesar cada solicitud
            for (const solicitud of solicitudes) {
                // 3.1. Actualizar estado a expirada
                await this.solicitudInicialRepository.expirarSolicitud(solicitud.getId());
                
                // 3.2. Obtener cliente asociado
                const cliente = await this.clienteRepository.findById(solicitud.getClienteId());
                
                // 3.3. Notificar a todas las partes interesadas
                await this.notificarPartesInteresadas(cliente, solicitud);
            }
            
            // 4. Notificar éxito al sistema
            await this.notificationService.emitNotification({
                userId: 0, // Sistema
                type: "sistema",
                message: `Proceso de expiración completado: ${solicitudes.length} solicitudes expiradas`,
                metadata: {
                    solicitudesExpiradas: solicitudes.map(s => s.getId())
                }
            });
            
        } catch (error) {
            console.error('Error en ExpirarSolicitudesInicialesUseCase:', error);
            
            // Notificar error con más detalles
            await this.notificationService.emitNotification({
                userId: 0, // Sistema
                type: "error",
                message: "Error en proceso de expiración de solicitudes iniciales",
                metadata: {
                    error: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined
                }
            });
            
            throw error;
        }
    }
    
    private async notificarPartesInteresadas(cliente: Cliente, solicitud: SolicitudInicial): Promise<void> {
        const mensaje = `La solicitud inicial #${solicitud.getId()} del cliente ${cliente.getNombreCompleto()} ha expirado.`;
        const metadata = {
            solicitudId: solicitud.getId(),
            clienteId: cliente.getId(),
            clienteNombre: cliente.getNombreCompleto(),
            fechaCreacion: solicitud.getFechaCreacion()
        };

        // 1. Notificar al cliente
        await this.notificarCliente(cliente, solicitud, mensaje, metadata);
        
        // 2. Notificar al comerciante asociado
        await this.notificarComerciante(solicitud, mensaje, metadata);
        
        // 3. Notificar a todos los analistas
        await this.notificarAnalistas(mensaje, metadata);
    }
    
    private async notificarCliente(cliente: Cliente, solicitud: SolicitudInicial, mensaje: string, metadata: any): Promise<void> {
        // Notificación en el sistema
        await this.notificationService.emitNotification({
            userId: 0,
            type: "solicitud_inicial",
            message: mensaje,
            metadata: {
                ...metadata,
                entidad: "solicitud_inicial",
                accion: "expiracion"
            }
        });
    }
    
    private async notificarComerciante(solicitud: SolicitudInicial, mensaje: string, metadata: any): Promise<void> {
        try {
            const comercianteId = solicitud.getComercianteId();
            if (comercianteId) {
                // Obtener usuario del comerciante
                const comerciante = await this.comercianteRepository.getComercianteById(comercianteId);
                if (comerciante) {
                    const usuarioId = comerciante.getId();
                    
                    await this.notificationService.emitNotification({
                        userId: usuarioId,
                        type: "solicitud_inicial",
                        message: `Solicitud inicial #${solicitud.getId()} ha expirado`
                    });
                }
            }
        } catch (error) {
            console.error(`Error notificando al comerciante de la solicitud ${solicitud.getId()}:`, error);
        }
    }
    
    private async notificarAnalistas(mensaje: string, metadata: any): Promise<void> {
        try {
            // 1. Obtener todos los IDs de analistas
            const analistaIds = await this.analistaRepository.obtenerIdsAnalistasActivos();
            
            // 2. Enviar notificación individual a cada analista
            const notificaciones = analistaIds.map(analistaId => 
                this.notificationService.emitNotification({
                    userId: analistaId,
                    type: "solicitud_inicial",
                    message: mensaje
                })
            );
            
            await Promise.all(notificaciones);
        } catch (error) {
            console.error("Error notificando a analistas:", error);
        }
    }
}