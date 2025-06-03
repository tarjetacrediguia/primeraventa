//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByFechaUseCase.ts

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

export class GetSolicitudesFormalesByFechaUseCase {
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    async execute(fecha: Date): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByFecha(fecha);
    }
}