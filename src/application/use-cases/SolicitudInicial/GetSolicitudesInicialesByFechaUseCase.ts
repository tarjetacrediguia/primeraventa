// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByFechaUseCase.ts
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

export class GetSolicitudesInicialesByFechaUseCase {
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    async execute(fecha: Date): Promise<SolicitudInicial[]> {
        return this.repository.getSolicitudesInicialesByFecha(fecha);
    }
}