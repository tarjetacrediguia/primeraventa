"use strict";
// src/application/use-cases/SolicitudInicial/ListSolicitudesInicialesUseCase.ts
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
exports.ListSolicitudesInicialesUseCase = void 0;
/**
 * Caso de uso para listar todas las solicitudes iniciales del sistema.
 *
 * Esta clase implementa la lógica para obtener la lista completa de solicitudes
 * iniciales, principalmente utilizada por administradores y analistas para
 * tener una visión general de todas las solicitudes en el sistema.
 */
class ListSolicitudesInicialesUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la obtención de todas las solicitudes iniciales.
     *
     * Este método retorna todas las solicitudes iniciales almacenadas en el sistema
     * sin aplicar filtros específicos.
     *
     * @returns Promise<SolicitudInicial[]> - Array con todas las solicitudes iniciales del sistema
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getAllSolicitudesIniciales();
        });
    }
}
exports.ListSolicitudesInicialesUseCase = ListSolicitudesInicialesUseCase;
