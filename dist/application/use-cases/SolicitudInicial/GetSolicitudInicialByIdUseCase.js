"use strict";
// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByIdUseCase.ts
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
exports.GetSolicitudesInicialesByIdUseCase = void 0;
/**
 * Caso de uso para obtener una solicitud inicial específica por su ID.
 *
 * Esta clase implementa la lógica para recuperar una solicitud inicial específica
 * del sistema, permitiendo acceder a todos sus detalles y estado actual.
 */
class GetSolicitudesInicialesByIdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la obtención de una solicitud inicial por su ID.
     *
     * Este método busca y retorna una solicitud inicial específica basándose
     * en su identificador único.
     *
     * @param id - ID único de la solicitud inicial a obtener
     * @returns Promise<SolicitudInicial | null> - La solicitud inicial encontrada o null si no existe
     */
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getSolicitudInicialById(id);
        });
    }
}
exports.GetSolicitudesInicialesByIdUseCase = GetSolicitudesInicialesByIdUseCase;
