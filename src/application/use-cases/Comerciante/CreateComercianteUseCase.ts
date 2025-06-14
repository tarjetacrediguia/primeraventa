// src/application/use-cases/Comerciante/CreateComercianteUseCase.ts
import { Comerciante } from "../../../domain/entities/Comerciante";
import { Permiso } from "../../../domain/entities/Permiso";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";
import bcrypt from 'bcrypt';

export class CreateComercianteUseCase {
    constructor(private readonly repository: ComercianteRepositoryPort) {}

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
        const comerciante = new Comerciante(
            0, // ID temporal
            nombre,
            apellido,
            email,
            passwordHash,
            telefono,
            nombreComercio,
            cuil,
            direccionComercio
        );

        // Guardar en el repositorio
        return this.repository.saveComerciante(comerciante);
    }

    private validarCUIL(cuil: string): boolean {
        // Implementación básica de validación de CUIL
        // Debería implementarse una validación real según normas argentinas
        return /^\d{2}-\d{8}-\d{1}$/.test(cuil);
    }
}