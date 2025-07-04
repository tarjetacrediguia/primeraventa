// src/application/use-cases/SolicitudInicial/ListSolicitudesInicialesUseCase.ts
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

export class ListSolicitudesInicialesUseCase {
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    async execute(): Promise<SolicitudInicial[]> {
        return this.repository.getAllSolicitudesIniciales();
    }
}
