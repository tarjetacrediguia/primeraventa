"use strict";
//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByIdUseCase.ts
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
exports.GetSolicitudesFormalesByIdUseCase = void 0;
/**
 * Caso de uso para obtener una solicitud formal específica por su ID.
 *
 * Esta clase implementa la lógica para recuperar una solicitud formal específica
 * del sistema, permitiendo acceder a todos sus detalles y estado actual.
 */
class GetSolicitudesFormalesByIdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la obtención de una solicitud formal por su ID.
     *
     * Este método busca y retorna una solicitud formal específica basándose
     * en su identificador único.
     *
     * @param id - ID único de la solicitud formal a obtener
     * @returns Promise<SolicitudFormal | null> - La solicitud formal encontrada o null si no existe
     */
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getSolicitudFormalById(id);
        });
    }
}
exports.GetSolicitudesFormalesByIdUseCase = GetSolicitudesFormalesByIdUseCase;
