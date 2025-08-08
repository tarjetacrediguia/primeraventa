//src/application/domain/entities/Historial.ts

/**
 * MÓDULO: Entidad Historial
 *
 * Este archivo define la clase Historial que representa el registro de actividades
 * y cambios realizados en el sistema de gestión de préstamos.
 * 
 * Responsabilidades:
 * - Registrar todas las acciones realizadas en el sistema
 * - Mantener un historial de cambios por usuario y entidad
 * - Proporcionar trazabilidad de operaciones
 * - Facilitar auditorías y seguimiento de actividades
 * - Gestionar detalles específicos de cada acción
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

/**
 * Clase que representa un registro en el historial del sistema.
 * Contiene información sobre acciones realizadas, usuarios involucrados,
 * entidades afectadas y detalles específicos de cada operación.
 */
export class Historial {
    
    /**
     * Constructor de la clase Historial.
     * Inicializa un registro de historial con todos sus datos básicos.
     * 
     * @param _id - Identificador único del registro de historial.
     * @param _usuarioId - ID del usuario que realizó la acción (opcional).
     * @param _accion - Descripción de la acción realizada.
     * @param _entidadAfectada - Nombre de la entidad que fue afectada.
     * @param _entidadId - ID de la entidad específica afectada.
     * @param _detalles - Detalles específicos de la acción en formato JSON.
     * @param _fechaHora - Fecha y hora de la acción (opcional).
     * @param _solicitudInicialId - ID de la solicitud inicial relacionada (opcional).
     */
    constructor(
        private _id: number,
        private _usuarioId: number | null,
        private _accion: string,
        private _entidadAfectada: string,
        private _entidadId: number,
        private _detalles: any, // JSONB
        private _fechaHora?: Date,
        private _solicitudInicialId?: number,
        private datosExtendidos?: {
        usuarioNombre?: string;
        usuarioApellido?: string;
        usuarioRol?: string;
        entidadNombre?: string;}
    ) {}

    /**
     * Crea una instancia de Historial desde un mapa de datos.
     * Método estático para crear registros de historial desde datos serializados.
     * 
     * @param obj - Objeto con los datos para crear la instancia.
     * @returns Historial - Nueva instancia de Historial.
     */
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

    /**
     * Obtiene el ID de la solicitud inicial relacionada.
     * 
     * @returns number | undefined - ID de la solicitud inicial o undefined.
     */
    get solicitudInicialId(): number | undefined {
        return this._solicitudInicialId;
    }
    
    /**
     * Establece el ID de la solicitud inicial relacionada.
     * 
     * @param value - Nuevo ID de la solicitud inicial.
     */
    set solicitudInicialId(value: number | undefined) {
        this._solicitudInicialId = value;
    }

    /**
     * Obtiene el ID único del registro de historial.
     * 
     * @returns number - ID del registro de historial.
     */
    get id(): number {
        return this._id;
    }
    
    /**
     * Establece el ID único del registro de historial.
     * 
     * @param value - Nuevo ID del registro de historial.
     */
    set id(value: number) {
        this._id = value;
    }

    /**
     * Obtiene el ID del usuario que realizó la acción.
     * 
     * @returns number | null - ID del usuario o null si no aplica.
     */
    get usuarioId(): number | null {
        return this._usuarioId;
    }
    
    /**
     * Establece el ID del usuario que realizó la acción.
     * 
     * @param value - Nuevo ID del usuario.
     */
    set usuarioId(value: number | null) {
        this._usuarioId = value;
    }

    /**
     * Obtiene la descripción de la acción realizada.
     * 
     * @returns string - Descripción de la acción.
     */
    get accion(): string {
        return this._accion;
    }
    
    /**
     * Establece la descripción de la acción realizada.
     * 
     * @param value - Nueva descripción de la acción.
     */
    set accion(value: string) {
        this._accion = value;
    }

    /**
     * Obtiene el nombre de la entidad afectada.
     * 
     * @returns string - Nombre de la entidad afectada.
     */
    get entidadAfectada(): string {
        return this._entidadAfectada;
    }
    
    /**
     * Establece el nombre de la entidad afectada.
     * 
     * @param value - Nuevo nombre de la entidad afectada.
     */
    set entidadAfectada(value: string) {
        this._entidadAfectada = value;
    }

    /**
     * Obtiene el ID de la entidad específica afectada.
     * 
     * @returns number - ID de la entidad afectada.
     */
    get entidadId(): number {
        return this._entidadId;
    }
    
    /**
     * Establece el ID de la entidad específica afectada.
     * 
     * @param value - Nuevo ID de la entidad afectada.
     */
    set entidadId(value: number) {
        this._entidadId = value;
    }

    /**
     * Obtiene los detalles específicos de la acción.
     * 
     * @returns any - Detalles de la acción en formato JSON.
     */
    get detalles(): any {
        return this._detalles;
    }
    
    /**
     * Establece los detalles específicos de la acción.
     * 
     * @param value - Nuevos detalles de la acción.
     */
    set detalles(value: any) {
        this._detalles = value;
    }

    /**
     * Obtiene la fecha y hora de la acción.
     * 
     * @returns Date | undefined - Fecha y hora de la acción o undefined.
     */
    get fechaHora(): Date | undefined {
        return this._fechaHora;
    }
    
    /**
     * Establece la fecha y hora de la acción.
     * 
     * @param value - Nueva fecha y hora de la acción.
     */
    set fechaHora(value: Date | undefined) {
        this._fechaHora = value;
    }

    /**
     * Convierte el registro de historial a un objeto plano.
     * Útil para serialización y transferencia de datos.
     * 
     * @returns any - Objeto plano con todos los datos del historial.
     */
    public toPlainObject() {
        return {
            id: this.id,
            usuarioId: this.usuarioId,
            accion: this.accion,
            entidadAfectada: this.entidadAfectada,
            entidadId: this.entidadId,
            detalles: this.detalles,
            fechaHora: this.fechaHora,
            solicitudInicialId: this.solicitudInicialId,
            usuarioNombre: this.datosExtendidos?.usuarioNombre,
            usuarioApellido: this.datosExtendidos?.usuarioApellido,
            usuarioRol: this.datosExtendidos?.usuarioRol,
            entidadNombre: this.datosExtendidos?.entidadNombre
        };
    }
}
