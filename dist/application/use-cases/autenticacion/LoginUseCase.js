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
exports.LoginUseCase = void 0;
const Administrador_1 = require("../../../domain/entities/Administrador");
const Analista_1 = require("../../../domain/entities/Analista");
const Comerciante_1 = require("../../../domain/entities/Comerciante");
class LoginUseCase {
    constructor(authPort) {
        this.authPort = authPort;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!email || !password) {
                throw new Error("Email y contraseña son obligatorios");
            }
            // Autenticar al usuario
            const result = yield this.authPort.login(email, password);
            // Determinar el rol del usuario
            let rol = "usuario";
            if (result.usuario instanceof Administrador_1.Administrador)
                rol = "administrador";
            else if (result.usuario instanceof Analista_1.Analista)
                rol = "analista";
            else if (result.usuario instanceof Comerciante_1.Comerciante)
                rol = "comerciante";
            // Agregar otros roles según sea necesario
            return {
                usuario: result.usuario,
                token: result.token,
                rol
            };
        });
    }
}
exports.LoginUseCase = LoginUseCase;
