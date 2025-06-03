// src/application/ports/SolicitudFormalRepositoryPort.ts
import { SolicitudFormal } from "../../domain/entities/SolicitudFormal";

export interface SolicitudFormalRepositoryPort {
    createSolicitudFormal(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal>;
    getSolicitudFormalById(id: string): Promise<SolicitudFormal | null>;
    updateSolicitudFormal(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal>;
    deleteSolicitudFormal(id: string): Promise<void>;
    getAllSolicitudesFormales(): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesByDni(dni: string): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesByEstado(estado: string): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesByFecha(fecha: Date): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesByComercianteId(comercianteId: string): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesByAnalistaId(analistaId: string): Promise<SolicitudFormal[]>;
    vincularContrato(solicitudId: string, contratoId: string): Promise<void>;
    getSolicitudesFormalesByDni(dni: string): Promise<SolicitudFormal[]>;
    getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId: string): Promise<SolicitudFormal[]>;
}