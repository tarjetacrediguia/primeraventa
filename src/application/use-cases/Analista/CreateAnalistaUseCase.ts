// src/application/use-cases/Analista/CreateAnalistaUseCase.ts

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

import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";
import bcrypt from 'bcrypt';

/**
 * Caso de uso para crear un nuevo analista.
 *
 * Esta clase encapsula la lógica de validación, encriptación y registro
 * de analistas en el sistema.
 */
export class CreateAnalistaUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de analistas
     */
    constructor(private readonly repository: AnalistaRepositoryPort) {}

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
    async execute(
        nombre: string,
        apellido: string,
        email: string,
        password: string,
        telefono: string
    ): Promise<Analista> {
        // Validaciones básicas
        if (!nombre || !apellido || !email || !password || !telefono) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Encriptar contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        // Crear instancia de Analista (el id se generará en el repositorio)
        const analista = new Analista(
            0, // ID temporal (se asignará al guardar)
            nombre,
            apellido,
            email,
            passwordHash,
            telefono
        );

        // Guardar en el repositorio
        return this.repository.saveAnalista(analista);
    }
}
