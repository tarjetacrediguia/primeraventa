// src/application/ports/AnalistaRepositoryPort.ts
import { Analista } from "../../domain/entities/Analista";

export interface AnalistaRepositoryPort {
    saveAnalista(analista: Analista): Promise<Analista>;
    getAnalistaById(id: number): Promise<Analista | null>;
    updateAnalista(analista: Analista): Promise<Analista>;
    deleteAnalista(id: number): Promise<void>;
    getAllAnalistas(): Promise<Analista[]>;
    findByEmail(email: string): Promise<Analista | null>;
    obtenerIdsAnalistasActivos(): Promise<number[]>;
}
