// src/application/ports/ComercioRepositoryPort.ts
import { Comercio } from "../../domain/entities/Comercio";

export interface ComercioRepositoryPort {
    saveComercio(comercio: Comercio): Promise<Comercio>;
    getComercioByNumero(numeroComercio: string): Promise<Comercio | null>;
    findByCuil(cuil: string): Promise<Comercio | null>;
    updateComercio(comercio: Comercio): Promise<Comercio>;
    deleteComercio(numeroComercio: string): Promise<void>;
    getAllComercios(): Promise<Comercio[]>;
}