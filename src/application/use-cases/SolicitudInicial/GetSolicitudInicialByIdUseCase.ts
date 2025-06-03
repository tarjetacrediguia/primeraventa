// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByIdUseCase.ts
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

export class GetSolicitudesInicialesByIdUseCase {
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    async execute(id: string): Promise<SolicitudInicial | null> {
        return this.repository.getSolicitudInicialById(id);
    }
}