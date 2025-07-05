"use strict";
// src/application/use-cases/Comerciante/DeleteComercianteUseCase.ts
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
exports.DeleteComercianteUseCase = void 0;
/**
 * Caso de uso para eliminar un comerciante existente.
 *
 * Esta clase permite eliminar un comerciante del sistema,
 * validando previamente su existencia.
 */
class DeleteComercianteUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la eliminación de un comerciante.
     *
     * @param id - Identificador único del comerciante a eliminar
     * @returns Promise<void>
     * @throws Error si el comerciante no existe
     */
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar existencia
            const existe = yield this.repository.getComercianteById(id);
            if (!existe) {
                throw new Error("Comerciante no encontrado");
            }
            return this.repository.deleteComerciante(id);
        });
    }
}
exports.DeleteComercianteUseCase = DeleteComercianteUseCase;
