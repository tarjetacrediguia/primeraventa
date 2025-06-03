"use strict";
//src/infrastructure/adapters/authorization/AuthAdapter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdapter = void 0;
class AuthAdapter {
    generarToken(usuario) {
        throw new Error("Method not implemented.");
    }
    validarToken(token) {
        throw new Error("Method not implemented.");
    }
    login(email, password) {
        throw new Error("Method not implemented.");
    }
    logout(token) {
        throw new Error("Method not implemented.");
    }
    register(usuario) {
        throw new Error("Method not implemented.");
    }
    forgotPassword(email) {
        throw new Error("Method not implemented.");
    }
    resetPassword(token, newPassword) {
        throw new Error("Method not implemented.");
    }
    changePassword(usuarioId, oldPassword, newPassword) {
        throw new Error("Method not implemented.");
    }
}
exports.AuthAdapter = AuthAdapter;
