//src/infrastructure/adapters/repository/SolicitudFormalRepositoryAdapter.ts

import { SolicitudFormalRepositoryPort } from "../../../application/ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";


export class SolicitudFormalRepositoryAdapter implements SolicitudFormalRepositoryPort {
    getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId: string): Promise<SolicitudFormal[]> {
        throw new Error("Method not implemented.");
    }
    vincularContrato(solicitudId: string, contratoId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createSolicitudFormal(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal> {
        throw new Error("Method not implemented.");
    }
    getSolicitudFormalById(id: string): Promise<SolicitudFormal | null> {
        throw new Error("Method not implemented.");
    }
    updateSolicitudFormal(solicitudFormal: SolicitudFormal): Promise<SolicitudFormal> {
        throw new Error("Method not implemented.");
    }
    deleteSolicitudFormal(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAllSolicitudesFormales(): Promise<SolicitudFormal[]> {
        throw new Error("Method not implemented.");
    }
    getSolicitudesFormalesByDni(dni: string): Promise<SolicitudFormal[]> {
        throw new Error("Method not implemented.");
    }
    getSolicitudesFormalesByEstado(estado: string): Promise<SolicitudFormal[]> {
        throw new Error("Method not implemented.");
    }
    getSolicitudesFormalesByFecha(fecha: Date): Promise<SolicitudFormal[]> {
        throw new Error("Method not implemented.");
    }
    getSolicitudesFormalesByComercianteId(comercianteId: string): Promise<SolicitudFormal[]> {
        throw new Error("Method not implemented.");
    }
    getSolicitudesFormalesByAnalistaId(analistaId: string): Promise<SolicitudFormal[]> {
        throw new Error("Method not implemented.");
    }
    
}