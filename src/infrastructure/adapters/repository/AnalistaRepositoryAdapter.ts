//src/infrastructure/adapters/repository/AnalistaRepositoryAdapter.ts

import { AnalistaRepositoryPort } from "../../../application/ports/AnalistaRepositoryPort";
import { Analista } from "../../../domain/entities/Analista";

export class AnalistaRepositoryAdapter implements AnalistaRepositoryPort {
    findByEmail(email: string): Promise<Analista | null> {
        throw new Error("Method not implemented.");
    }
    saveAnalista(analista: Analista): Promise<Analista> {
        throw new Error("Method not implemented.");
    }
    
    getAnalistaById(id: string): Promise<Analista | null> {
        throw new Error("Method not implemented.");
    }
    
    updateAnalista(analista: Analista): Promise<Analista> {
        throw new Error("Method not implemented.");
    }
    
    deleteAnalista(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    getAllAnalistas(): Promise<Analista[]> {
        throw new Error("Method not implemented.");
    }
}