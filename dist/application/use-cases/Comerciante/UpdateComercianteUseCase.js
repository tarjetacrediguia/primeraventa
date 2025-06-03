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
    execute(id, nombre, apellido, email, telefono, nombreComercio, cuil, direccionComercio, permisos) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!nombre || !apellido || !email || !telefono ||
                !nombreComercio || !cuil || !direccionComercio) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Validación de CUIL
            if (!this.validarCUIL(cuil)) {
                throw new Error("CUIL inválido");
            }
            // Obtener comerciante existente
            const existe = yield this.repository.getComercianteById(id);
            if (!existe) {
                throw new Error("Comerciante no encontrado");
            }
            // Verificar CUIL único si cambió
            if (existe.getCuil() !== cuil) {
                const existeCuil = yield this.repository.findByCuil(cuil);
                if (existeCuil) {
                    throw new Error("Ya existe otro comerciante con este CUIL");
                }
            }
            // Crear instancia actualizada manteniendo password
            const comercianteActualizado = new Comerciante_1.Comerciante(id, nombre, apellido, email, existe.getPassword(), // Mantener password existente
            telefono, nombreComercio, cuil, direccionComercio, permisos);
            // Guardar cambios
            return this.repository.updateComerciante(comercianteActualizado);
        });
    }
    validarCUIL(cuil) {
        // Implementación básica de validación de CUIL
        return /^\d{2}-\d{8}-\d{1}$/.test(cuil);
    }
}
exports.UpdateComercianteUseCase = UpdateComercianteUseCase;
