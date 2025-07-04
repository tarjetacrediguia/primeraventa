// src/application/ports/ClienteRepositoryPort.ts

import { Cliente } from "../../domain/entities/Cliente";

export interface ClienteRepositoryPort {

    findById(id: number): Promise<Cliente>;
    findByDni(dni: string): Promise<Cliente>;
    findByCuil(cuil: string): Promise<Cliente>;
    findByEmail(email: string): Promise<Cliente>;
    findAll(): Promise<Cliente[]>;
    save(cliente: Cliente): Promise<void>;
    update(cliente: Cliente): Promise<void>;
    delete(id: number): Promise<void>;
}
