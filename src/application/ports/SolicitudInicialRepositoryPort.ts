// src/application/ports/SolicitudInicialRepositoryPort.ts
import { SolicitudInicial } from "../../domain/entities/SolicitudInicial";

export interface SolicitudInicialRepositoryPort {
    createSolicitudInicial(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial>;
    getSolicitudInicialById(id: string): Promise<SolicitudInicial | null>;
    updateSolicitudInicial(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial>;
    getAllSolicitudesIniciales(): Promise<SolicitudInicial[]>;
    getSolicitudesInicialesByDni(dni: string): Promise<SolicitudInicial[]>;
    getSolicitudesInicialesByEstado(estado: string): Promise<SolicitudInicial[]>;
    getSolicitudesInicialesByFecha(fecha: Date): Promise<SolicitudInicial[]>;
    getSolicitudesInicialesByComercianteId(comercianteId: string): Promise<SolicitudInicial[]>;
    getSolicitudesInicialesByClienteId(clienteId: string): Promise<SolicitudInicial[]>;
}