"use strict";
// src/application/use-cases/Administrador/CreateAdminUseCase.ts
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
exports.CreateAdminUseCase = void 0;
/**
 * MÓDULO: Caso de Uso - Crear Administrador
 *
 * Este módulo implementa la lógica de negocio para el registro de un nuevo administrador
 * en el sistema, incluyendo validaciones y encriptación de contraseña.
 *
 * RESPONSABILIDADES:
 * - Validar los datos de entrada del administrador
 * - Encriptar la contraseña antes de guardar
 * - Registrar el administrador en el repositorio
 */
const Administrador_1 = require("../../../domain/entities/Administrador");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Caso de uso para crear un nuevo administrador.
 *
 * Esta clase encapsula la lógica de validación, encriptación y registro
 * de administradores en el sistema.
 */
class CreateAdminUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de administradores
     */
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Ejecuta el registro de un nuevo administrador.
     *
     * @param nombre - Nombre del administrador
     * @param apellido - Apellido del administrador
     * @param email - Correo electrónico
     * @param password - Contraseña en texto plano
     * @param telefono - Teléfono de contacto
     * @returns Promise<Administrador> - Administrador registrado
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
            // Crear instancia de Administrador (el id se generará en el repositorio)
            const administrador = new Administrador_1.Administrador({
                id: 0, // ID temporal (se asignará al guardar)
                nombre,
                apellido,
                email,
                password: passwordHash,
                telefono
            });
            // Guardar en el repositorio
            return this.repository.saveAdministrador(administrador);
        });
    }
}
exports.CreateAdminUseCase = CreateAdminUseCase;
