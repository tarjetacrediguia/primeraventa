// src/application/use-cases/SolicitudInicial/CrearSolicitudInicialUseCase.ts
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { ContratoRepositoryPort } from "../../ports/ContratoRepositoryPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { VerazPort } from "../../ports/VerazPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { v4 as uuidv4 } from 'uuid';

export class CrearSolicitudInicialUseCase {
    constructor(
        private readonly solicitudInicialRepository: SolicitudInicialRepositoryPort,
        private readonly contratoRepository: ContratoRepositoryPort,
        private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
        private readonly verazService: VerazPort,
        private readonly notificationService: NotificationPort
    ) {}

    async execute(
        dniCliente: string,
        cuilCliente: string,
        comercianteId: string,
        reciboSueldo?: Buffer
    ): Promise<SolicitudInicial> {
        try {
            // 1. Verificar si el cliente tiene crédito activo
            const tieneCreditoActivo = await this.tieneCreditoActivo(dniCliente);
            if (tieneCreditoActivo) {
                // Notificar al comerciante que no puede crear solicitud
                await this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "solicitud_inicial",
                    message: `El cliente con DNI ${dniCliente} ya tiene un crédito activo`
                });
                throw new Error("El cliente ya tiene un crédito activo");
            }

            // 2. Crear solicitud inicial con estado "pendiente"
            const solicitud = new SolicitudInicial(
                uuidv4(),
                new Date(),
                "pendiente",
                dniCliente,
                cuilCliente,
                reciboSueldo,
                comercianteId
            );

            // 3. Guardar solicitud inicial
            const solicitudCreada = await this.solicitudInicialRepository.createSolicitudInicial(solicitud);

            // 4. Consultar Veraz
            const estadoVeraz = await this.verazService.checkClienteStatus(dniCliente);
            
            // 5. Actualizar estado según Veraz
            if (estadoVeraz.status === "aprobado") {
                solicitudCreada.setEstado("aprobada");
                await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
            } else {
                solicitudCreada.setEstado("rechazada");
                await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
                throw new Error("Cliente no apto para crédito según Veraz");
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
            throw error;
        }
    }

    private async tieneCreditoActivo(dniCliente: string): Promise<boolean> {
        // Obtener todas las solicitudes formales del cliente por DNI
        const solicitudesFormales = await this.solicitudFormalRepository.getSolicitudesFormalesByDni(dniCliente);
        
        // Verificar cada solicitud formal para ver si tiene un contrato activo asociado
        for (const solicitud of solicitudesFormales) {
            const contratos = await this.contratoRepository.getContratosBySolicitudFormalId(solicitud.getId());
            
            // Verificar si hay al menos un contrato activo para esta solicitud
            const tieneContratoActivo = contratos.some(contrato => {
                const estado = contrato.getEstado().toLowerCase();
                return estado === "activo" || estado === "vigente" || estado === "en_curso";
            });
            
            if (tieneContratoActivo) {
                return true;
            }
        }
        
        return false;
    }
}