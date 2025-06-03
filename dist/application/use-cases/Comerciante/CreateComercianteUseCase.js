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
exports.CreateComercianteUseCase = void 0;
// src/application/use-cases/Comerciante/CreateComercianteUseCase.ts
const Comerciante_1 = require("../../../domain/entities/Comerciante");
class CreateComercianteUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(nombre_1, apellido_1, email_1, password_1, telefono_1, nombreComercio_1, cuil_1, direccionComercio_1) {
        return __awaiter(this, arguments, void 0, function* (nombre, apellido, email, password, telefono, nombreComercio, cuil, direccionComercio, permisos = []) {
            // Validaciones básicas
            if (!nombre || !apellido || !email || !password || !telefono || !nombreComercio || !cuil || !direccionComercio) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Validación de CUIL
            if (!this.validarCUIL(cuil)) {
                throw new Error("CUIL inválido");
            }
            // Verificar CUIL único
            const existeCuil = yield this.repository.findByCuil(cuil);
            if (existeCuil) {
                throw new Error("Ya existe un comerciante con este CUIL");
            }
            // Crear instancia de Comerciante
            const comerciante = new Comerciante_1.Comerciante("", // ID temporal
            nombre, apellido, email, password, telefono, nombreComercio, cuil, direccionComercio, permisos);
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
