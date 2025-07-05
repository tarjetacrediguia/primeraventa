"use strict";
// src/application/use-cases/autenticacion/LogOutUseCase.ts
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
exports.LogOutUseCase = void 0;
/**
 * Caso de uso para el cierre de sesión de usuarios.
 *
 * Esta clase permite invalidar el token de sesión de un usuario,
 * cerrando su sesión en el sistema.
 */
class LogOutUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param authPort - Puerto de autenticación
     */
    constructor(authPort) {
        this.authPort = authPort;
    }
    /**
     * Ejecuta el proceso de logout de usuario.
     *
     * @param token - Token de autenticación a invalidar
     * @returns Promise<void>
     * @throws Error si no se proporciona el token
     */
    execute(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new Error("Token es requerido para cerrar sesión");
            }
            yield this.authPort.logout(token);
        });
    }
}
exports.LogOutUseCase = LogOutUseCase;
