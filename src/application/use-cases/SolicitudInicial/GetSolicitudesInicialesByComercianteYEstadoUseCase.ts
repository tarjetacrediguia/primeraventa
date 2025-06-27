// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByComercianteYEstadoUseCase.ts
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

export class GetSolicitudesInicialesByComercianteYEstadoUseCase {
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    async execute(comercianteId: number, estado: string): Promise<SolicitudInicial[]> {
        return this.repository.getSolicitudesInicialesByComercianteYEstado(comercianteId, estado);
    }
}