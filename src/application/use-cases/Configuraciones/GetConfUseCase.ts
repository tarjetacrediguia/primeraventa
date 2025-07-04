// src/application/use-cases/Configuraciones/GetConfUseCase.ts
import { ConfiguracionRepositoryPort } from "../../ports/ConfiguracionRepositoryPort";
import { Configuracion } from "../../../domain/entities/Configuracion";

export class GetConfUseCase {
    constructor(private readonly repository: ConfiguracionRepositoryPort) {}

    async execute(): Promise<Configuracion[]> {
        return this.repository.obtenerConfiguracion();
    }
}
