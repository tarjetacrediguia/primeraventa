//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByComercianteIdUseCase.ts

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

export class GetSolicitudesFormalesByComercianteIdUseCase {
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    async execute(comercianteId: number): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByComercianteId(comercianteId);
    }
}
