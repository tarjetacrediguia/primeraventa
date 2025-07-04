// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByComercianteIdUseCase.ts
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

export class GetSolicitudesInicialesByComercianteIdUseCase {
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    async execute(comercianteId: number): Promise<SolicitudInicial[]> {
        return this.repository.getSolicitudesInicialesByComercianteId(comercianteId);
    }
}
