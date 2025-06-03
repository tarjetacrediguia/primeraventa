// src/application/ports/ReferenteRepositoryPort.ts
import { Referente } from "../../domain/entities/Referente";

export interface ReferenteRepositoryPort {
    saveReferente(referente: Referente): Promise<Referente>;
    getReferenteById(id: string): Promise<Referente | null>;
    updateReferente(referente: Referente): Promise<Referente>;
    deleteReferente(id: string): Promise<void>;
    getAllReferentes(): Promise<Referente[]>;
    getReferentesBySolicitudFormalId(solicitudFormalId: string): Promise<Referente[]>;
    getReferentesByTelefono(telefono: string): Promise<Referente[]>;
}