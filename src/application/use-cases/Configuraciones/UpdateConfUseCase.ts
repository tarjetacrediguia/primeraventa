// src/application/use-cases/Configuraciones/UpdateConfUseCase.ts
import { ConfiguracionRepositoryPort } from "../../ports/ConfiguracionRepositoryPort";
import { Configuracion } from "../../../domain/entities/Configuracion";

export class UpdateConfUseCase {
    constructor(private readonly repository: ConfiguracionRepositoryPort) {}

    async execute(clave: string, valor: any): Promise<Configuracion> {
        return this.repository.actualizarConfiguracion(clave, valor);
    }
}
