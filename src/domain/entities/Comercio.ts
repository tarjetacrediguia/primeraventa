// src/domain/entities/Comercio.ts
export interface ComercioParams {
    numeroComercio: string;
    nombreComercio: string;
    cuil: string;
    direccionComercio: string;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}

export class Comercio {
    private numeroComercio: string;
    private nombreComercio: string;
    private cuil: string;
    private direccionComercio: string;
    private fechaCreacion: Date;
    private fechaActualizacion: Date;

    constructor(params: ComercioParams) {
        this.numeroComercio = params.numeroComercio;
        this.nombreComercio = params.nombreComercio;
        this.cuil = params.cuil;
        this.direccionComercio = params.direccionComercio;
        this.fechaCreacion = params.fechaCreacion || new Date();
        this.fechaActualizacion = params.fechaActualizacion || new Date();
    }

    // Getters
    public getNumeroComercio(): string { return this.numeroComercio; }
    public getNombreComercio(): string { return this.nombreComercio; }
    public getCuil(): string { return this.cuil; }
    public getDireccionComercio(): string { return this.direccionComercio; }
    public getFechaCreacion(): Date { return this.fechaCreacion; }
    public getFechaActualizacion(): Date { return this.fechaActualizacion; }

    // Setters
    public setNombreComercio(nombre: string): void { 
        this.nombreComercio = nombre;
        this.fechaActualizacion = new Date();
    }
    public setDireccionComercio(direccion: string): void { 
        this.direccionComercio = direccion;
        this.fechaActualizacion = new Date();
    }

    public toPlainObject(): any {
        return {
            numeroComercio: this.numeroComercio,
            nombreComercio: this.nombreComercio,
            cuil: this.cuil,
            direccionComercio: this.direccionComercio,
            fechaCreacion: this.fechaCreacion,
            fechaActualizacion: this.fechaActualizacion
        };
    }
}