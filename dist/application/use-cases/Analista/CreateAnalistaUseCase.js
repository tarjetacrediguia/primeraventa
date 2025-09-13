"use strict";
// src/application/use-cases/Analista/CreateAnalistaUseCase.ts
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
exports.CreateAnalistaUseCase = void 0;
/**
 * MÓDULO: Caso de Uso - Crear Analista
 *
 * Este módulo implementa la lógica de negocio para el registro de un nuevo analista
 * en el sistema, incluyendo validaciones y encriptación de contraseña.
 *
 * RESPONSABILIDADES:
 * - Validar los datos de entrada del analista
 * - Encriptar la contraseña antes de guardar
 * - Registrar el analista en el repositorio
 */
const Analista_1 = require("../../../domain/entities/Analista");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Caso de uso para crear un nuevo analista.
 *
 * Esta clase encapsula la lógica de validación, encriptación y registro
 * de analistas en el sistema.
 */
class CreateAnalistaUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de analistas
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta el registro de un nuevo analista.
     *
     * @param nombre - Nombre del analista
     * @param apellido - Apellido del analista
     * @param email - Correo electrónico
     * @param password - Contraseña en texto plano
     * @param telefono - Teléfono de contacto
     * @returns Promise<Analista> - Analista registrado
     * @throws Error si falta algún campo obligatorio
     */
    execute(nombre, apellido, email, password, telefono) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas
            if (!nombre || !apellido || !email || !password || !telefono) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Encriptar contraseña
            const saltRounds = 10;
            const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
            // Crear instancia de Analista (el id se generará en el repositorio)
            const analista = new Analista_1.Analista({
                id: 0, // ID temporal (se asignará al guardar)
                nombre,
                apellido,
                email,
                password: passwordHash,
                telefono
            });
            // Guardar en el repositorio
            return this.repository.saveAnalista(analista);
        });
    }
}
exports.CreateAnalistaUseCase = CreateAnalistaUseCase;
