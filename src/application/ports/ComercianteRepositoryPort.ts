// src/application/ports/ComercianteRepositoryPort.ts
import { Comerciante } from "../../domain/entities/Comerciante";

export interface ComercianteRepositoryPort {
    saveComerciante(comerciante: Comerciante): Promise<Comerciante>;
    getComercianteById(id: string): Promise<Comerciante | null>;
    updateComerciante(comerciante: Comerciante): Promise<Comerciante>;
    deleteComerciante(id: string): Promise<void>;
    getAllComerciantes(): Promise<Comerciante[]>;
    findByEmail(email: string): Promise<Comerciante | null>;
    findByCuil(cuil: string): Promise<Comerciante | null>;
}