// src/application/use-cases/SolicitudFormal/ConsultarEstadoDeSolicitudesFormalesUseCase.ts
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";

export class ConsultarEstadoDeSolicitudesFormalesUseCase {
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    async execute(): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByEstado("pendiente");
    }
}