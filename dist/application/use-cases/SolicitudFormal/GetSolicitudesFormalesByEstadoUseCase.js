"use strict";
//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByEstadoUseCase.ts
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
exports.GetSolicitudesFormalesByEstadoUseCase = void 0;
/**
 * Caso de uso para obtener solicitudes formales filtradas por estado.
 *
 * Esta clase implementa la lógica para recuperar solicitudes formales que tienen
 * un estado específico, útil para análisis de flujo de trabajo y gestión de solicitudes.
 */
class GetSolicitudesFormalesByEstadoUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la obtención de solicitudes formales por estado.
     *
     * Este método busca y retorna todas las solicitudes formales que tienen
     * el estado especificado (pendiente, aprobada, rechazada).
     *
     * @param estado - Estado de las solicitudes formales a filtrar
     * @returns Promise<SolicitudFormal[]> - Array con las solicitudes formales del estado especificado
     */
    execute(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getSolicitudesFormalesByEstado(estado);
        });
    }
}
exports.GetSolicitudesFormalesByEstadoUseCase = GetSolicitudesFormalesByEstadoUseCase;
