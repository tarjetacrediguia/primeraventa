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
exports.CreatePermisoUseCase = void 0;
class CreatePermisoUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(nombre, descripcion) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!nombre || !descripcion) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Validar formato del nombre del permiso
            if (!/^[a-z_]+$/.test(nombre)) {
                throw new Error("El nombre del permiso solo puede contener letras minúsculas y guiones bajos");
            }
            return this.repository.crearPermiso(nombre, descripcion);
        });
    }
}
exports.CreatePermisoUseCase = CreatePermisoUseCase;
