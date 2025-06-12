//src/infrastructure/adapters/repository/AnalistaRepositoryAdapter.ts

import { AnalistaRepositoryPort } from "../../../application/ports/AnalistaRepositoryPort";
import { Analista } from "../../../domain/entities/Analista";
import { pool } from "../../config/Database/DatabaseDonfig";

export class AnalistaRepositoryAdapter implements AnalistaRepositoryPort {
    async obtenerIdsAnalistasActivos(): Promise<number[]> {
        const query = `
            SELECT id 
            FROM usuarios 
            WHERE rol = 'analista' 
              AND activo = true
        `;
        const result = await pool.query(query);
        return result.rows.map(row => row.id);
    }
    findByEmail(email: string): Promise<Analista | null> {
        throw new Error("Method not implemented.");
    }
    saveAnalista(analista: Analista): Promise<Analista> {
        throw new Error("Method not implemented.");
    }
    
    getAnalistaById(id: number): Promise<Analista | null> {
        throw new Error("Method not implemented.");
    }
    
    updateAnalista(analista: Analista): Promise<Analista> {
        throw new Error("Method not implemented.");
    }
    
    deleteAnalista(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    getAllAnalistas(): Promise<Analista[]> {
        throw new Error("Method not implemented.");
    }
}