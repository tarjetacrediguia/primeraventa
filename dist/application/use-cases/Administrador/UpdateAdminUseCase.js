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
exports.UpdateAdminUseCase = void 0;
// src/application/use-cases/Administrador/UpdateAdminUseCase.ts
const Administrador_1 = require("../../../domain/entities/Administrador");
class UpdateAdminUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id, nombre, apellido, telefono) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!nombre || !apellido || !telefono) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Obtener administrador existente
            const existe = yield this.repository.getAdministradorById(id);
            if (!existe) {
                throw new Error("Administrador no encontrado");
            }
            // Crear instancia actualizada
            const administradorActualizado = new Administrador_1.Administrador(Number(id), nombre, apellido, existe.getEmail(), // Mantener email existente
            existe.getPassword(), // Mantener password existente
            telefono, existe.getPermisos() // Mantener permisos existentes
            );
            // Guardar cambios
            return this.repository.updateAdministrador(administradorActualizado);
        });
    }
}
exports.UpdateAdminUseCase = UpdateAdminUseCase;
