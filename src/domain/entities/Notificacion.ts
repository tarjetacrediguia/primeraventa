export class Notificacion {
    private _id: number;
    private _userId: number;
    private _type: string;
    private _message: string;
    private _read: boolean;
    private _createdAt: Date;
    private _metadata?: any;

    constructor(
        id: number,
        userId: number,
        type: string,
        message: string,
        read: boolean,
        createdAt: Date,
        metadata?: any
    ) {
        this._id = id;
        this._userId = userId;
        this._type = type;
        this._message = message;
        this._read = read;
        this._createdAt = createdAt;
        this._metadata = metadata;
    }

    // Getters
    public get id(): number {
        return this._id;
    }

    public get userId(): number {
        return this._userId;
    }

    public get type(): string {
        return this._type;
    }

    public get message(): string {
        return this._message;
    }

    public get read(): boolean {
        return this._read;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get metadata(): any | undefined {
        return this._metadata;
    }

    // Setters
    public set id(value: number) {
        this._id = value;
    }

    public set userId(value: number) {
        this._userId = value;
    }

    public set type(value: string) {
        this._type = value;
    }

    public set message(value: string) {
        this._message = value;
    }

    public set read(value: boolean) {
        this._read = value;
    }

    public set createdAt(value: Date) {
        this._createdAt = value;
    }

    public set metadata(value: any | undefined) {
        this._metadata = value;
    }

    // Métodos para cambiar el estado de lectura
    markAsRead(): void {
        this._read = true;
    }

    markAsUnread(): void {
        this._read = false;
    }

    // Métodos adicionales
    public toString(): string {
        return `Notificación [ID: ${this._id}, Usuario: ${this._userId}, Tipo: ${this._type}, Leída: ${this._read}]`;
    }

    public toPlainObject(): any {
        return {
            id: this._id,
            userId: this._userId,
            type: this._type,
            message: this._message,
            read: this._read,
            createdAt: this._createdAt,
            metadata: this._metadata
        };
    }

    public static fromMap(map: any): Notificacion {
        return new Notificacion(
            map.id,
            map.userId,
            map.type,
            map.message,
            map.read,
            map.createdAt,
            map.metadata
        );
    }

    // Método estático para crear una notificación
    public static create(
        userId: string,
        type: string,
        message: string,
        metadata?: any
    ): { userId: string; type: string; message: string; metadata?: any } {
        return {
            userId,
            type,
            message,
            metadata
        };
    }

    // Método para verificar si es de un tipo específico
    public isOfType(notificationType: string): boolean {
        return this._type === notificationType;
    }

    // Método para verificar si es reciente (en los últimos X minutos)
    public isRecent(minutes: number): boolean {
        const now = new Date();
        const diffInMinutes = (now.getTime() - this._createdAt.getTime()) / (1000 * 60);
        return diffInMinutes <= minutes;
    }
}
