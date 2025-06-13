// src/application/use-cases/Configuraciones/CreateConfUseCase.ts
import { ConfiguracionRepositoryPort } from "../../ports/ConfiguracionRepositoryPort";
import { Configuracion } from "../../../domain/entities/Configuracion";

export class CreateConfUseCase {
    constructor(private readonly repository: ConfiguracionRepositoryPort) {}

    async execute(configuracion: Configuracion): Promise<Configuracion> {
        return this.repository.crearConfiguracion(configuracion);
    }
}