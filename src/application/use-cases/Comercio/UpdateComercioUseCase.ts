// src/application/use-cases/Comercio/UpdateComercioUseCase.ts
import { Comercio } from "../../../domain/entities/Comercio";
import { ComercioRepositoryPort } from "../../ports/ComercioRepositoryPort";

export class UpdateComercioUseCase {
    constructor(private readonly repository: ComercioRepositoryPort) {}

    async execute(
        numeroComercio: string,
        nombreComercio?: string,
        direccionComercio?: string
    ): Promise<Comercio> {
        if (!numeroComercio) {
            throw new Error("El número de comercio es obligatorio");
        }

        const comercioExistente = await this.repository.getComercioByNumero(numeroComercio);
        if (!comercioExistente) {
            throw new Error("Comercio no encontrado");
        }

        if (nombreComercio) comercioExistente.setNombreComercio(nombreComercio);
        if (direccionComercio) comercioExistente.setDireccionComercio(direccionComercio);

        return this.repository.updateComercio(comercioExistente);
    }
}