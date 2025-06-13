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
exports.UpdateComercianteUseCase = void 0;
// src/application/use-cases/Comerciante/UpdateComercianteUseCase.ts
const Comerciante_1 = require("../../../domain/entities/Comerciante");
class UpdateComercianteUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id, nombre, apellido, telefono, nombreComercio, cuil, direccionComercio) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar existencia
            const existe = yield this.repository.getComercianteById(id);
            if (!existe) {
                throw new Error("Comerciante no encontrado");
            }
            // Crear objeto con datos actualizados
            const comercianteActualizado = new Comerciante_1.Comerciante(id, nombre || existe.getNombre(), apellido || existe.getApellido(), existe.getEmail(), existe.getPassword(), // No permitimos actualizar la contraseña aquí
            telefono || existe.getTelefono(), nombreComercio || existe.getNombreComercio(), cuil || existe.getCuil(), direccionComercio || existe.getDireccionComercio(), existe.getPermisos());
            return this.repository.updateComerciante(comercianteActualizado);
        });
    }
    validarCUIL(cuil) {
        // Implementación básica de validación de CUIL
        return /^\d{2}-\d{8}-\d{1}$/.test(cuil);
    }
}
exports.UpdateComercianteUseCase = UpdateComercianteUseCase;
