// src/domain/entities/Comerciante.ts
import { Comercio } from "./Comercio";
import { Permiso } from "./Permiso";
import { Usuario, UsuarioParams } from "./Usuario";

export interface ComercianteParams extends UsuarioParams {
    comercio: Comercio;
    permisos?: Permiso[];
    activo?: any;
}

export class Comerciante extends Usuario {
    private comercio: Comercio;
    private permisos: Permiso[];

    constructor(params: ComercianteParams) {
        const { comercio, permisos, ...usuarioParams } = params;
        super(usuarioParams);
        this.comercio = comercio;
        this.permisos = permisos ?? [];
    }

    

    public getComercio(): Comercio {
        return this.comercio;
    }

    public setComercio(comercio: Comercio): void {
        this.comercio = comercio;
    }

    public getPermisos(): Permiso[] {
        return this.permisos;
    }

    public setPermisos(permisos: Permiso[]): void {
        this.permisos = permisos;
    }

    // Mantener compatibilidad con código existente
    public getNombreComercio(): string {
        return this.comercio.getNombreComercio();
    }

    public getCuil(): string {
        return this.comercio.getCuil();
    }

    public getDireccionComercio(): string {
        return this.comercio.getDireccionComercio();
    }

    public getNumeroComercio(): string {
        return this.comercio.getNumeroComercio();
    }

    public toPlainObject(): any {
        return {
            ...super.toPlainObject(),
            comercio: this.comercio.toPlainObject()
        };
    }

    public static fromMap(map: any): Comerciante {
        const comercio = new Comercio({
            numeroComercio: map.numeroComercio || map.comercio?.numeroComercio,
            nombreComercio: map.nombreComercio || map.comercio?.nombreComercio,
            cuil: map.cuil || map.comercio?.cuil,
            direccionComercio: map.direccionComercio || map.comercio?.direccionComercio
        });

        return new Comerciante({
            id: map.id,
            nombre: map.nombre,
            apellido: map.apellido,
            email: map.email,
            password: map.password,
            telefono: map.telefono,
            comercio: comercio,
            permisos: map.permisos
        });
    }

    public getRol(): string {
        return 'comerciante';
    }
}