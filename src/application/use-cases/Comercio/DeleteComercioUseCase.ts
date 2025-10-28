// src/application/use-cases/Comercio/DeleteComercioUseCase.ts
import { ComercioRepositoryPort } from "../../ports/ComercioRepositoryPort";

export class DeleteComercioUseCase {
    constructor(private readonly repository: ComercioRepositoryPort) {}

    async execute(numeroComercio: string): Promise<void> {
        if (!numeroComercio) {
            throw new Error("El número de comercio es obligatorio");
        }

        const comercioExistente = await this.repository.getComercioByNumero(numeroComercio);
        if (!comercioExistente) {
            throw new Error("Comercio no encontrado");
        }

        await this.repository.deleteComercio(numeroComercio);
    }
}