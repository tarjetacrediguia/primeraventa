//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByEstadoUseCase.ts

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

export class GetSolicitudesFormalesByEstadoUseCase {
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    async execute(estado: string): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByEstado(estado);
    }
}
