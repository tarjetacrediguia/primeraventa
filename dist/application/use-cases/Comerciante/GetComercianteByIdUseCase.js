"use strict";
// src/application/use-cases/Comerciante/GetComercianteByIdUseCase.ts
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
exports.GetComercianteByIdUseCase = void 0;
/**
 * Caso de uso para obtener un comerciante por su identificador.
 *
 * Esta clase permite consultar los datos de un comerciante específico,
 * validando su existencia en el sistema.
 */
class GetComercianteByIdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la consulta de un comerciante por ID.
     *
     * @param id - Identificador único del comerciante
     * @returns Promise<Comerciante> - Comerciante encontrado
     * @throws Error si el comerciante no existe
     */
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comerciante = yield this.repository.getComercianteById(id);
            if (!comerciante) {
                throw new Error("Comerciante no encontrado");
            }
            return comerciante;
        });
    }
}
exports.GetComercianteByIdUseCase = GetComercianteByIdUseCase;
