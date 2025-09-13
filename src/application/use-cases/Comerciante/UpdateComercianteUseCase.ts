// src/application/use-cases/Comerciante/UpdateComercianteUseCase.ts

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

import { Comerciante } from "../../../domain/entities/Comerciante";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

/**
 * Caso de uso para actualizar los datos de un comerciante.
 *
 * Esta clase permite modificar los datos personales y comerciales de un comerciante
 * previamente registrado, exceptuando la contraseña y el email.
 */
export class UpdateComercianteUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     */
    constructor(private readonly repository: ComercianteRepositoryPort) {}

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
    async execute(
        id: number,
        nombre: string,
        apellido: string,
        telefono: string,
        nombreComercio: string,
        cuil: string,
        direccionComercio: string
    ): Promise<Comerciante> {
        // Verificar existencia
        const existe = await this.repository.getComercianteById(id);
        if (!existe) {
            throw new Error("Comerciante no encontrado");
        }

        // Crear objeto con datos actualizados
        const comercianteActualizado = new Comerciante({
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
    }

    /**
     * Valida el formato del CUIL.
     *
     * @param cuil - CUIL a validar
     * @returns boolean - true si el formato es válido, false en caso contrario
     */
    private validarCUIL(cuil: string): boolean {
        // Implementación básica de validación de CUIL
        return /^\d{2}-\d{8}-\d{1}$/.test(cuil);
    }
}
