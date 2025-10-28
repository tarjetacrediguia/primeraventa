// src/application/use-cases/Comercio/ListComerciosUseCase.ts
import { Comercio } from "../../../domain/entities/Comercio";
import { ComercioRepositoryPort } from "../../ports/ComercioRepositoryPort";

export class ListComerciosUseCase {
    constructor(private readonly repository: ComercioRepositoryPort) {}

    async execute(): Promise<Comercio[]> {
        return this.repository.getAllComercios();
    }
}