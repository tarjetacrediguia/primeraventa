"use strict";
// src/application/use-cases/Permisos/AsignarPermisoUseCase.ts
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
exports.AsignarPermisoUseCase = void 0;
/**
 * Caso de uso para asignar permisos a un usuario.
 *
 * Esta clase implementa la lógica para validar y asignar uno o varios permisos
 * a un usuario, asegurando que los permisos existan en el sistema.
 */
class AsignarPermisoUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la asignación de permisos a un usuario.
     *
     * Este método valida que el usuario y los permisos existan, verifica que los
     * permisos a asignar sean válidos y realiza la asignación.
     *
     * @param usuarioId - ID del usuario al que se le asignarán los permisos
     * @param permisos - Array de nombres de permisos a asignar
     * @returns Promise<Usuario> - El usuario con los permisos asignados
     * @throws Error - Si faltan datos o hay permisos inválidos
     */
    execute(usuarioId, permisos // Ahora solo nombres de permisos
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!usuarioId || !permisos || permisos.length === 0) {
                throw new Error("Usuario y permisos son obligatorios");
            }
            // Obtener todos los permisos válidos del sistema
            const permisosValidos = yield this.repository.getAllPermisos();
            // Extraer solo los nombres de los permisos válidos
            const nombresPermisosValidos = permisosValidos.map(p => p.nombre);
            // Verificar que todos los permisos a asignar sean válidos
            const permisosInvalidos = permisos.filter(p => !nombresPermisosValidos.includes(p));
            if (permisosInvalidos.length > 0) {
                throw new Error(`Permisos inválidos: ${permisosInvalidos.join(', ')}`);
            }
            return this.repository.asignarPermisos(usuarioId, permisos);
        });
    }
}
exports.AsignarPermisoUseCase = AsignarPermisoUseCase;
