// src/application/use-cases/Administrador/CreateAdminUseCase.ts

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

import { Administrador } from "../../../domain/entities/Administrador";
import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";
import bcrypt from 'bcrypt';

/**
 * Caso de uso para crear un nuevo administrador.
 *
 * Esta clase encapsula la lógica de validación, encriptación y registro
 * de administradores en el sistema.
 */
export class CreateAdminUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de administradores
     */
    constructor(private readonly repository: AdministradorRepositoryPort) {}

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
    async execute(
        nombre: string,
        apellido: string,
        email: string,
        password: string,
        telefono: string
    ): Promise<Administrador> {
        // Validaciones básicas
        if (!nombre || !apellido || !email || !password || !telefono) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Encriptar contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        // Crear instancia de Administrador (el id se generará en el repositorio)
        const administrador = new Administrador({
            id: 0, // ID temporal (se asignará al guardar)
            nombre,
            apellido,
            email,
            password: passwordHash,
            telefono
        });

        // Guardar en el repositorio
        return this.repository.saveAdministrador(administrador);
    }
}
