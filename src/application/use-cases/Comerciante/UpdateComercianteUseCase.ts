// src/application/use-cases/Comerciante/UpdateComercianteUseCase.ts

/**
 * MÓDULO: Caso de Uso - Actualizar Comerciante
 *
 * Este módulo implementa la lógica de negocio para la actualización de los datos
 * de un comerciante existente en el sistema.
 *
 * RESPONSABILIDADES:
 * - Verificar la existencia del comerciante
 * - Actualizar los datos personales del comerciante
 * - No permite actualizar datos del comercio (se hace en ComercioUseCase)
 */

import { Comerciante } from "../../../domain/entities/Comerciante";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";
import { ComercioRepositoryPort } from "../../ports/ComercioRepositoryPort";
import bcrypt from 'bcrypt';

/**
 * Caso de uso para actualizar los datos de un comerciante.
 *
 * Esta clase permite modificar los datos personales de un comerciante
 * previamente registrado, exceptuando la contraseña, email y datos del comercio.
 */
export class UpdateComercianteUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     * @param comercioRepository - Puerto de acceso al repositorio de comercios
     */
    constructor(
        private readonly repository: ComercianteRepositoryPort,
        private readonly comercioRepository: ComercioRepositoryPort
    ) {}

    /**
     * Ejecuta la actualización de un comerciante existente.
     *
     * @param id - Identificador del comerciante
     * @param nombre - Nuevo nombre (opcional)
     * @param apellido - Nuevo apellido (opcional)
     * @param telefono - Nuevo teléfono (opcional)
     * @param numeroComercio - Nuevo número de comercio (opcional - para cambiar de comercio)
     * @returns Promise<Comerciante> - Comerciante actualizado
     * @throws Error si el comerciante no existe o si el comercio no existe
     */
    async execute(
        id: number,
        nombre?: string,
        apellido?: string,
        telefono?: string,
        numeroComercio?: string,
        password?: string
    ): Promise<Comerciante> {
        // Verificar existencia del comerciante
        const comercianteExistente = await this.repository.getComercianteById(id);
        if (!comercianteExistente) {
            throw new Error("Comerciante no encontrado");
        }

        let comercio = comercianteExistente.getComercio();

        // Si se proporciona un nuevo número de comercio, verificar que existe
        if (numeroComercio && numeroComercio !== comercio.getNumeroComercio()) {
            const nuevoComercio = await this.comercioRepository.getComercioByNumero(numeroComercio);
            if (!nuevoComercio) {
                throw new Error("Comercio no encontrado");
            }
            comercio = nuevoComercio;
        }

        // Hash de la contraseña si se proporciona
        let hashedPassword: string | undefined;
        if (password && password.trim() !== '') {
            // Validar longitud mínima de contraseña
            if (password.length < 8) {
                throw new Error("La contraseña debe tener al menos 8 caracteres");
            }
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        // Actualizar solo los campos proporcionados
        if (nombre) comercianteExistente.setNombre(nombre);
        if (apellido) comercianteExistente.setApellido(apellido);
        if (telefono) comercianteExistente.setTelefono(telefono);
        if (hashedPassword) comercianteExistente.setPassword(hashedPassword);
        
        // Actualizar comercio si cambió
        if (numeroComercio && numeroComercio !== comercianteExistente.getComercio().getNumeroComercio()) {
            comercianteExistente.setComercio(comercio);
        }

        return this.repository.updateComerciante(comercianteExistente);
    }

    /**
     * Ejecuta la actualización de un comerciante existente (método alternativo con objeto)
     *
     * @param id - Identificador del comerciante
     * @param updates - Objeto con los campos a actualizar
     * @returns Promise<Comerciante> - Comerciante actualizado
     */
    async executeWithObject(
        id: number,
        updates: {
            nombre?: string;
            apellido?: string;
            telefono?: string;
            numeroComercio?: string;
            password?: string;
        }
    ): Promise<Comerciante> {
        return this.execute(
            id,
            updates.nombre,
            updates.apellido,
            updates.telefono,
            updates.numeroComercio,
            updates.password
        );
    }
}