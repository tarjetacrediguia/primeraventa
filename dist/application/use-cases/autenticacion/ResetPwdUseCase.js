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
exports.ResetPwdUseCase = void 0;
class ResetPwdUseCase {
    constructor(authPort) {
        this.authPort = authPort;
    }
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
