// src/application/ports/ReferenteRepositoryPort.ts
import { Referente } from "../../domain/entities/Referente";

export interface ReferenteRepositoryPort {
    saveReferente(referente: Referente): Promise<Referente>;
    getReferenteById(id: number): Promise<Referente | null>;
    updateReferente(referente: Referente): Promise<Referente>;
    deleteReferente(id: number): Promise<void>;
    getAllReferentes(): Promise<Referente[]>;
    getReferentesBySolicitudFormalId(solicitudFormalId: number): Promise<Referente[]>;
    getReferentesByTelefono(telefono: string): Promise<Referente[]>;
}
