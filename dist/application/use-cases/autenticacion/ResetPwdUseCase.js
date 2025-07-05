"use strict";
// src/application/use-cases/autenticacion/ResetPwdUseCase.ts
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
exports.ResetPwdUseCase = void 0;
/**
 * Caso de uso para el restablecimiento de contraseña de usuario.
 *
 * Esta clase permite validar el token y la nueva contraseña,
 * y delega el cambio al puerto de autenticación.
 */
class ResetPwdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param authPort - Puerto de autenticación
     */
    constructor(authPort) {
        this.authPort = authPort;
    }
    /**
     * Ejecuta el proceso de restablecimiento de contraseña.
     *
     * @param token - Token de restablecimiento de contraseña
     * @param newPassword - Nueva contraseña a establecer
     * @returns Promise<void>
     * @throws Error si faltan datos o la contraseña no cumple requisitos
     */
    execute(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!token || !newPassword) {
                throw new Error("Token y nueva contraseña son obligatorios");
            }
            if (newPassword.length < 8) {
                throw new Error("La contraseña debe tener al menos 8 caracteres");
            }
            yield this.authPort.resetPassword(token, newPassword);
        });
    }
}
exports.ResetPwdUseCase = ResetPwdUseCase;
