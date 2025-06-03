//src/infrastructure/adapters/repository/ContratoRepositoryAdapter.ts

import { ContratoRepositoryPort } from "../../../application/ports/ContratoRepositoryPort";
import { Contrato } from "../../../domain/entities/Contrato";

export class ContratoRepositoryAdapter implements ContratoRepositoryPort {
    saveContrato(contrato: Contrato): Promise<Contrato> {
        throw new Error("Method not implemented.");
    }
    getContratoById(id: string): Promise<Contrato | null> {
        throw new Error("Method not implemented.");
    }
    updateContrato(contrato: Contrato): Promise<Contrato> {
        throw new Error("Method not implemented.");
    }
    deleteContrato(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createContrato(contrato: Contrato): Promise<Contrato> {
        throw new Error("Method not implemented.");
    }
    getAllContratos(): Promise<Contrato[]> {
        throw new Error("Method not implemented.");
    }
    getContratosBySolicitudFormalId(solicitudFormalId: string): Promise<Contrato[]> {
        throw new Error("Method not implemented.");
    }
    getContratosByAnalistaId(analistaId: string): Promise<Contrato[]> {
        throw new Error("Method not implemented.");
    }
    getContratosByComercianteId(comercianteId: string): Promise<Contrato[]> {
        throw new Error("Method not implemented.");
    }
    getContratosByEstado(estado: string): Promise<Contrato[]> {
        throw new Error("Method not implemented.");
    }
 
}