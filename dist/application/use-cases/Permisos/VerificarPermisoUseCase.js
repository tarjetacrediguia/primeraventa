"use strict";
// src/application/use-cases/Permisos/VerificarPermisoUseCase.ts
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
exports.VerificarPermisoUseCase = void 0;
/**
 * Caso de uso para verificar si un usuario tiene un permiso específico.
 *
 * Esta clase implementa la lógica para consultar si un usuario posee un permiso
 * determinado, útil para validaciones de acceso y control de privilegios.
 */
class VerificarPermisoUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la verificación de permiso para un usuario.
     *
     * Este método valida la existencia de los datos y consulta si el usuario
     * tiene el permiso solicitado.
     *
     * @param usuarioId - ID del usuario a verificar
     * @param permiso - Nombre del permiso a verificar
     * @returns Promise<boolean> - true si el usuario tiene el permiso, false en caso contrario
     * @throws Error - Si faltan datos obligatorios
     */
    execute(usuarioId, permiso) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!usuarioId || !permiso) {
                throw new Error("Usuario y permiso son obligatorios");
            }
            return this.repository.usuarioTienePermiso(usuarioId, permiso);
        });
    }
}
exports.VerificarPermisoUseCase = VerificarPermisoUseCase;
