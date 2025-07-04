//src/application/use-cases/SolicitudFormal/GetAllSolicitudesFormalesUseCase.ts
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

export class GetAllSolicitudesFormalesUseCase {
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    async execute(): Promise<SolicitudFormal[]> {
        return this.repository.getAllSolicitudesFormales();
    }
}
