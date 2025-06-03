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
exports.resetPassword = exports.logout = exports.login = void 0;
const LoginUseCase_1 = require("../../../application/use-cases/autenticacion/LoginUseCase");
const LogOutUseCase_1 = require("../../../application/use-cases/autenticacion/LogOutUseCase");
const ResetPwdUseCase_1 = require("../../../application/use-cases/autenticacion/ResetPwdUseCase");
const AuthAdapter_1 = require("../../adapters/authorization/AuthAdapter");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log('Datos de login:', { email, password });
        const authRepository = new AuthAdapter_1.AuthAdapter();
        const useCase = new LoginUseCase_1.LoginUseCase(authRepository);
        const result = yield useCase.execute(email, password);
        res.status(200).json({
            token: result.token,
            user: {
                id: result.usuario.getId(),
                nombre: result.usuario.getNombre(),
                apellido: result.usuario.getApellido(),
                email: result.usuario.getEmail(),
                rol: result.rol // Usamos el rol que devuelve el caso de uso
            }
        });
    }
    catch (error) {
        if (error.message === 'Credenciales inválidas') {
            res.status(401).json({ error: error.message });
        }
        else if (error.message === 'Email y contraseña son obligatorios') {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
        const authRepository = new AuthAdapter_1.AuthAdapter();
        const useCase = new LogOutUseCase_1.LogOutUseCase(authRepository);
        yield useCase.execute(token);
        res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    }
    catch (error) {
        if (error.message === 'Token es requerido para cerrar sesión') {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
});
exports.logout = logout;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = req.body;
        const authRepository = new AuthAdapter_1.AuthAdapter();
        const useCase = new ResetPwdUseCase_1.ResetPwdUseCase(authRepository);
        yield useCase.execute(token, newPassword);
        res.status(200).json({
            message: 'Contraseña restablecida exitosamente'
        });
    }
    catch (error) {
        if (error.message === 'Token y nueva contraseña son obligatorios') {
            res.status(400).json({ error: error.message });
        }
        else if (error.message === 'La contraseña debe tener al menos 8 caracteres') {
            res.status(400).json({ error: error.message });
        }
        else if (error.message === 'Token inválido o expirado') {
            res.status(401).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
});
exports.resetPassword = resetPassword;
