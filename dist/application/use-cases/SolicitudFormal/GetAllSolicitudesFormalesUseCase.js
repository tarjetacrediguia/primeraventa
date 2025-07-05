"use strict";
//src/application/use-cases/SolicitudFormal/GetAllSolicitudesFormalesUseCase.ts
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
exports.GetAllSolicitudesFormalesUseCase = void 0;
/**
 * Caso de uso para obtener todas las solicitudes formales del sistema.
 *
 * Esta clase implementa la lógica para obtener la lista completa de solicitudes
 * formales, principalmente utilizada por administradores y analistas para
 * tener una visión general de todas las solicitudes formales en el sistema.
 */
class GetAllSolicitudesFormalesUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la obtención de todas las solicitudes formales.
     *
     * Este método retorna todas las solicitudes formales almacenadas en el sistema
     * sin aplicar filtros específicos.
     *
     * @returns Promise<SolicitudFormal[]> - Array con todas las solicitudes formales del sistema
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getAllSolicitudesFormales();
        });
    }
}
exports.GetAllSolicitudesFormalesUseCase = GetAllSolicitudesFormalesUseCase;
