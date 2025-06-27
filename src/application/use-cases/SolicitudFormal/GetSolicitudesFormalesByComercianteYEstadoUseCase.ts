// src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByComercianteYEstadoUseCase.ts
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";

export class GetSolicitudesFormalesByComercianteYEstadoUseCase {
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    async execute(comercianteId: number, estado: string): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByComercianteYEstado(comercianteId, estado);
    }
}