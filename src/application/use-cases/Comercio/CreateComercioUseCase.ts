// src/application/use-cases/Comercio/CreateComercioUseCase.ts
import { Comercio } from "../../../domain/entities/Comercio";
import { ComercioRepositoryPort } from "../../ports/ComercioRepositoryPort";

export class CreateComercioUseCase {
    constructor(private readonly repository: ComercioRepositoryPort) {}

    async execute(
        numeroComercio: string,
        nombreComercio: string,
        cuil: string,
        direccionComercio: string
    ): Promise<Comercio> {
        if (!numeroComercio || !nombreComercio || !cuil || !direccionComercio) {
            throw new Error("Todos los campos del comercio son obligatorios");
        }

        const existeComercio = await this.repository.getComercioByNumero(numeroComercio);
        if (existeComercio) {
            throw new Error("Ya existe un comercio con este número");
        }

        const existeCuil = await this.repository.findByCuil(cuil);
        if (existeCuil) {
            throw new Error("Ya existe un comercio con este CUIL");
        }

        const comercio = new Comercio({
            numeroComercio,
            nombreComercio,
            cuil,
            direccionComercio
        });

        return this.repository.saveComercio(comercio);
    }
}