"use strict";
// src/application/use-cases/Analista/UpdateAnalistaUseCase.ts
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
/**
 * MÓDULO: Caso de Uso - Actualizar Analista
 *
 * Este módulo implementa la lógica de negocio para la actualización de los datos
 * de un analista existente en el sistema.
 *
 * RESPONSABILIDADES:
 * - Verificar la existencia del analista
 * - Validar los datos de entrada
 * - Actualizar los datos permitidos del analista
 */
const Analista_1 = require("../../../domain/entities/Analista");
/**
 * Caso de uso para actualizar los datos de un analista.
 *
 * Esta clase permite modificar los datos personales de un analista
 * previamente registrado, exceptuando la contraseña y el email.
 */
class UpdateAnalistaUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de analistas
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la actualización de un analista existente.
     *
     * @param id - Identificador del analista
     * @param nombre - Nuevo nombre del analista
     * @param apellido - Nuevo apellido del analista
     * @param telefono - Nuevo teléfono de contacto
     * @returns Promise<Analista> - Analista actualizado
     * @throws Error si faltan campos obligatorios o el analista no existe
     */
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
