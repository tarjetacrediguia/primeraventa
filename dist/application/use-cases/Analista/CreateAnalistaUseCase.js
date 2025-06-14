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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAnalistaUseCase = void 0;
// src/application/use-cases/Analista/CreateAnalistaUseCase.ts
const Analista_1 = require("../../../domain/entities/Analista");
const bcrypt_1 = __importDefault(require("bcrypt"));
class CreateAnalistaUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(nombre, apellido, email, password, telefono) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!nombre || !apellido || !email || !password || !telefono) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Encriptar contraseña
            const saltRounds = 10;
            const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
            // Crear instancia de Analista (el id se generará en el repositorio)
            const analista = new Analista_1.Analista(0, // ID temporal (se asignará al guardar)
            nombre, apellido, email, passwordHash, telefono);
            // Guardar en el repositorio
            return this.repository.saveAnalista(analista);
        });
    }
}
exports.CreateAnalistaUseCase = CreateAnalistaUseCase;
