// src/application/ports/SolicitudFormalRepositoryPort.ts
import { SolicitudFormal } from "../../domain/entities/SolicitudFormal";

export interface SolicitudFormalRepositoryPort {
    createSolicitudFormal(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal>;
    getSolicitudFormalById(id: number): Promise<SolicitudFormal | null>;
    updateSolicitudFormal(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal>;
    deleteSolicitudFormal(id: number): Promise<void>;
    getAllSolicitudesFormales(): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesByDni(dni: string): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesByEstado(estado: string): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesByFecha(fecha: Date): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesByComercianteId(comercianteId: number): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesByAnalistaId(analistaId: number): Promise<SolicitudFormal[]>;
    vincularContrato(solicitudId: number, contratoId: number): Promise<void>;
    getSolicitudesFormalesByDni(dni: string): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId: number): Promise<SolicitudFormal[]>;
    updateSolicitudFormalAprobacion(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal>;
    updateSolicitudFormalRechazo(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal>;
    getSolicitudesFormalesByComercianteYEstado(
        comercianteId: number, 
        estado: string
    ): Promise<SolicitudFormal[]>;
}