// src/application/use-cases/Analista/GetAnalistaByIdUseCase.ts
import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

export class GetAnalistaByIdUseCase {
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    async execute(id: number): Promise<Analista> {
        const analista = await this.repository.getAnalistaById(id);
        
        if (!analista) {
            throw new Error("Analista no encontrado");
        }
        
        return analista;
    }
}
