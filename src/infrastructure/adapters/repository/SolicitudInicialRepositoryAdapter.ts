//src/infrastructure/adapters/repository/SolicitudInicialRepositoryAdapter.ts

import { SolicitudInicialRepositoryPort } from "../../../application/ports/SolicitudInicialRepositoryPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";


export class SolicitudInicialRepositoryAdapter implements SolicitudInicialRepositoryPort {
    createSolicitudInicial(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial> {
        throw new Error("Method not implemented.");
    }
    getSolicitudInicialById(id: string): Promise<SolicitudInicial | null> {
        throw new Error("Method not implemented.");
    }
    updateSolicitudInicial(solicitudInicial: SolicitudInicial): Promise<SolicitudInicial> {
        throw new Error("Method not implemented.");
    }
    getAllSolicitudesIniciales(): Promise<SolicitudInicial[]> {
        throw new Error("Method not implemented.");
    }
    getSolicitudesInicialesByDni(dni: string): Promise<SolicitudInicial[]> {
        throw new Error("Method not implemented.");
    }
    getSolicitudesInicialesByEstado(estado: string): Promise<SolicitudInicial[]> {
        throw new Error("Method not implemented.");
    }
    getSolicitudesInicialesByFecha(fecha: Date): Promise<SolicitudInicial[]> {
        throw new Error("Method not implemented.");
    }
    getSolicitudesInicialesByComercianteId(comercianteId: string): Promise<SolicitudInicial[]> {
        throw new Error("Method not implemented.");
    }
    getSolicitudesInicialesByClienteId(clienteId: string): Promise<SolicitudInicial[]> {
        throw new Error("Method not implemented.");
    }
    
}