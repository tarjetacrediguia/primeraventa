// src/domain/entities/SolicitudInicial.ts
/**
 * MÓDULO: Entidad Solicitud Inicial
 *
 * Este archivo define la clase SolicitudInicial que representa la primera etapa
 * del proceso de solicitud de préstamo en el sistema.
 * 
 * Responsabilidades:
 * - Representar solicitudes iniciales de préstamo
 * - Gestionar el estado de la solicitud (pendiente, aprobada, rechazada, expirada)
 * - Manejar información básica del cliente y documentos
 * - Proporcionar funcionalidades de aprobación y comentarios
 * - Validar datos de la solicitud inicial
 */


export interface SolicitudInicialParams {
  id: number;
  fechaCreacion: Date;
  estado: "pendiente" | "aprobada" | "rechazada" | "expirada";
  clienteId: number;
  comercianteId?: number;
  comentarios?: string[];
  analistaAprobadorId?: number;
  administradorAprobadorId?: number;
  dniCliente?: string;
  cuilCliente?: string;
  motivoRechazo?: string;
  reciboSueldo?: Buffer;
  comercianteNombre?: string;
  nombreComercio?: string;
  estadoSolicitudFormal?: string | null;
  estadoCompra?: string | null;
}

/**
 * Clase que representa una solicitud inicial de préstamo en el sistema.
 * Contiene la información básica del cliente, documentos requeridos y
 * el estado del proceso de aprobación inicial.
 */
export class SolicitudInicial {
  private readonly id: number;
  private fechaCreacion: Date;
  private estado: "pendiente" | "aprobada" | "rechazada" | "expirada";
  private reciboSueldo?: Buffer;
  private comercianteId?: number;
  private comentarios: string[];
  private clienteId: number;
  private analistaAprobadorId?: number;
  private administradorAprobadorId?: number;
  private cuilCliente?: string;
  private dniCliente?: string;
  private motivoRechazo?: string;
  private comercianteNombre?: string;
  private nombreComercio?: string;
  private estadoSolicitudFormal?: string | null;
  private estadoCompra?: string | null;

  /**
   * Constructor de la clase SolicitudInicial.
   * Inicializa una solicitud inicial con todos sus datos básicos.
   * 
   * @param id - Identificador único de la solicitud.
   * @param fechaCreacion - Fecha de creación de la solicitud.
   * @param estado - Estado actual de la solicitud.
   * @param dniCliente - DNI del cliente solicitante.
   * @param clienteId - ID del cliente en el sistema.
   * @param cuilCliente - CUIL del cliente (opcional).
   * @param reciboSueldo - Recibo de sueldo del cliente (opcional).
   * @param comercianteId - ID del comerciante asociado (opcional).
   * @param comentarios - Array de comentarios sobre la solicitud.
   * @param analistaAprobadorId - ID del analista que aprobó (opcional).
   * @param administradorAprobadorId - ID del administrador que aprobó (opcional).
   */
  constructor(params: SolicitudInicialParams) {
    this.id = params.id;
    this.fechaCreacion = params.fechaCreacion;
    this.estado = params.estado;
    this.dniCliente = params.dniCliente;
    this.cuilCliente = params.cuilCliente;
    this.comercianteId = params.comercianteId;
    this.comentarios = params.comentarios || [];
    this.clienteId = params.clienteId;
    this.analistaAprobadorId = params.analistaAprobadorId;
    this.administradorAprobadorId = params.administradorAprobadorId;
    this.motivoRechazo = params.motivoRechazo;
    this.comercianteNombre = params.comercianteNombre;
    this.nombreComercio = params.nombreComercio;
    this.reciboSueldo = params.reciboSueldo;
  }

    getEstadoSolicitudFormal(): string | null | undefined {
    return this.estadoSolicitudFormal;
  }

  setEstadoSolicitudFormal(estado: string | null): void {
    this.estadoSolicitudFormal = estado;
  }

  getEstadoCompra(): string | null | undefined {
    return this.estadoCompra;
  }

  setEstadoCompra(estado: string | null): void {
    this.estadoCompra = estado;
  }

  public setComercianteNombre(nombre: string): void {
    this.comercianteNombre = nombre;
}

public getComercianteNombre(): string | undefined {
    return this.comercianteNombre;
}

public setNombreComercio(nombreComercio: string): void {
    this.nombreComercio = nombreComercio;
}

public getNombreComercio(): string | undefined {
    return this.nombreComercio;
}

