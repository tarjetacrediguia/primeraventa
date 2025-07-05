"use strict";
// src/application/use-cases/SolicitudFormal/ConsultarEstadoDeSolicitudesFormalesUseCase.ts
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
exports.ConsultarEstadoDeSolicitudesFormalesUseCase = void 0;
/**
 * Caso de uso para consultar el estado de solicitudes formales pendientes.
 *
 * Esta clase implementa la lógica para obtener todas las solicitudes formales
 * que están en estado "pendiente", principalmente utilizada por analistas y
 * administradores para gestionar solicitudes que requieren revisión.
 */
class ConsultarEstadoDeSolicitudesFormalesUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la consulta de solicitudes formales pendientes.
     *
     * Este método obtiene todas las solicitudes formales que están en estado
     * "pendiente", facilitando el seguimiento de solicitudes que requieren
     * atención por parte de analistas o administradores.
     *
     * @returns Promise<SolicitudFormal[]> - Array con las solicitudes formales pendientes
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getSolicitudesFormalesByEstado("pendiente");
        });
    }
}
exports.ConsultarEstadoDeSolicitudesFormalesUseCase = ConsultarEstadoDeSolicitudesFormalesUseCase;
