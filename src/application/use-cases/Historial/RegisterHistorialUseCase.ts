//src/application/use-cases/Historial/RegisterHistorialUseCase.ts

import { Historial } from "../../../domain/entities/Historial";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";

export class RegisterHistorialUseCase {
    constructor(private readonly historialRepository: HistorialRepositoryPort) {}

    async execute(
        usuarioId: number | null,
        accion: string,
        entidadAfectada: string,
        entidadId: number,
        detalles: any,
    ): Promise<Historial> {
        const historialData = {
            usuarioId,
            accion,
            entidadAfectada,
            entidadId,
            detalles
        } as Omit<Historial, 'id'>;

        return this.historialRepository.registrarEvento(historialData);
    }
}
