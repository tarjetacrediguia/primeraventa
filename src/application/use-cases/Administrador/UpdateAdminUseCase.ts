// src/application/use-cases/Administrador/UpdateAdminUseCase.ts

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

import { Administrador } from "../../../domain/entities/Administrador";
import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";

/**
 * Caso de uso para actualizar los datos de un administrador.
 *
 * Esta clase permite modificar los datos personales de un administrador
 * previamente registrado, exceptuando la contraseña y el email.
 */
export class UpdateAdminUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de administradores
     */
    constructor(private readonly repository: AdministradorRepositoryPort) {}

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
    async execute(
        id: number,
        nombre: string,
        apellido: string,
        telefono: string
    ): Promise<Administrador> {
        // Validaciones básicas
        if (!nombre || !apellido || !telefono) {
            throw new Error("Todos los campos son obligatorios");
        }

        // Obtener administrador existente
        const existe = await this.repository.getAdministradorById(id);
        if (!existe) {
            throw new Error("Administrador no encontrado");
        }

        // Crear instancia actualizada
        const administradorActualizado = new Administrador({
            id: Number(id),
            nombre,
            apellido,
            email: existe.getEmail(),
            password: existe.getPassword(),
            telefono,
            permisos: existe.getPermisos()
        });

        // Guardar cambios
        return this.repository.updateAdministrador(administradorActualizado);
    }
}
