// src/application/ports/ContratoRepositoryPort.ts
import { Contrato } from "../../domain/entities/Contrato";

export interface ContratoRepositoryPort {
    saveContrato(contrato: Contrato): Promise<Contrato>;
    getContratoById(id: string): Promise<Contrato | null>;
    updateContrato(contrato: Contrato): Promise<Contrato>;
    deleteContrato(id: string): Promise<void>;
    createContrato(contrato: Contrato): Promise<Contrato>;
    getAllContratos(): Promise<Contrato[]>;
    getContratosBySolicitudFormalId(solicitudFormalId: number): Promise<Contrato[]>;
    getContratosByAnalistaId(analistaId: number): Promise<Contrato[]>;
    getContratosByComercianteId(comercianteId: number): Promise<Contrato[]>;
    getContratosByEstado(estado: string): Promise<Contrato[]>;
}
