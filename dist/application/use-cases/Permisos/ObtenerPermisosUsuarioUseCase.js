"use strict";
// src/application/use-cases/Permisos/ObtenerPermisosUsuarioUseCase.ts
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
exports.ObtenerPermisosUsuarioUseCase = void 0;
/**
 * Caso de uso para obtener los permisos de un usuario específico.
 *
 * Esta clase implementa la lógica para recuperar todos los permisos asignados
 * a un usuario, permitiendo conocer sus privilegios en el sistema.
 */
class ObtenerPermisosUsuarioUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la obtención de permisos de un usuario.
     *
     * Este método valida la existencia del usuario y retorna todos los permisos
     * que tiene asignados.
     *
     * @param usuarioId - ID del usuario cuyos permisos se quieren obtener
     * @returns Promise<Permiso[]> - Array con los permisos asignados al usuario
     * @throws Error - Si el usuario no es válido
     */
    execute(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!usuarioId) {
                throw new Error("Usuario es obligatorio");
            }
            return this.repository.getPermisosUsuario(usuarioId);
        });
    }
}
exports.ObtenerPermisosUsuarioUseCase = ObtenerPermisosUsuarioUseCase;
