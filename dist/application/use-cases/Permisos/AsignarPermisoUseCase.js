"use strict";
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
class AsignarPermisoUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(usuarioId, permisos) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!usuarioId || !permisos || permisos.length === 0) {
                throw new Error("Usuario y permisos son obligatorios");
            }
            // Obtener todos los permisos válidos del sistema
            const permisosValidos = yield this.repository.getAllPermisos();
            // Verificar que todos los permisos a asignar sean válidos
            const permisosInvalidos = permisos.filter(p => !permisosValidos.includes(p));
            if (permisosInvalidos.length > 0) {
                throw new Error(`Permisos inválidos: ${permisosInvalidos.join(', ')}`);
            }
            return this.repository.asignarPermisos(usuarioId, permisos);
        });
    }
}
exports.AsignarPermisoUseCase = AsignarPermisoUseCase;
