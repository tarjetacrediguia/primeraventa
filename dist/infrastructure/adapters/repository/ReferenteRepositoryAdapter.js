"use strict";
// src/infrastructure/adapters/repository/ReferenteRepositoryAdapter.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenteRepositoryAdapter = void 0;
const Referente_1 = require("../../../domain/entities/Referente");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
class ReferenteRepositoryAdapter {
    /**
     * Guarda un nuevo referente en la base de datos.
     * @param referente - Objeto Referente a guardar.
     * @returns Promise<Referente> - El referente guardado con su ID asignado.
     */
    saveReferente(referente) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                const result = yield client.query(`INSERT INTO referentes (nombre_completo, apellido, vinculo, telefono)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, nombre_completo, apellido, vinculo, telefono`, [
                    referente.getNombreCompleto(),
                    referente.getApellido(),
                    referente.getVinculo(),
                    referente.getTelefono()
                ]);
                const savedData = result.rows[0];
                return this.mapToReferente(savedData);
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Obtiene un referente por su ID.
     * @param id - ID del referente a buscar.
     * @returns Promise<Referente | null> - El referente encontrado o null si no existe.
     */
    getReferenteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                const result = yield client.query(`SELECT id, nombre_completo, apellido, vinculo, telefono 
                 FROM referentes 
                 WHERE id = $1`, [id]);
                if (result.rows.length === 0) {
                    return null;
                }
                return this.mapToReferente(result.rows[0]);
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Actualiza los datos de un referente existente.
     * @param referente - Objeto Referente con los datos actualizados.
     * @returns Promise<Referente> - El referente actualizado.
     */
    updateReferente(referente) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = referente.getId();
            if (!id) {
                throw new Error("Referente no tiene ID; no se puede actualizar");
            }
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query(`UPDATE referentes 
                 SET nombre_completo = $1, apellido = $2, vinculo = $3, telefono = $4
                 WHERE id = $5`, [
                    referente.getNombreCompleto(),
                    referente.getApellido(),
                    referente.getVinculo(),
                    referente.getTelefono(),
                    id
                ]);
                // Devolver el referente actualizado
                return yield this.getReferenteById(id);
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Elimina un referente por su ID.
     * @param id - ID del referente a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    deleteReferente(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('DELETE FROM referentes WHERE id = $1', [id]);
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Obtiene todos los referentes del sistema.
     * @returns Promise<Referente[]> - Array de todos los referentes.
     */
    getAllReferentes() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                const result = yield client.query('SELECT id, nombre_completo, apellido, vinculo, telefono FROM referentes');
                return result.rows.map((row) => this.mapToReferente(row));
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Obtiene los referentes asociados a una solicitud formal.
     * @param solicitudFormalId - ID de la solicitud formal.
     * @returns Promise<Referente[]> - Array de referentes asociados a la solicitud.
     */
    getReferentesBySolicitudFormalId(solicitudFormalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                const result = yield client.query(`SELECT r.id, r.nombre_completo, r.apellido, r.vinculo, r.telefono
                 FROM referentes r
                 JOIN solicitud_referente sr ON r.id = sr.referente_id
                 WHERE sr.solicitud_formal_id = $1
                 ORDER BY sr.orden`, [solicitudFormalId]);
                return result.rows.map((row) => this.mapToReferente(row));
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Obtiene los referentes por número de teléfono.
     * @param telefono - Teléfono del referente a buscar.
     * @returns Promise<Referente[]> - Array de referentes con ese teléfono.
     */
    getReferentesByTelefono(telefono) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                const result = yield client.query(`SELECT id, nombre_completo, apellido, vinculo, telefono 
                 FROM referentes 
                 WHERE telefono = $1`, [telefono]);
                return result.rows.map((row) => this.mapToReferente(row));
            }
            finally {
                client.release();
            }
        });
    }
    // Método auxiliar para mapear filas de la base de datos a objetos Referente
    mapToReferente(row) {
        const referente = new Referente_1.Referente(row.nombre_completo, row.apellido, row.vinculo, row.telefono);
        // Asignar el ID usando reflexión (alternativa segura)
        if (typeof referente['setId'] === 'function') {
            referente['setId'](row.id.toString());
        }
        else if (typeof referente['id'] === 'undefined') {
            // Asignación directa solo si la propiedad existe
            referente['id'] = row.id.toString();
        }
        return referente;
    }
}
exports.ReferenteRepositoryAdapter = ReferenteRepositoryAdapter;
