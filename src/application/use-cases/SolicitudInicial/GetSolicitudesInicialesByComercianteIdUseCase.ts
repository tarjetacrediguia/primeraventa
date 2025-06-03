// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByComercianteIdUseCase.ts
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

export class GetSolicitudesInicialesByComercianteIdUseCase {
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    async execute(comercianteId: string): Promise<SolicitudInicial[]> {
        return this.repository.getSolicitudesInicialesByComercianteId(comercianteId);
    }
}