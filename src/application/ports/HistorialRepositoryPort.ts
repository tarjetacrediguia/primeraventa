//src/application/ports/HistorialRepositoryPort.ts

import { Historial } from "../../domain/entities/Historial";


export interface HistorialRepositoryPort {
    registrarEvento(historialData: Omit<Historial, 'id' | 'fechaHora' | 'toPlainObject'>): Promise<Historial>;
    obtenerPorSolicitudInicial(solicitudInicialId: number): Promise<Historial[]>;
}
