// src/application/use-cases/Permisos/CreatePermisoUseCase.ts

/**
 * MÓDULO: Caso de Uso - Crear Permiso
 *
 * Este módulo implementa la lógica de negocio para crear un nuevo permiso en el sistema,
 * validando el formato y la presencia de los campos requeridos.
 *
 * RESPONSABILIDADES:
 * - Validar los campos requeridos para la creación de un permiso
 * - Verificar el formato del nombre del permiso
 * - Crear y registrar el permiso en el sistema
 * - Manejar errores y notificar validaciones fallidas
 */

import { Permiso } from "../../../domain/entities/Permiso";
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";

/**
 * Caso de uso para crear un nuevo permiso en el sistema.
 * 
 * Esta clase implementa la lógica para validar y registrar un nuevo permiso,
 * asegurando que los datos sean correctos y el nombre tenga el formato adecuado.
 */
export class CreatePermisoUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(private readonly repository: PermisoRepositoryPort) {}

    /**
     * Ejecuta la creación de un nuevo permiso.
     * 
     * Este método valida los campos requeridos y el formato del nombre antes de
     * crear el permiso en el sistema.
     * 
     * @param nombre - Nombre único del permiso (solo minúsculas y guiones bajos)
     * @param descripcion - Descripción del permiso
     * @returns Promise<Permiso> - El permiso creado
     * @throws Error - Si faltan campos o el formato es incorrecto
     */
    async execute(
        nombre: string,
        descripcion: string
    ): Promise<Permiso> {
        // Validaciones básicas
        if (!nombre || !descripcion) {
            throw new Error("Todos los campos son obligatorios");
        }

        // Validar formato del nombre del permiso
        if (!/^[a-z_]+$/.test(nombre)) {
            throw new Error("El nombre del permiso solo puede contener letras minúsculas y guiones bajos");
        }

        return this.repository.crearPermiso(nombre, descripcion);
    }
}
