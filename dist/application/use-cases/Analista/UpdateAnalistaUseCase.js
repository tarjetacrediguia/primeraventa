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
exports.UpdateAnalistaUseCase = void 0;
// src/application/use-cases/Analista/UpdateAnalistaUseCase.ts
const Analista_1 = require("../../../domain/entities/Analista");
class UpdateAnalistaUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id, nombre, apellido, telefono) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!nombre || !apellido || !telefono) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Verificar existencia
            const existe = yield this.repository.getAnalistaById(id);
            if (!existe) {
                throw new Error("Analista no encontrado");
            }
            // Crear objeto con datos actualizados
            const analistaActualizado = new Analista_1.Analista(id, nombre || existe.getNombre(), apellido || existe.getApellido(), existe.getEmail(), existe.getPassword(), // No permitimos actualizar la contraseña aquí
            telefono || existe.getTelefono(), existe.getPermisos());
            return this.repository.updateAnalista(analistaActualizado);
        });
    }
}
exports.UpdateAnalistaUseCase = UpdateAnalistaUseCase;
