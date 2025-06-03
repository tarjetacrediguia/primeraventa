//src/application/use-cases/SolicitudFormal/UpdateSolicitudFormalUseCase.ts

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

export class UpdateSolicitudFormalUseCase {
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    async execute(solicitud: SolicitudFormal): Promise<SolicitudFormal> {
        return this.repository.updateSolicitudFormal(solicitud);
    }
}