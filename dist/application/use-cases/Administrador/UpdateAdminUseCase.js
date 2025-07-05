"use strict";
// src/application/use-cases/Administrador/UpdateAdminUseCase.ts
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
/**
 * MÓDULO: Caso de Uso - Actualizar Administrador
 *
 * Este módulo implementa la lógica de negocio para la actualización de los datos
 * de un administrador existente en el sistema.
 *
 * RESPONSABILIDADES:
 * - Verificar la existencia del administrador
 * - Validar los datos de entrada
 * - Actualizar los datos permitidos del administrador
 */
const Administrador_1 = require("../../../domain/entities/Administrador");
/**
 * Caso de uso para actualizar los datos de un administrador.
 *
 * Esta clase permite modificar los datos personales de un administrador
 * previamente registrado, exceptuando la contraseña y el email.
 */
class UpdateAdminUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de administradores
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la actualización de un administrador existente.
     *
     * @param id - Identificador del administrador
     * @param nombre - Nuevo nombre del administrador
     * @param apellido - Nuevo apellido del administrador
     * @param telefono - Nuevo teléfono de contacto
     * @returns Promise<Administrador> - Administrador actualizado
     * @throws Error si faltan campos obligatorios o el administrador no existe
     */
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
