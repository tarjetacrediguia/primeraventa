// src/application/use-cases/Comerciante/GetComercianteByIdUseCase.ts
import { Comerciante } from "../../../domain/entities/Comerciante";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

export class GetComercianteByIdUseCase {
    constructor(private readonly repository: ComercianteRepositoryPort) {}

    async execute(id: string): Promise<Comerciante> {
        const comerciante = await this.repository.getComercianteById(id);
        
        if (!comerciante) {
            throw new Error("Comerciante no encontrado");
        }
        
        return comerciante;
    }
}