//src/application/domain/entities/Historial.ts

export class Historial {
    constructor(
        private _id: number,
        private _usuarioId: number | null,
        private _accion: string,
        private _entidadAfectada: string,
        private _entidadId: number,
        private _detalles: any, // JSONB
        private _fechaHora?: Date,
        private _solicitudInicialId?: number
    ) {}

    static fromMap(obj: any): Historial {
        return new Historial(
            obj.id,
            obj.usuarioId ?? null,
            obj.accion,
            obj.entidadAfectada,
            obj.entidadId,
            obj.detalles,
            obj.fechaHora instanceof Date ? obj.fechaHora : new Date(obj.fechaHora),
            obj.solicitudInicialId !== undefined ? obj.solicitudInicialId : undefined
        );
    }

    get solicitudInicialId(): number | undefined {
        return this._solicitudInicialId;
    }
    
    set solicitudInicialId(value: number | undefined) {
        this._solicitudInicialId = value;
    }

    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }

    get usuarioId(): number | null {
        return this._usuarioId;
    }
    set usuarioId(value: number | null) {
        this._usuarioId = value;
    }

    get accion(): string {
        return this._accion;
    }
    
    set accion(value: string) {
        this._accion = value;
    }

    get entidadAfectada(): string {
        return this._entidadAfectada;
    }
    set entidadAfectada(value: string) {
        this._entidadAfectada = value;
    }

    get entidadId(): number {
        return this._entidadId;
    }
    set entidadId(value: number) {
        this._entidadId = value;
    }

    get detalles(): any {
        return this._detalles;
    }
    set detalles(value: any) {
        this._detalles = value;
    }

    get fechaHora(): Date | undefined {
        return this._fechaHora;
    }
    set fechaHora(value: Date | undefined) {
        this._fechaHora = value;
    }

    public toPlainObject() {
        return {
            id: this.id,
            usuarioId: this.usuarioId,
            accion: this.accion,
            entidadAfectada: this.entidadAfectada,
            entidadId: this.entidadId,
            detalles: this.detalles,
            fechaHora: this.fechaHora,
            solicitudInicialId: this.solicitudInicialId
        };
    }
}