// src/application/use-cases/Analista/GetAllAnalistaUseCase.ts
import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

export class GetAllAnalistaUseCase {
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    async execute(): Promise<Analista[]> {
        return this.repository.getAllAnalistas();
    }
}
