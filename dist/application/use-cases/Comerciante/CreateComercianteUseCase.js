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
exports.CreateComercianteUseCase = void 0;
// src/application/use-cases/Comerciante/CreateComercianteUseCase.ts
const Comerciante_1 = require("../../../domain/entities/Comerciante");
const bcrypt_1 = __importDefault(require("bcrypt"));
class CreateComercianteUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(nombre, apellido, email, password, telefono, nombreComercio, cuil, direccionComercio) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!nombre || !apellido || !email || !password || !telefono || !nombreComercio || !cuil || !direccionComercio) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Encriptar contraseña
            const saltRounds = 10;
            const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
            // Validación de CUIL
            /*
            if (!this.validarCUIL(cuil)) {
                throw new Error("CUIL inválido");
            }
    */
            // Verificar CUIL único
            const existeCuil = yield this.repository.findByCuil(cuil);
            if (existeCuil) {
                throw new Error("Ya existe un comerciante con este CUIL");
            }
            // Crear instancia de Comerciante
            const comerciante = new Comerciante_1.Comerciante(0, // ID temporal
            nombre, apellido, email, passwordHash, telefono, nombreComercio, cuil, direccionComercio);
            // Guardar en el repositorio
            return this.repository.saveComerciante(comerciante);
        });
    }
    validarCUIL(cuil) {
        // Implementación básica de validación de CUIL
        // Debería implementarse una validación real según normas argentinas
        return /^\d{2}-\d{8}-\d{1}$/.test(cuil);
    }
}
exports.CreateComercianteUseCase = CreateComercianteUseCase;
