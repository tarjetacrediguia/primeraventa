//src/infrastructure/adapters/repository/ComercianteRepositoryAdapter.ts

import { ComercianteRepositoryPort } from "../../../application/ports/ComercianteRepositoryPort";
import { Comerciante } from "../../../domain/entities/Comerciante";

export class ComercianteRepositoryAdapter implements ComercianteRepositoryPort {
    findByEmail(email: string): Promise<Comerciante | null> {
        throw new Error("Method not implemented.");
    }
    findByCuil(cuil: string): Promise<Comerciante | null> {
        throw new Error("Method not implemented.");
    }
    saveComerciante(comerciante: Comerciante): Promise<Comerciante> {
        throw new Error("Method not implemented.");
    }

    getComercianteById(id: string): Promise<Comerciante | null> {
        throw new Error("Method not implemented.");
    }

    updateComerciante(comerciante: Comerciante): Promise<Comerciante> {
        throw new Error("Method not implemented.");
    }

    deleteComerciante(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getAllComerciantes(): Promise<Comerciante[]> {
        throw new Error("Method not implemented.");
    }
}