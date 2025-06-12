"use strict";
//src/infrastructure/adapters/repository/AnalistaRepositoryAdapter.ts
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
exports.AnalistaRepositoryAdapter = void 0;
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
class AnalistaRepositoryAdapter {
    obtenerIdsAnalistasActivos() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id 
            FROM usuarios 
            WHERE rol = 'analista' 
              AND activo = true
        `;
            const result = yield DatabaseDonfig_1.pool.query(query);
            return result.rows.map(row => row.id);
        });
    }
    findByEmail(email) {
        throw new Error("Method not implemented.");
    }
    saveAnalista(analista) {
        throw new Error("Method not implemented.");
    }
    getAnalistaById(id) {
        throw new Error("Method not implemented.");
    }
    updateAnalista(analista) {
        throw new Error("Method not implemented.");
    }
    deleteAnalista(id) {
        throw new Error("Method not implemented.");
    }
    getAllAnalistas() {
        throw new Error("Method not implemented.");
    }
}
exports.AnalistaRepositoryAdapter = AnalistaRepositoryAdapter;
