"use strict";
// src/application/use-cases/Comerciante/GetAllComercianteUseCase.ts
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
exports.GetAllComercianteUseCase = void 0;
/**
 * Caso de uso para obtener el listado de todos los comerciantes.
 *
 * Esta clase permite consultar y retornar todos los comerciantes registrados
 * en el sistema.
 */
class GetAllComercianteUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la consulta de todos los comerciantes.
     *
     * @returns Promise<Comerciante[]> - Listado de comerciantes registrados
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getAllComerciantes();
        });
    }
}
exports.GetAllComercianteUseCase = GetAllComercianteUseCase;
