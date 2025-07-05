"use strict";
// src/application/use-cases/Configuraciones/GetConfUseCase.ts
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
exports.GetConfUseCase = void 0;
/**
 * Caso de uso para obtener las configuraciones del sistema.
 *
 * Esta clase permite consultar todas las configuraciones globales
 * almacenadas en el sistema.
 */
class GetConfUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de configuración
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la consulta de todas las configuraciones.
     *
     * @returns Promise<Configuracion[]> - Listado de configuraciones registradas
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.obtenerConfiguracion();
        });
    }
}
exports.GetConfUseCase = GetConfUseCase;
