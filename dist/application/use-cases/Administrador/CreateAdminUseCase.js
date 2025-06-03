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
exports.CreateAdminUseCase = void 0;
// src/application/use-cases/Administrador/CreateAdminUseCase.ts
const Administrador_1 = require("../../../domain/entities/Administrador");
class CreateAdminUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(nombre, apellido, email, password, telefono, permisos) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!nombre || !apellido || !email || !password || !telefono) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Crear instancia de Administrador (el id se generará en el repositorio)
            const administrador = new Administrador_1.Administrador("", // ID temporal (se asignará al guardar)
            nombre, apellido, email, password, telefono, permisos);
            // Guardar en el repositorio
            return this.repository.saveAdministrador(administrador);
        });
    }
}
exports.CreateAdminUseCase = CreateAdminUseCase;
