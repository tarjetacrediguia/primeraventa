// src/application/use-cases/SolicitudFormal/UpdateSolicitudFormalUseCase.ts
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";

export class UpdateSolicitudFormalUseCase {
    constructor(
        private readonly repository: SolicitudFormalRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort
    ) {}

    async execute(
        solicitud: SolicitudFormal,
        usuarioId: number,
        comentario?: string
    ): Promise<SolicitudFormal> {

        // 1. Obtener la versión anterior para comparar cambios
            const original = await this.repository.getSolicitudFormalById(solicitud.getId());
            const solicitudInicialId = original?.getSolicitudInicialId();

        try {
            
            
            if (!original) {
                throw new Error("Solicitud no encontrada");
            }

            if (original.getEstado() == "aprobada") {
                throw new Error("No se puede actualizar una solicitud aprobada");
            }

            // 2. Detectar cambios antes de actualizar
            const cambios = this.detectarCambios(original, solicitud);
            
            // 3. Actualizar la solicitud
            const actualizada = await this.repository.updateSolicitudFormal(solicitud);
            
            // 4. Registrar en el historial si hay cambios
            if (cambios.length > 0) {
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.UPDATE_SOLICITUD_FORMAL,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitud.getId(),
                    detalles: {
                        cambios: cambios,
                        comentario: comentario || ""
                    },
                    solicitudInicialId: solicitudInicialId
                });
            }
            
            return actualizada;
        } catch (error) {
            // Registrar error en el historial
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'solicitudes_formales',
                entidadId: solicitud.getId(),
                detalles: {
                    error: error instanceof Error ? error.message : String(error),
                    etapa: "actualizacion_solicitud_formal"
                },
                    solicitudInicialId: solicitudInicialId
            });
            
            throw error;
        }
    }

    private detectarCambios(original: SolicitudFormal, actualizada: SolicitudFormal): any[] {
        const cambios: any[] = [];
        
        // Lista de campos a monitorear
        const campos = [
            'nombreCompleto', 'apellido', 'dni', 'telefono', 'email',
            'fechaSolicitud', 'estado', 'aceptaTarjeta', 'fechaNacimiento',
            'domicilio', 'datosEmpleador', 'referentes', 'comentarios',
            'clienteId', 'numeroTarjeta', 'numeroCuenta', 'fechaAprobacion',
            'analistaAprobadorId', 'administradorAprobadorId'
        ];
        
        for (const campo of campos) {
            const valorOriginal = (original as any)[campo];
            const valorActual = (actualizada as any)[campo];
            
            // Comparación especial para arrays y objetos
            if (Array.isArray(valorOriginal)) {
                if (!this.sonArraysIguales(valorOriginal, valorActual)) {
                    cambios.push({
                        campo,
                        anterior: valorOriginal,
                        nuevo: valorActual
                    });
                }
            } else if (valorOriginal !== valorActual) {
                cambios.push({
                    campo,
                    anterior: valorOriginal,
                    nuevo: valorActual
                });
            }
        }
        
        return cambios;
    }

    private sonArraysIguales(arr1: any[], arr2: any[]): boolean {
        if (arr1.length !== arr2.length) return false;
        
        for (let i = 0; i < arr1.length; i++) {
            if (typeof arr1[i] === 'object') {
                if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
                    return false;
                }
            } else if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        
        return true;
    }
}