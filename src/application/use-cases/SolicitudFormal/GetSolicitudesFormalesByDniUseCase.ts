//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByDniUseCase.ts

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

export class GetSolicitudesFormalesByDniUseCase {
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    async execute(dni: string): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByDni(dni);
    }
}
