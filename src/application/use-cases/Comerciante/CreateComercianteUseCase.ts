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
    constructor(private readonly repository: ComercianteRepositoryPort) {}

    /**
     * Ejecuta el registro de un nuevo comerciante.
     *
     * @param nombre - Nombre del comerciante
     * @param apellido - Apellido del comerciante
     * @param email - Correo electrónico
     * @param password - Contraseña en texto plano
     * @param telefono - Teléfono de contacto
     * @param nombreComercio - Nombre del comercio
     * @param cuil - CUIL del comerciante
     * @param direccionComercio - Dirección del comercio
     * @returns Promise<Comerciante> - Comerciante registrado
     * @throws Error si falta algún campo obligatorio, si el CUIL ya existe o si la validación falla
     */
    async execute(
        nombre: string,
        apellido: string,
        email: string,
        password: string,
        telefono: string,
        nombreComercio: string,
        cuil: string,
        direccionComercio: string
    ): Promise<Comerciante> {
        // Validaciones básicas
        if (!nombre || !apellido || !email || !password || !telefono || !nombreComercio || !cuil || !direccionComercio) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Encriptar contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        // Validación de CUIL
        /*
        if (!this.validarCUIL(cuil)) {
            throw new Error("CUIL inválido");
        }
*/
        // Verificar CUIL único
        const existeCuil = await this.repository.findByCuil(cuil);
        if (existeCuil) {
            throw new Error("Ya existe un comerciante con este CUIL");
        }

        // Crear instancia de Comerciante
        const comerciante = new Comerciante({
            id: 0, // ID temporal
            nombre,
            apellido,
            email,
            password: passwordHash,
            telefono,
            nombreComercio,
            cuil,
            direccionComercio
        });

        // Guardar en el repositorio
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
