// src/application/use-cases/SolicitudFormal/CrearSolicitudFormalUseCase.ts
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { v4 as uuidv4 } from 'uuid';

export class CrearSolicitudFormalUseCase {
    constructor(
        private readonly solicitudInicialRepo: SolicitudInicialRepositoryPort,
        private readonly solicitudFormalRepo: SolicitudFormalRepositoryPort,
        private readonly permisoRepo: PermisoRepositoryPort,
        private readonly notificationService: NotificationPort
    ) {}

    async execute(
        solicitudInicialId: string,
        comercianteId: string,
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
        comentarioInicial: string = "Solicitud creada por comerciante" // Nuevo parámetro
    ): Promise<SolicitudFormal> {
        try {
            // 1. Verificar permisos del comerciante
            const tienePermiso = await this.permisoRepo.usuarioTienePermiso(
                comercianteId, 
                "solicitud_formal.crear"
            );
            
            if (!tienePermiso) {
                throw new Error("No tiene permisos para enviar solicitudes formales");
            }

            // 2. Obtener solicitud inicial
            const solicitudInicial = await this.solicitudInicialRepo.getSolicitudInicialById(solicitudInicialId);
            if (!solicitudInicial) {
                throw new Error("Solicitud inicial no encontrada");
            }

            // 3. Verificar estado de la solicitud inicial
            if (solicitudInicial.getEstado() !== "aprobada") {
                throw new Error("La solicitud inicial no está aprobada");
            }

            // 4. Verificar que no exista ya una solicitud formal para esta inicial
            const existentes = await this.solicitudFormalRepo.getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId);
            if (existentes.length > 0) {
                throw new Error("Ya existe una solicitud formal para esta solicitud inicial");
            }

            // 5. Crear la solicitud formal con comentario inicial
            const solicitudFormal = new SolicitudFormal(
                uuidv4(),
                datosSolicitud.nombreCompleto,
                datosSolicitud.apellido,
                datosSolicitud.dni,
                datosSolicitud.telefono,
                datosSolicitud.email,
                new Date(),
                datosSolicitud.recibo,
                "pendiente",
                datosSolicitud.aceptaTarjeta,
                datosSolicitud.fechaNacimiento,
                datosSolicitud.domicilio,
                datosSolicitud.datosEmpleador,
                datosSolicitud.referentes,
                [comentarioInicial] // Nuevo comentario inicial
            );
            
            // 6. Vincular con solicitud inicial (propiedad adicional necesaria)
            (solicitudFormal as any).solicitudInicialId = solicitudInicialId;

            // 7. Guardar en la base de datos
            const solicitudCreada = await this.solicitudFormalRepo.createSolicitudFormal(solicitudFormal);

            // 8. Notificar al cliente
            await this.notificationService.emitNotification({
                userId: solicitudCreada.getId(),
                type: "solicitud_formal",
                message: "Su solicitud formal de crédito ha sido enviada"
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
                userId: comercianteId,
                type: "error",
                message: `Error al crear solicitud formal: ${errorMessage}`
            });
            
            throw error;
        }
    }

    private async notificarAnalistas(solicitud: SolicitudFormal): Promise<void> {
        await this.notificationService.emitNotification({
            userId: "analistas", // Grupo o rol
            type: "nueva_solicitud",
            message: `Nueva solicitud formal pendiente: ${solicitud.getId()}`
        });
    }
}