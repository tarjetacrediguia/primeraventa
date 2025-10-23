// src/application/ports/TasasRepositoryPort.ts

import { ConjuntoTasas } from "../../domain/entities/ConjuntoTasas";

export interface TasasRepositoryPort {
    createConjuntoTasas(conjunto: ConjuntoTasas): Promise<ConjuntoTasas>;
    updateConjuntoTasas(conjunto: ConjuntoTasas): Promise<ConjuntoTasas>;
    deleteConjuntoTasas(id: number): Promise<void>;
    findConjuntoTasasById(id: number): Promise<ConjuntoTasas | null>;
    findAllConjuntosTasas(): Promise<ConjuntoTasas[]>;
    activateConjuntoTasas(id: number): Promise<void>;
    deactivateOtherConjuntos(exceptId: number): Promise<void>;
    
    // Métodos para manejar tasas dentro del conjunto
    agregarTasaAConjunto(conjuntoId: number, codigo: string, valor: number, descripcion?: string): Promise<void>;
    actualizarTasaEnConjunto(conjuntoId: number, codigo: string, nuevoValor: number, nuevaDescripcion?: string): Promise<void>;
    eliminarTasaDeConjunto(conjuntoId: number, codigo: string): Promise<void>;
    findTasaActivaByCodigo(codigo: string): Promise<{ valor: number; descripcion: string } | null>;
}