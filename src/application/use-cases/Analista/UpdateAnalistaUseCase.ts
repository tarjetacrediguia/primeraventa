// src/application/use-cases/Analista/UpdateAnalistaUseCase.ts

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

import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

/**
 * Caso de uso para actualizar los datos de un analista.
 *
 * Esta clase permite modificar los datos personales de un analista
 * previamente registrado, exceptuando la contraseña y el email.
 */
export class UpdateAnalistaUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de analistas
     */
    constructor(private readonly repository: AnalistaRepositoryPort) {}

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
    async execute(
        id: number,
        nombre: string,
        apellido: string,
        telefono: string
    ): Promise<Analista> {
        // Validaciones básicas
        if (!nombre || !apellido || !telefono) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Verificar existencia
        const existe = await this.repository.getAnalistaById(id);
        if (!existe) {
            throw new Error("Analista no encontrado");
        }

        // Crear objeto con datos actualizados
        const analistaActualizado = new Analista({
            id: id,
            nombre: nombre || existe.getNombre(),
            apellido: apellido || existe.getApellido(),
            email: existe.getEmail(),
            password: existe.getPassword(), // No permitimos actualizar la contraseña aquí
            telefono: telefono || existe.getTelefono(),
            permisos: existe.getPermisos()
        });

        return this.repository.updateAnalista(analistaActualizado);
    }
}
