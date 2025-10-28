// src/application/use-cases/Comercio/GetComercioUseCase.ts
import { Comercio } from "../../../domain/entities/Comercio";
import { ComercioRepositoryPort } from "../../ports/ComercioRepositoryPort";

export class GetComercioUseCase {
    constructor(private readonly repository: ComercioRepositoryPort) {}

    async execute(numeroComercio: string): Promise<Comercio> {
        if (!numeroComercio) {
            throw new Error("El número de comercio es obligatorio");
        }

        const comercio = await this.repository.getComercioByNumero(numeroComercio);
        if (!comercio) {
            throw new Error("Comercio no encontrado");
        }

        return comercio;
    }
}