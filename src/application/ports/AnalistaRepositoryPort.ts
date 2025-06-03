// src/application/ports/AnalistaRepositoryPort.ts
import { Analista } from "../../domain/entities/Analista";

export interface AnalistaRepositoryPort {
    saveAnalista(analista: Analista): Promise<Analista>;
    getAnalistaById(id: string): Promise<Analista | null>;
    updateAnalista(analista: Analista): Promise<Analista>;
    deleteAnalista(id: string): Promise<void>;
    getAllAnalistas(): Promise<Analista[]>;
    findByEmail(email: string): Promise<Analista | null>;
}