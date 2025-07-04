// src/application/use-cases/autenticacion/LoginUseCase.ts
import { AuthPort } from "../../ports/AuthPort";
import { Usuario } from "../../../domain/entities/Usuario";
import { Administrador } from "../../../domain/entities/Administrador";
import { Analista } from "../../../domain/entities/Analista";
import { Comerciante } from "../../../domain/entities/Comerciante";

export class LoginUseCase {
    constructor(private readonly authPort: AuthPort) {}

    async execute(email: string, password: string): Promise<{ usuario: Usuario, token: string, rol: string }> {
        // Validaciones básicas
        if (!email || !password) {
            throw new Error("Email y contraseña son obligatorios");
        }

        // Autenticar al usuario
        const result = await this.authPort.login(email, password);
        
        // Determinar el rol del usuario
        let rol = "usuario";
        if (result.usuario instanceof Administrador) rol = "administrador";
        else if (result.usuario instanceof Analista) rol = "analista";
        else if (result.usuario instanceof Comerciante) rol = "comerciante";
        // Agregar otros roles según sea necesario
        
        return {
            usuario: result.usuario,
            token: result.token,
            rol
        };
    }
}
