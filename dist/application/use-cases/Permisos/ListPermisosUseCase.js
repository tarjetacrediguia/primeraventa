"use strict";
// src/application/use-cases/Permisos/ListPermisosUseCase.ts
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
exports.ListPermisosUseCase = void 0;
/**
 * Caso de uso para listar todos los permisos del sistema.
 *
 * Esta clase implementa la lógica para obtener la lista completa de permisos,
 * útil para administración, gestión de roles y asignación de privilegios.
 */
class ListPermisosUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la obtención de todos los permisos del sistema.
     *
     * Este método retorna la lista completa de permisos registrados en el sistema.
     *
     * @returns Promise<Permiso[]> - Array con todos los permisos existentes
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const permisos = yield this.repository.getAllPermisos();
            return permisos;
        });
    }
}
exports.ListPermisosUseCase = ListPermisosUseCase;
