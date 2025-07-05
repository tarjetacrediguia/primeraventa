"use strict";
// src/application/use-cases/Comerciante/CreateComercianteUseCase.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComercianteUseCase = void 0;
/**
 * MÓDULO: Caso de Uso - Crear Comerciante
 *
 * Este módulo implementa la lógica de negocio para el registro de un nuevo comerciante
 * en el sistema, incluyendo validaciones, encriptación de contraseña y persistencia.
 *
 * RESPONSABILIDADES:
 * - Validar los datos de entrada del comerciante
 * - Encriptar la contraseña antes de guardar
 * - Verificar unicidad del CUIL
 * - Registrar el comerciante en el repositorio
 */
const Comerciante_1 = require("../../../domain/entities/Comerciante");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Caso de uso para crear un nuevo comerciante.
 *
 * Esta clase encapsula la lógica de validación, encriptación y registro
 * de comerciantes en el sistema.
 */
class CreateComercianteUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta el registro de un nuevo comerciante.
     *
     * @param nombre - Nombre del comerciante
     * @param apellido - Apellido del comerciante
     * @param email - Correo electrónico
     * @param password - Contraseña en texto plano
     * @param telefono - Teléfono de contacto
     * @param nombreComercio - Nombre del comercio
     * @param cuil - CUIL del comerciante
     * @param direccionComercio - Dirección del comercio
     * @returns Promise<Comerciante> - Comerciante registrado
     * @throws Error si falta algún campo obligatorio, si el CUIL ya existe o si la validación falla
     */
    execute(nombre, apellido, email, password, telefono, nombreComercio, cuil, direccionComercio) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!nombre || !apellido || !email || !password || !telefono || !nombreComercio || !cuil || !direccionComercio) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Encriptar contraseña
            const saltRounds = 10;
            const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
            // Validación de CUIL
            /*
            if (!this.validarCUIL(cuil)) {
                throw new Error("CUIL inválido");
            }
    */
            // Verificar CUIL único
            const existeCuil = yield this.repository.findByCuil(cuil);
            if (existeCuil) {
                throw new Error("Ya existe un comerciante con este CUIL");
            }
            // Crear instancia de Comerciante
            const comerciante = new Comerciante_1.Comerciante(0, // ID temporal
            nombre, apellido, email, passwordHash, telefono, nombreComercio, cuil, direccionComercio);
            // Guardar en el repositorio
            return this.repository.saveComerciante(comerciante);
        });
    }
    /**
     * Valida el formato del CUIL.
     *
     * @param cuil - CUIL a validar
     * @returns boolean - true si el formato es válido, false en caso contrario
     * @remarks La validación es básica y debe ajustarse a la normativa argentina
     */
    validarCUIL(cuil) {
        // Implementación básica de validación de CUIL
        // Debería implementarse una validación real según normas argentinas
        return /^\d{2}-\d{8}-\d{1}$/.test(cuil);
    }
}
exports.CreateComercianteUseCase = CreateComercianteUseCase;
