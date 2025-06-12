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
exports.CreateAnalistaUseCase = void 0;
// src/application/use-cases/Analista/CreateAnalistaUseCase.ts
const Analista_1 = require("../../../domain/entities/Analista");
class CreateAnalistaUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(nombre, apellido, email, password, telefono, permisos) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!nombre || !apellido || !email || !password || !telefono) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Crear instancia de Analista
            const analista = new Analista_1.Analista(0, // ID temporal (se asignará al guardar)
            nombre, apellido, email, password, telefono, permisos);
            // Guardar en el repositorio
            return this.repository.saveAnalista(analista);
        });
    }
}
exports.CreateAnalistaUseCase = CreateAnalistaUseCase;
