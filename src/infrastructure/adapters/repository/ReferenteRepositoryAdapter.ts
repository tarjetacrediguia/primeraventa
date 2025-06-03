//src/infrastructure/adapters/repository/ReferenteRepositoryAdapter.ts

import { ReferenteRepositoryPort } from "../../../application/ports/ReferenteRepositoryPort";
import { Referente } from "../../../domain/entities/Referente";

export class ReferenteRepositoryAdapter implements ReferenteRepositoryPort {
    saveReferente(referente: Referente): Promise<Referente> {
        throw new Error("Method not implemented.");
    }
    getReferenteById(id: string): Promise<Referente | null> {
        throw new Error("Method not implemented.");
    }
    updateReferente(referente: Referente): Promise<Referente> {
        throw new Error("Method not implemented.");
    }
    deleteReferente(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAllReferentes(): Promise<Referente[]> {
        throw new Error("Method not implemented.");
    }
    getReferentesBySolicitudFormalId(solicitudFormalId: string): Promise<Referente[]> {
        throw new Error("Method not implemented.");
    }
    getReferentesByTelefono(telefono: string): Promise<Referente[]> {
        throw new Error("Method not implemented.");
    }
    
}