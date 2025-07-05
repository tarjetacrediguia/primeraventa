"use strict";
// src/application/use-cases/Configuraciones/UpdateConfUseCase.ts
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
exports.UpdateConfUseCase = void 0;
/**
 * Caso de uso para actualizar una configuración del sistema.
 *
 * Esta clase permite modificar el valor de un parámetro de configuración
 * previamente registrado en el sistema.
 */
class UpdateConfUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de configuración
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la actualización de una configuración existente.
     *
     * @param clave - Clave del parámetro de configuración a actualizar
     * @param valor - Nuevo valor para el parámetro
     * @returns Promise<Configuracion> - Configuración actualizada
     */
    execute(clave, valor) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.actualizarConfiguracion(clave, valor);
        });
    }
}
exports.UpdateConfUseCase = UpdateConfUseCase;
