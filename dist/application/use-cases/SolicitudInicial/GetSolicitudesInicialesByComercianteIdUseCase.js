"use strict";
// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByComercianteIdUseCase.ts
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
exports.GetSolicitudesInicialesByComercianteIdUseCase = void 0;
/**
 * Caso de uso para obtener solicitudes iniciales de un comerciante específico.
 *
 * Esta clase implementa la lógica para recuperar todas las solicitudes iniciales
 * que fueron creadas por un comerciante específico, permitiendo que cada comerciante
 * gestione sus propias solicitudes.
 */
class GetSolicitudesInicialesByComercianteIdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la obtención de solicitudes iniciales por comerciante.
     *
     * Este método busca y retorna todas las solicitudes iniciales que fueron
     * creadas por el comerciante especificado.
     *
     * @param comercianteId - ID del comerciante cuyas solicitudes se quieren obtener
     * @returns Promise<SolicitudInicial[]> - Array con las solicitudes iniciales del comerciante
     */
    execute(comercianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getSolicitudesInicialesByComercianteId(comercianteId);
        });
    }
}
exports.GetSolicitudesInicialesByComercianteIdUseCase = GetSolicitudesInicialesByComercianteIdUseCase;
