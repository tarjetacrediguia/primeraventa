// src/application/ports/ComercianteRepositoryPort.ts
import { Comerciante } from "../../domain/entities/Comerciante";

export interface ComercianteRepositoryPort {
    saveComerciante(comerciante: Comerciante): Promise<Comerciante>;
    getComercianteById(id: number): Promise<Comerciante | null>;
    updateComerciante(comerciante: Comerciante): Promise<Comerciante>;
    deleteComerciante(id: number): Promise<void>;
    getAllComerciantes(): Promise<Comerciante[]>;
    findByEmail(email: string): Promise<Comerciante | null>;
    findByCuil(cuil: string): Promise<Comerciante | null>;
}