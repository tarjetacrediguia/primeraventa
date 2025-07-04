// src/application/ports/SolicitudInicialRepositoryPort.ts
import { SolicitudInicial } from "../../domain/entities/SolicitudInicial";

export interface SolicitudInicialRepositoryPort {
    createSolicitudInicial(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial>;
    getSolicitudInicialById(id: number): Promise<SolicitudInicial | null>;
    updateSolicitudInicial(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial>;
    getAllSolicitudesIniciales(): Promise<SolicitudInicial[]>;
    getSolicitudesInicialesByDni(dni: string): Promise<SolicitudInicial[]>;
    getSolicitudesInicialesByEstado(estado: string): Promise<SolicitudInicial[]>;
    getSolicitudesInicialesByFecha(fecha: Date): Promise<SolicitudInicial[]>;
    getSolicitudesInicialesByComercianteId(comercianteId: number): Promise<SolicitudInicial[]>;
    getSolicitudesInicialesByClienteId(clienteId: number): Promise<SolicitudInicial[]>;
    obtenerSolicitudesAExpirar(diasExpiracion: number): Promise<SolicitudInicial[]>;
    expirarSolicitud(solicitudId: number): Promise<void>;
    getSolicitudesInicialesByComercianteYEstado(
        comercianteId: number, 
        estado: string
    ): Promise<SolicitudInicial[]>;
    updateSolicitudInicialAprobaciónRechazo(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial>
}
