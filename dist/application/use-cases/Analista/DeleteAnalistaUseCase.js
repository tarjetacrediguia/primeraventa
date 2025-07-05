"use strict";
// src/application/use-cases/Analista/DeleteAnalistaUseCase.ts
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
exports.DeleteAnalistaUseCase = void 0;
/**
 * Caso de uso para eliminar un analista existente.
 *
 * Esta clase permite eliminar un analista del sistema,
 * validando previamente su existencia.
 */
class DeleteAnalistaUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de analistas
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la eliminación de un analista.
     *
     * @param id - Identificador único del analista a eliminar
     * @returns Promise<void>
     * @throws Error si el analista no existe
     */
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar existencia
            const existe = yield this.repository.getAnalistaById(id);
            if (!existe) {
                throw new Error("Analista no encontrado");
            }
            return this.repository.deleteAnalista(id);
        });
    }
}
exports.DeleteAnalistaUseCase = DeleteAnalistaUseCase;
