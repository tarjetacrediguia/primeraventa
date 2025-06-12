//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByIdUseCase.ts

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

export class GetSolicitudesFormalesByIdUseCase {
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    async execute(id: number): Promise<SolicitudFormal | null> {
        return this.repository.getSolicitudFormalById(id);
    }
}