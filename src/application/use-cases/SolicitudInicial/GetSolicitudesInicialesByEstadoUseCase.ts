// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByEstadoUseCase.ts
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

export class GetSolicitudesInicialesByEstadoUseCase {
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    async execute(estado: string): Promise<SolicitudInicial[]> {
        return this.repository.getSolicitudesInicialesByEstado(estado);
    }
}