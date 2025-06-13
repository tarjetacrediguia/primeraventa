// src/application/ports/ConfiguracionRepositoryPort.ts
import { Configuracion } from "../../domain/entities/Configuracion";

export interface ConfiguracionRepositoryPort {
    obtenerDiasExpiracion(): Promise<number>;
    obtenerConfiguracion(): Promise<Configuracion[]>;
    actualizarConfiguracion(clave: string, valor: any): Promise<Configuracion>;
    crearConfiguracion(configuracion: Configuracion): Promise<Configuracion>;
}