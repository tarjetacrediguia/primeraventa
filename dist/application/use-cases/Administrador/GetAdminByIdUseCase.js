"use strict";
// src/application/use-cases/Administrador/GetAdminByIdUseCase.ts
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
exports.GetAdminByIdUseCase = void 0;
/**
 * Caso de uso para obtener un administrador por su identificador.
 *
 * Esta clase permite consultar los datos de un administrador específico,
 * validando su existencia en el sistema.
 */
class GetAdminByIdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de administradores
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la consulta de un administrador por ID.
     *
     * @param id - Identificador único del administrador
     * @returns Promise<Administrador> - Administrador encontrado
     * @throws Error si el administrador no existe
     */
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const administrador = yield this.repository.getAdministradorById(id);
            if (!administrador) {
                throw new Error("Administrador no encontrado");
            }
            return administrador;
        });
    }
}
exports.GetAdminByIdUseCase = GetAdminByIdUseCase;
