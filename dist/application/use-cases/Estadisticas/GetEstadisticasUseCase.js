"use strict";
//src/application/use-cases/Estadisticas/GetEstadisticasUseCase.ts
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
exports.GetEstadisticasUseCase = void 0;
/**
 * Caso de uso para obtener estadísticas generales del sistema.
 *
 * Esta clase implementa la lógica para consultar información consolidada de estadísticas
 * generales, útil para dashboards y reportes ejecutivos.
 */
class GetEstadisticasUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de estadísticas
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la consulta de estadísticas generales del sistema.
     *
     * Este método retorna información consolidada de estadísticas generales.
     *
     * @returns Promise<any> - Estadísticas generales del sistema
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Cambiar por el método correcto del repositorio si existe
            // return this.repository.getEstadisticasGenerales();
            throw new Error('Método getEstadisticas no implementado en el repositorio');
        });
    }
}
exports.GetEstadisticasUseCase = GetEstadisticasUseCase;
