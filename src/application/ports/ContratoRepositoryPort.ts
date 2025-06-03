// src/application/ports/ContratoRepositoryPort.ts
import { Contrato } from "../../domain/entities/Contrato";

export interface ContratoRepositoryPort {
    saveContrato(contrato: Contrato): Promise<Contrato>;
    getContratoById(id: string): Promise<Contrato | null>;
    updateContrato(contrato: Contrato): Promise<Contrato>;
    deleteContrato(id: string): Promise<void>;
    createContrato(contrato: Contrato): Promise<Contrato>;
    getAllContratos(): Promise<Contrato[]>;
    getContratosBySolicitudFormalId(solicitudFormalId: string): Promise<Contrato[]>;
    getContratosByAnalistaId(analistaId: string): Promise<Contrato[]>;
    getContratosByComercianteId(comercianteId: string): Promise<Contrato[]>;
    getContratosByEstado(estado: string): Promise<Contrato[]>;
}