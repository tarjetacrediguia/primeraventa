// src/application/use-cases/Comerciante/GetAllComercianteUseCase.ts
import { Comerciante } from "../../../domain/entities/Comerciante";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

export class GetAllComercianteUseCase {
    constructor(private readonly repository: ComercianteRepositoryPort) {}

    async execute(): Promise<Comerciante[]> {
        return this.repository.getAllComerciantes();
    }
}