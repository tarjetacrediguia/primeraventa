"use strict";
// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByFechaUseCase.ts
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
exports.GetSolicitudesInicialesByFechaUseCase = void 0;
/**
 * Caso de uso para obtener solicitudes iniciales filtradas por fecha de creación.
 *
 * Esta clase implementa la lógica para recuperar solicitudes iniciales que fueron
 * creadas en una fecha específica, útil para reportes y análisis temporales.
 */
class GetSolicitudesInicialesByFechaUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la obtención de solicitudes iniciales por fecha de creación.
     *
     * Este método busca y retorna todas las solicitudes iniciales que fueron
     * creadas en la fecha especificada.
     *
     * @param fecha - Fecha de creación para filtrar las solicitudes iniciales
     * @returns Promise<SolicitudInicial[]> - Array con las solicitudes iniciales de la fecha especificada
     */
    execute(fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getSolicitudesInicialesByFecha(fecha);
        });
    }
}
exports.GetSolicitudesInicialesByFechaUseCase = GetSolicitudesInicialesByFechaUseCase;