  /**
   * Obtiene el motivo de rechazo de la solicitud.
   * 
   * @returns string | undefined - Motivo de rechazo o undefined si no fue rechazada.
   */
  public getMotivoRechazo(): string | undefined {
    return this.motivoRechazo;
  }
  /**
   * Establece el motivo de rechazo de la solicitud.
   * 
   * @param motivo - Nuevo motivo de rechazo.
   */
  public setMotivoRechazo(motivo: string): void {
    this.motivoRechazo = motivo;
  }

  /**
   * Establece el ID del analista que aprobó la solicitud.
   * 
   * @param id - ID del analista aprobador.
   */
  public setAnalistaAprobadorId(id: number): void {
    this.analistaAprobadorId = Number(id);
}

  /**
   * Establece el ID del administrador que aprobó la solicitud.
   * 
   * @param id - ID del administrador aprobador.
   */
public setAdministradorAprobadorId(id: number): void {
    this.administradorAprobadorId = Number(id);
}

  /**
   * Obtiene el ID del analista que aprobó la solicitud.
   * 
   * @returns number | undefined - ID del analista aprobador o undefined.
   */
public getAnalistaAprobadorId(): number | undefined {
    return this.analistaAprobadorId;
}

  /**
   * Obtiene el ID del administrador que aprobó la solicitud.
   * 
   * @returns number | undefined - ID del administrador aprobador o undefined.
   */
public getAdministradorAprobadorId(): number | undefined {
    return this.administradorAprobadorId;
}

  /**
   * Obtiene el ID del cliente asociado a la solicitud.
   * 
   * @returns number - ID del cliente.
   */
  public getClienteId(): number {
    return this.clienteId;
  }

  /**
   * Establece el ID del cliente asociado a la solicitud.
   * 
   * @param clienteId - Nuevo ID del cliente.
   */
  public setClienteId(clienteId: number): void {
    this.clienteId = clienteId;
  }

  /**
   * Obtiene el ID único de la solicitud.
   * 
   * @returns number - ID de la solicitud.
   */
  public getId(): number {
    return this.id;
  }

  /**
   * Obtiene la fecha de creación de la solicitud.
   * 
   * @returns Date - Fecha de creación.
   */
  public getFechaCreacion(): Date {
    return this.fechaCreacion;
  }

  /**
   * Establece la fecha de creación de la solicitud.
   * 
   * @param fechaCreacion - Nueva fecha de creación.
   */
  public setFechaCreacion(fechaCreacion: Date): void {
    this.fechaCreacion = fechaCreacion;
  }

  /**
   * Obtiene el estado actual de la solicitud.
   * 
   * @returns "pendiente" | "aprobada" | "rechazada" | "expirada" - Estado de la solicitud.
   */
  public getEstado(): "pendiente" | "aprobada" | "rechazada" | "expirada" {
    return this.estado;
  }

  /**
   * Establece el estado de la solicitud.
   * 
   * @param estado - Nuevo estado de la solicitud.
   */
  public setEstado(
    estado: "pendiente" | "aprobada" | "rechazada" | "expirada"
  ): void {
    this.estado = estado;
  }

  /**
   * Obtiene el DNI del cliente solicitante.
   * 
   * @returns string - DNI del cliente.
   */
  
  public getDniCliente(): string {
    return this.dniCliente || '';
  }

  /**
   * Establece el DNI del cliente solicitante.
   * 
   * @param dniCliente - Nuevo DNI del cliente.
   */
  
  public setDniCliente(dniCliente: string): void {
    this.dniCliente = dniCliente;
  }

  /**
   * Obtiene el CUIL del cliente solicitante.
   * 
   * @returns string | undefined - CUIL del cliente o undefined.
   */
  
  public getCuilCliente(): string | undefined {
    return this.cuilCliente;
  }

  /**
   * Establece el CUIL del cliente solicitante.
   * 
   * @param cuilCliente - Nuevo CUIL del cliente.
   */
  
  public setCuilCliente(cuilCliente: string): void {
    this.cuilCliente = cuilCliente;
  }

  /**
   * Obtiene el recibo de sueldo del cliente.
   * 
   * @returns Buffer | undefined - Recibo de sueldo o undefined.
   */
  public getReciboSueldo(): Buffer | undefined {
    return this.reciboSueldo;
  }

