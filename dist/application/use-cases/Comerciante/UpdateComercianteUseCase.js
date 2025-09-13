"use strict";
// src/application/use-cases/Comerciante/UpdateComercianteUseCase.ts
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
/**
 * MÓDULO: Caso de Uso - Actualizar Comerciante
 *
 * Este módulo implementa la lógica de negocio para la actualización de los datos
 * de un comerciante existente en el sistema.
 *
 * RESPONSABILIDADES:
 * - Verificar la existencia del comerciante
 * - Actualizar los datos permitidos del comerciante
 * - Validar el formato del CUIL
 */
const Comerciante_1 = require("../../../domain/entities/Comerciante");
/**
 * Caso de uso para actualizar los datos de un comerciante.
 *
 * Esta clase permite modificar los datos personales y comerciales de un comerciante
 * previamente registrado, exceptuando la contraseña y el email.
 */
class UpdateComercianteUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta la actualización de un comerciante existente.
     *
     * @param id - Identificador del comerciante
     * @param nombre - Nuevo nombre (opcional)
     * @param apellido - Nuevo apellido (opcional)
     * @param telefono - Nuevo teléfono (opcional)
     * @param nombreComercio - Nuevo nombre de comercio (opcional)
     * @param cuil - Nuevo CUIL (opcional)
     * @param direccionComercio - Nueva dirección de comercio (opcional)
     * @returns Promise<Comerciante> - Comerciante actualizado
     * @throws Error si el comerciante no existe
     */
    execute(id, nombre, apellido, telefono, nombreComercio, cuil, direccionComercio) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar existencia
            const existe = yield this.repository.getComercianteById(id);
            if (!existe) {
                throw new Error("Comerciante no encontrado");
            }
            // Crear objeto con datos actualizados
            const comercianteActualizado = new Comerciante_1.Comerciante({
                id: id,
                nombre: nombre || existe.getNombre(),
                apellido: apellido || existe.getApellido(),
                email: existe.getEmail(),
                password: existe.getPassword(), // No permitimos actualizar la contraseña aquí
                telefono: telefono || existe.getTelefono(),
                nombreComercio: nombreComercio || existe.getNombreComercio(),
                cuil: cuil || existe.getCuil(),
                direccionComercio: direccionComercio || existe.getDireccionComercio(),
                permisos: existe.getPermisos()
            });
            return this.repository.updateComerciante(comercianteActualizado);
        });
    }
    /**
     * Valida el formato del CUIL.
     *
     * @param cuil - CUIL a validar
     * @returns boolean - true si el formato es válido, false en caso contrario
     */
    validarCUIL(cuil) {
        // Implementación básica de validación de CUIL
        return /^\d{2}-\d{8}-\d{1}$/.test(cuil);
    }
}
exports.UpdateComercianteUseCase = UpdateComercianteUseCase;
