// src/application/use-cases/Comerciante/CreateComercianteUseCase.ts

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

import { Comerciante } from "../../../domain/entities/Comerciante";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";
import bcrypt from 'bcrypt';
import { ComercioRepositoryPort } from "../../ports/ComercioRepositoryPort";

/**
 * Caso de uso para crear un nuevo comerciante.
 *
 * Esta clase encapsula la lógica de validación, encriptación y registro
 * de comerciantes en el sistema.
 */
export class CreateComercianteUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     */
    constructor(
        private readonly repository: ComercianteRepositoryPort,
        private readonly comercioRepository: ComercioRepositoryPort
    ) {}

    async execute(
        nombre: string,
        apellido: string,
        email: string,
        password: string,
        telefono: string,
        numeroComercio: string
    ): Promise<Comerciante> {
        if (!nombre || !apellido || !email || !password || !telefono || !numeroComercio) {
            throw new Error("Todos los campos son obligatorios");
        }

        const comercio = await this.comercioRepository.getComercioByNumero(numeroComercio);
        if (!comercio) {
            throw new Error("Comercio no encontrado");
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const comerciante = new Comerciante({
            id: 0,
            nombre,
            apellido,
            email,
            password: passwordHash,
            telefono,
            comercio
        });

        return this.repository.saveComerciante(comerciante);
    }

    /**
     * Valida el formato del CUIL.
     *
     * @param cuil - CUIL a validar
     * @returns boolean - true si el formato es válido, false en caso contrario
     * @remarks La validación es básica y debe ajustarse a la normativa argentina
     */
    private validarCUIL(cuil: string): boolean {
        // Implementación básica de validación de CUIL
        // Debería implementarse una validación real según normas argentinas
        return /^\d{2}-\d{8}-\d{1}$/.test(cuil);
    }
}