  /**
   * Establece el recibo de sueldo del cliente.
   * 
   * @param reciboSueldo - Nuevo recibo de sueldo.
   */
  public setReciboSueldo(reciboSueldo: Buffer): void {
    this.reciboSueldo = reciboSueldo;
  }

  /**
   * Obtiene el ID del comerciante asociado.
   * 
   * @returns number | undefined - ID del comerciante o undefined.
   */
  public getComercianteId(): number | undefined {
    return this.comercianteId;
  }

  /**
   * Establece el ID del comerciante asociado.
   * 
   * @param comercianteId - Nuevo ID del comerciante.
   */
  public setComercianteId(comercianteId: number): void {
    this.comercianteId = comercianteId;
  }

  /**
   * Obtiene todos los comentarios de la solicitud.
   * 
   * @returns string[] - Array de comentarios.
   */
  public getComentarios(): string[] {
    return this.comentarios;
  }

  /**
   * Establece todos los comentarios de la solicitud.
   * 
   * @param comentarios - Nuevo array de comentarios.
   */
  public setComentarios(comentarios: string[]): void {
    this.comentarios = comentarios;
  }

  /**
   * Agrega un nuevo comentario a la solicitud.
   * 
   * @param comentario - Nuevo comentario a agregar.
   */
  public agregarComentario(comentario: string): void {
    this.comentarios.push(comentario);
  }

  /**
   * Convierte la solicitud inicial a una representación de string.
   * Útil para logging y debugging.
   * 
   * @returns string - Representación en string de la solicitud.
   */
  public toString(): string {
    return `SolicitudInicial[id=${this.id}, estado=${this.estado}, fechaCreacion=${this.fechaCreacion.toISOString()}, clienteId=${this.clienteId}, comercianteId=${this.comercianteId}, analistaAprobadorId=${this.analistaAprobadorId}, administradorAprobadorId=${this.administradorAprobadorId}]`;
  }

  /**
   * Convierte la solicitud inicial a un objeto plano.
   * Útil para serialización y transferencia de datos.
   * 
   * @returns any - Objeto plano con todos los datos de la solicitud.
   */
  public toPlainObject(): any {
    return {
      id: this.id,
      fechaCreacion: this.fechaCreacion,
      estado: this.estado,
      dniCliente: this.dniCliente,
      cuilCliente: this.cuilCliente,
      comercianteId: this.comercianteId,
      comentarios: this.comentarios,
      clienteId: this.clienteId,
      analistaAprobadorId: this.analistaAprobadorId,
      administradorAprobadorId: this.administradorAprobadorId,
      motivoRechazo: this.motivoRechazo,
      comercianteNombre: this.comercianteNombre,
      nombreComercio: this.nombreComercio,
      estadoSolicitudFormal: this.estadoSolicitudFormal,
      estadoCompra: this.estadoCompra
    };
}

  /**
   * Crea una instancia de SolicitudInicial desde un mapa de datos.
   * Método estático para crear solicitudes desde datos serializados.
   * 
   * @param map - Mapa de datos para crear la instancia.
   * @returns SolicitudInicial - Nueva instancia de SolicitudInicial.
   */
  public static fromMap(map: any): SolicitudInicial {
    return new SolicitudInicial({
      id: map.id,
      fechaCreacion: map.fechaCreacion,
      estado: map.estado,
      clienteId: map.clienteId || 0,
      comercianteId: map.comercianteId,
      comentarios: map.comentarios || [],
      analistaAprobadorId: map.analista_aprobador_id ? Number(map.analista_aprobador_id) : undefined,
      administradorAprobadorId: map.administrador_aprobador_id ? Number(map.administrador_aprobador_id) : undefined,
      dniCliente: map.dniCliente,
      cuilCliente: map.cuilCliente,
      motivoRechazo: map.motivoRechazo,
      reciboSueldo: map.reciboSueldo,
      comercianteNombre: map.comercianteNombre,
      nombreComercio: map.nombreComercio
    });
  }

  /**
   * Valida que la solicitud inicial tenga los datos obligatorios.
   * 
   * @returns boolean - true si la solicitud es válida, false en caso contrario.
   */
  /*
  validar(): boolean {
    return !!this.dniCliente && !!this.cuilCliente;
  }
    */
}
