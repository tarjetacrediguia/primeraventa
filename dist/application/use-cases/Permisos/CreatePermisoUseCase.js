"use strict";
// src/application/use-cases/Permisos/CreatePermisoUseCase.ts
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
/**
 * Caso de uso para crear un nuevo permiso en el sistema.
 *
 * Esta clase implementa la lógica para validar y registrar un nuevo permiso,
 * asegurando que los datos sean correctos y el nombre tenga el formato adecuado.
 */
class CreatePermisoUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la creación de un nuevo permiso.
     *
     * Este método valida los campos requeridos y el formato del nombre antes de
     * crear el permiso en el sistema.
     *
     * @param nombre - Nombre único del permiso (solo minúsculas y guiones bajos)
     * @param descripcion - Descripción del permiso
     * @returns Promise<Permiso> - El permiso creado
     * @throws Error - Si faltan campos o el formato es incorrecto
     */
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
