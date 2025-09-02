// src/domain/entities/SolicitudFormal.ts
/**
 * MÓDULO: Entidad Solicitud Formal
 *
 * Este archivo define la clase SolicitudFormal que representa la segunda etapa
 * del proceso de solicitud de préstamo, con información completa del solicitante.
 * 
 * Responsabilidades:
 * - Representar solicitudes formales de préstamo
 * - Gestionar información completa del solicitante y referentes
 * - Manejar documentos y recibo de sueldo
 * - Proporcionar funcionalidades de aprobación y gestión
 * - Gestionar números de cuenta y tarjeta asignados
 * - Validar y procesar datos de la solicitud formal
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

import { Readable } from "stream";
import { Referente } from "./Referente";

/**
 * Clase que representa una solicitud formal de préstamo en el sistema.
 * Contiene información completa del solicitante, referentes, documentos
 * y datos de aprobación del préstamo.
 */
export class SolicitudFormal {
    private readonly id: number;
    private nombreCompleto: string;
    private apellido: string;
    private telefono: string;
    private email: string;
    private fechaSolicitud: Date;
    private recibo: Buffer;
    private estado: "pendiente" | "aprobada" | "rechazada" | "aprobada_sin_aumento" | "pendiente_ampliacion";
    private aceptaTarjeta: boolean;
    private fechaNacimiento: Date;
    private domicilio: string;
    private referentes: Referente[];
    private comentarios: string[];
    private solicitudInicialId: number;
    private comercianteId: number;
    private clienteId?: number;
    private fechaAprobacion?: Date;
    private analistaAprobadorId?: number;
    private administradorAprobadorId?: number;
    private comercianteAprobadorId?: number;
    private importeNeto: number;
    private limiteBase!: number;
    private limiteCompleto!: number;
    private ponderador:number;
    private solicitaAmpliacionDeCredito: boolean;
    private nuevoLimiteCompletoSolicitado?: number | null;
    private razonSocialEmpleador: string;
    private cuitEmpleador: string;
    private cargoEmpleador: string;
    private sectorEmpleador: string;
    private codigoPostalEmpleador: string;
    private localidadEmpleador: string;
    private provinciaEmpleador: string;
    private telefonoEmpleador: string;
    private sexo: string | null;
    private codigoPostal: string | null;
    private localidad: string | null;
    private provincia: string | null;
    private numeroDomicilio: string | null;
    private barrio: string | null;  

  /**
   * Constructor de la clase SolicitudFormal.
   * Inicializa una solicitud formal con todos los datos del solicitante y referentes.
   * 
   * @param id - Identificador único de la solicitud.
   * @param solicitudInicialId - ID de la solicitud inicial asociada.
   * @param comercianteId - ID del comerciante asociado.
   * @param nombreCompleto - Nombre completo del solicitante.
   * @param apellido - Apellido del solicitante.
   * @param dni - DNI del solicitante.
   * @param telefono - Teléfono del solicitante.
   * @param email - Email del solicitante.
   * @param fechaSolicitud - Fecha de la solicitud.
   * @param recibo - Recibo de sueldo del solicitante.
   * @param estado - Estado actual de la solicitud.
   * @param aceptaTarjeta - Indica si acepta tarjeta de crédito.
   * @param fechaNacimiento - Fecha de nacimiento del solicitante.
   * @param domicilio - Domicilio del solicitante.
   * @param datosEmpleador - Datos del empleador del solicitante.
   * @param referentes - Array de referentes del solicitante.
   * @param comentarios - Array de comentarios sobre la solicitud.
   * @param clienteId - ID del cliente en el sistema.
   * @param numeroTarjeta - Número de tarjeta asignado (opcional).
   * @param numeroCuenta - Número de cuenta asignado (opcional).
   * @param fechaAprobacion - Fecha de aprobación (opcional).
   * @param analistaAprobadorId - ID del analista que aprobó (opcional).
   * @param administradorAprobadorId - ID del administrador que aprobó (opcional).
   * @param importeNeto - Importe neto del solicitante.
   * @param cuotasSolicitadas - Cantidad de cuotas solicitadas (entre 3 y 14).
   */
  constructor(
    id: number,
    solicitudInicialId: number,
    comercianteId: number, 
    nombreCompleto: string,
    apellido: string,
    telefono: string,
    email: string,
    fechaSolicitud: Date,
    recibo: Buffer,
    estado: "pendiente" | "aprobada" | "rechazada" | "aprobada_sin_aumento",
    aceptaTarjeta: boolean,
    fechaNacimiento: Date,
    domicilio: string,
    referentes: Referente[],
    importeNeto: number,
    comentarios: string[] = [],
    ponderador: number,
    solicitaAmpliacionDeCredito: boolean = false,
    clienteId?: number,
    razonSocialEmpleador?: string,
    cuitEmpleador?: string,
    cargoEmpleador?: string,
    sectorEmpleador?: string,
    codigoPostalEmpleador?: string,
    localidadEmpleador?: string,
    provinciaEmpleador?: string,
    telefonoEmpleador?: string,
    sexo?: string,
    codigoPostal?: string,
    localidad?: string,
    provincia?: string,
    numeroDomicilio?: string,
    barrio?: string,
    fechaAprobacion?: Date,
    analistaAprobadorId?: number,
    administradorAprobadorId?: number,
    comercianteAprobadorId?: number,
    nuevoLimiteCompletoSolicitado?: number | null,
    

    
  ) {
    this.id = id;
    this.solicitudInicialId = solicitudInicialId;
    this.comercianteId = comercianteId;
    this.nombreCompleto = nombreCompleto;
    this.apellido = apellido; 
    this.telefono = telefono;
    this.email = email;
    this.fechaSolicitud = fechaSolicitud;
    this.recibo = recibo;
    this.estado = estado;
    this.aceptaTarjeta = aceptaTarjeta;
    this.fechaNacimiento = fechaNacimiento;
    this.domicilio = domicilio;
    this.referentes = referentes || [];
    this.comentarios = comentarios;
    this.clienteId = clienteId;
    this.fechaAprobacion = fechaAprobacion;
    this.analistaAprobadorId = analistaAprobadorId;
    this.administradorAprobadorId = administradorAprobadorId;
    this.importeNeto = importeNeto;
    this.ponderador = ponderador;
    this.nuevoLimiteCompletoSolicitado = nuevoLimiteCompletoSolicitado ?? null;
    this.solicitaAmpliacionDeCredito = solicitaAmpliacionDeCredito;
    this.calcularLimites();
    this.razonSocialEmpleador = razonSocialEmpleador || "";
    this.cuitEmpleador = cuitEmpleador || "";
    this.cargoEmpleador = cargoEmpleador || "";
    this.sectorEmpleador = sectorEmpleador || "";
    this.codigoPostalEmpleador = codigoPostalEmpleador || "";
    this.localidadEmpleador = localidadEmpleador || "";
    this.provinciaEmpleador = provinciaEmpleador || "";
    this.telefonoEmpleador = telefonoEmpleador || "";
    this.sexo = sexo || null;
    this.codigoPostal = codigoPostal || null;
    this.localidad = localidad || null;
    this.provincia = provincia || null;
    this.numeroDomicilio = numeroDomicilio || null;
    this.barrio = barrio || null;
  }

  setSexo(sexo: string) {
        this.sexo = sexo;
    }

    getSexo() {
        return this.sexo;
    }
    setCodigoPostal(codigoPostal: string) {
        this.codigoPostal = codigoPostal;
    }
    getCodigoPostal() {
        return this.codigoPostal;
    }
    setLocalidad(localidad: string) {
        this.localidad = localidad;
    }
    getLocalidad() {
        return this.localidad;
    }
    setProvincia(provincia: string) {
        this.provincia = provincia;
    }
    getProvincia() {
        return this.provincia;
    }
    setNumeroDomicilio(numeroDomicilio: string) {
        this.numeroDomicilio = numeroDomicilio;
    }
    getNumeroDomicilio() {
        return this.numeroDomicilio;
    }
    setBarrio(barrio: string) {
        this.barrio = barrio;
    }
    getBarrio() {
        return this.barrio;
    }
    

  setRazonSocialEmpleador(razonSocial: string) {
        this.razonSocialEmpleador = razonSocial;
    }
    getRazonSocialEmpleador() {
        return this.razonSocialEmpleador;
    }
    setCuitEmpleador(cuit: string) {
        this.cuitEmpleador = cuit;
    }
    getCuitEmpleador() {
        return this.cuitEmpleador;
    } 
    setCargoEmpleador(cargo: string) {
        this.cargoEmpleador = cargo;
    } 
    getCargoEmpleador() {
        return this.cargoEmpleador;
    }
    setSectorEmpleador(sector: string) {
        this.sectorEmpleador = sector;
    }
    getSectorEmpleador() {
        return this.sectorEmpleador;
    }
    setCodigoPostalEmpleador(codigoPostal: string) {
        this.codigoPostalEmpleador = codigoPostal;
    }
    getCodigoPostalEmpleador() {
        return this.codigoPostalEmpleador;
    }
    setLocalidadEmpleador(localidad: string) {
        this.localidadEmpleador = localidad;
    }
    getLocalidadEmpleador() {
        return this.localidadEmpleador;
    }
    setProvinciaEmpleador(provincia: string) {
        this.provinciaEmpleador = provincia;
    }
    getProvinciaEmpleador() {
        return this.provinciaEmpleador;
    }
    setTelefonoEmpleador(telefono: string) {
        this.telefonoEmpleador = telefono;
    }
    getTelefonoEmpleador() {
        return this.telefonoEmpleador;
    }

  setComercianteAprobadorId(id: number) {
        this.comercianteAprobadorId = id;
    }

    getComercianteAprobadorId() {
        return this.comercianteAprobadorId;
    }

  /**
   * Obtiene el ponderador de la solicitud.
   * 
   * @returns number - Ponderador de la solicitud.
   */
  public getPonderador(): number {
    return this.ponderador;
  }

  /**
   * Establece el ponderador de la solicitud.
   * 
   * @param ponderador - Nuevo valor del ponderador.
   */
  public setPonderador(ponderador: number): void {
    this.ponderador = ponderador;
    this.calcularLimites(); // Recalcula los límites al cambiar el ponderador
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
   * Establece el ID del analista que aprobó la solicitud.
   * 
   * @param analistaId - ID del analista aprobador.
   */
  public setAnalistaAprobadorId(analistaId: number): void {
      this.analistaAprobadorId = analistaId;
  }

  /**
   * Obtiene el ID del administrador que aprobó la solicitud.
   * 
   * @returns number | undefined - ID del administrador aprobador o undefined.
   */
  public getAdministradorAprobadorId(): number | undefined {
      return this.administradorAprobadorId;
  }

  public getImporteNeto(): number {
        return this.importeNeto;
    }

    public setImporteNeto(importeNeto: number): void {
        this.importeNeto = importeNeto;
        this.calcularLimites();
    }

    public getLimiteBase(): number {
        return this.limiteBase;
    }

    public getLimiteCompleto(): number {
        return this.limiteCompleto;
    }



    public getNuevoLimiteCompletoSolicitado(): number | null {
        return this.nuevoLimiteCompletoSolicitado ?? null;
    }

    public setNuevoLimiteCompletoSolicitado(nuevoLimite: number | null): void {
        this.nuevoLimiteCompletoSolicitado = nuevoLimite;
    }

    public isSolicitaAmpliacionDeCredito(): boolean {
        return this.solicitaAmpliacionDeCredito;
    } 

    public setSolicitaAmpliacionDeCredito(solicita: boolean): void {
        this.solicitaAmpliacionDeCredito = solicita;
    } 

    public getSolicitaAmpliacionDeCredito(): boolean {
        return this.solicitaAmpliacionDeCredito;
    }


  /**
   * Establece el ID del administrador que aprobó la solicitud.
   * 
   * @param adminId - ID del administrador aprobador.
   */
  public setAdministradorAprobadorId(adminId: number): void {
      this.administradorAprobadorId = adminId;
  }
  
  /**
   * Obtiene la fecha de aprobación de la solicitud.
   * 
   * @returns Date | undefined - Fecha de aprobación o undefined.
   */
  public getFechaAprobacion(): Date | undefined {
    return this.fechaAprobacion;
  }
  
  /**
   * Establece la fecha de aprobación de la solicitud.
   * 
   * @param fechaAprobacion - Nueva fecha de aprobación.
   */
  public setFechaAprobacion(fechaAprobacion: Date): void {
    this.fechaAprobacion = fechaAprobacion;
  }
  
  
  /**
   * Obtiene el ID del cliente asociado.
   * 
   * @returns number - ID del cliente.
   */
  public getClienteId(): number {
    return this.clienteId || 0; // Retorna 0 si clienteId no está definido
  }

   /**
   * Establece el ID del cliente asociado.
   * 
   */
  public setClienteId(clienteId:number): void {
    this.clienteId = clienteId;
  }
  
  /**
   * Obtiene el ID de la solicitud inicial asociada.
   * 
   * @returns number - ID de la solicitud inicial.
   */
  public getSolicitudInicialId(): number {
        return this.solicitudInicialId;
    }

  /**
   * Obtiene el ID del comerciante asociado.
   * 
   * @returns number - ID del comerciante.
   */
  public getComercianteId(): number {
      return this.comercianteId;
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
   * Obtiene el nombre completo del solicitante.
   * 
   * @returns string - Nombre completo del solicitante.
   */
  public getNombreCompleto(): string {
    return this.nombreCompleto;
  }

  /**
   * Establece el nombre completo del solicitante.
   * 
   * @param nombreCompleto - Nuevo nombre completo del solicitante.
   */
  public setNombreCompleto(nombreCompleto: string): void {
    this.nombreCompleto = nombreCompleto;
  }

  /**
   * Obtiene el apellido del solicitante.
   * 
   * @returns string - Apellido del solicitante.
   */
  public getApellido(): string {
    return this.apellido;
  }

  /**
   * Establece el apellido del solicitante.
   * 
   * @param apellido - Nuevo apellido del solicitante.
   */
  public setApellido(apellido: string): void {
    this.apellido = apellido;
  }

  /**
   * Obtiene el DNI del solicitante.
   * 
   * @returns string - DNI del solicitante.
   */
  /*
  public getDni(): string | null {
    return this.dni;
  }
*/
  /**
   * Establece el DNI del solicitante.
   * 
   * @param dni - Nuevo DNI del solicitante.
   */
  /*
  public setDni(dni: string): void {
    this.dni = dni;
  }
*/
  /**
   * Obtiene el teléfono del solicitante.
   * 
   * @returns string - Teléfono del solicitante.
   */
  public getTelefono(): string {
    return this.telefono;
  }

  /**
   * Establece el teléfono del solicitante.
   * 
   * @param telefono - Nuevo teléfono del solicitante.
   */
  public setTelefono(telefono: string): void {
    this.telefono = telefono;
  }

  /**
   * Obtiene el email del solicitante.
   * 
   * @returns string - Email del solicitante.
   */
  public getEmail(): string {
    return this.email;
  }

  /**
   * Establece el email del solicitante.
   * 
   * @param email - Nuevo email del solicitante.
   */
  public setEmail(email: string): void {
    this.email = email;
  }

  /**
   * Obtiene la fecha de la solicitud.
   * 
   * @returns Date - Fecha de la solicitud.
   */
  public getFechaSolicitud(): Date {
    return this.fechaSolicitud;
  }

  /**
   * Establece la fecha de la solicitud.
   * 
   * @param fechaSolicitud - Nueva fecha de la solicitud.
   */
  public setFechaSolicitud(fechaSolicitud: Date): void {
    this.fechaSolicitud = fechaSolicitud;
  }

  /**
   * Obtiene el recibo de sueldo del solicitante.
   * 
   * @returns Buffer - Recibo de sueldo.
   */
  public getRecibo(): Buffer {
    return this.recibo;
  }

  /**
   * Establece el recibo de sueldo del solicitante.
   * 
   * @param recibo - Nuevo recibo de sueldo.
   */
  public setRecibo(recibo: Buffer): void {
    this.recibo = recibo;
  }

  /**
   * Obtiene el estado actual de la solicitud.
   * 
   * @returns string - Estado de la solicitud.
   */
  public getEstado(): string {
    return this.estado;
  }

  /**
   * Establece el estado de la solicitud.
   * 
   * @param estado - Nuevo estado de la solicitud.
   */
  public setEstado(estado: "pendiente" | "aprobada" | "rechazada" | "pendiente_ampliacion" | "aprobada_sin_aumento"): void {
    this.estado = estado;
  }

  /**
   * Obtiene si el solicitante acepta tarjeta de crédito.
   * 
   * @returns boolean - true si acepta tarjeta, false en caso contrario.
   */
  public getAceptaTarjeta(): boolean {
    return this.aceptaTarjeta;
  }

  /**
   * Establece si el solicitante acepta tarjeta de crédito.
   * 
   * @param aceptaTarjeta - Nuevo valor de aceptación de tarjeta.
   */
  public setAceptaTarjeta(aceptaTarjeta: boolean): void {
    this.aceptaTarjeta = aceptaTarjeta;
  }

  /**
   * Obtiene la fecha de nacimiento del solicitante.
   * 
   * @returns Date - Fecha de nacimiento del solicitante.
   */
  public getFechaNacimiento(): Date {
    return this.fechaNacimiento;
  }

  /**
   * Establece la fecha de nacimiento del solicitante.
   * 
   * @param fechaNacimiento - Nueva fecha de nacimiento del solicitante.
   */
  public setFechaNacimiento(fechaNacimiento: Date): void {
    this.fechaNacimiento = fechaNacimiento;
  }

  /**
   * Obtiene el domicilio del solicitante.
   * 
   * @returns string - Domicilio del solicitante.
   */
  public getDomicilio(): string {
    return this.domicilio;
  }

  /**
   * Establece el domicilio del solicitante.
   * 
   * @param domicilio - Nuevo domicilio del solicitante.
   */
  public setDomicilio(domicilio: string): void {
    this.domicilio = domicilio;
  }

  /**
   * Obtiene los referentes del solicitante.
   * 
   * @returns Referente[] - Array de referentes del solicitante.
   */
  public getReferentes(): Referente[] {
    return this.referentes;
  }

  /**
   * Establece los referentes del solicitante.
   * 
   * @param referentes - Nuevo array de referentes del solicitante.
   */
  public setReferentes(referentes: Referente[]): void {
    this.referentes = referentes;
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

  public setLimiteCompleto(limiteCompleto: number): void {
    this.limiteCompleto = limiteCompleto;
  }

 

  /**
   * Convierte la solicitud formal a una representación de string.
   * Útil para logging y debugging.
   * 
   * @returns string - Representación en string de la solicitud.
   */
  public toString(): string {
    return `SolicitudFormal[id=${this.id}, estado=${this.estado}, solicitante=${this.nombreCompleto} ${this.apellido}]`;
  }

  /**
   * Obtiene el recibo como stream legible.
   * Útil para enviar archivos por HTTP.
   * 
   * @returns Readable - Stream del recibo.
   */
  public getReciboStream(): Readable {
    return Readable.from(this.recibo);
  }

  /**
   * Determina el tipo MIME del recibo de sueldo.
   * Utiliza la librería file-type para detectar el tipo de archivo.
   * 
   * @returns Promise<string> - Tipo MIME del archivo.
   */
  public async getReciboMimeType(): Promise<string> {
    const fileType = await import('file-type');
    const type = await fileType.fileTypeFromBuffer(this.recibo);
    return type?.mime || 'application/octet-stream';
  }

  /**
   * Convierte la solicitud formal a un objeto plano.
   * Útil para serialización y transferencia de datos.
   * 
   * @returns any - Objeto plano con todos los datos de la solicitud.
   */
  public toPlainObject(): any {
    return {
        id: this.id,
        solicitudInicialId: this.solicitudInicialId,
        comercianteId: this.comercianteId,
        nombreCompleto: this.nombreCompleto,
        apellido: this.apellido,
        telefono: this.telefono,
        email: this.email,
        fechaSolicitud: this.fechaSolicitud,
        recibo: this.recibo,
        estado: this.estado,
        aceptaTarjeta: this.aceptaTarjeta,
        fechaNacimiento: this.fechaNacimiento,
        domicilio: this.domicilio,
        referentes: this.referentes.map(r => r.toPlainObject()),
        comentarios: this.comentarios,
        clienteId: this.clienteId,
        fechaAprobacion: this.fechaAprobacion,
        analistaAprobadorId: this.analistaAprobadorId,
        administradorAprobadorId: this.administradorAprobadorId,
        comercianteAprobadorId: this.comercianteAprobadorId,
        importeNeto: this.importeNeto,
        limiteBase: this.limiteBase,
        limiteCompleto: this.limiteCompleto,
        ponderador: this.ponderador,
        solicitaAmpliacionDeCredito: this.solicitaAmpliacionDeCredito,
        nuevoLimiteCompletoSolicitado: this.nuevoLimiteCompletoSolicitado,
        razonSocialEmpleador: this.razonSocialEmpleador,
        cuitEmpleador: this.cuitEmpleador,
        cargoEmpleador: this.cargoEmpleador,
        sectorEmpleador: this.sectorEmpleador,
        codigoPostalEmpleador: this.codigoPostalEmpleador,
        localidadEmpleador: this.localidadEmpleador,
        provinciaEmpleador: this.provinciaEmpleador,
        telefonoEmpleador: this.telefonoEmpleador,
        sexo: this.sexo,
        codigoPostal: this.codigoPostal,
        localidad: this.localidad,
        provincia: this.provincia,
        numeroDomicilio: this.numeroDomicilio,
        barrio: this.barrio
    };
}

  /**
   * Crea una instancia de SolicitudFormal desde un mapa de datos.
   * Método estático para crear solicitudes desde datos serializados.
   * 
   * @param map - Mapa de datos para crear la instancia.
   * @returns SolicitudFormal - Nueva instancia de SolicitudFormal.
   */
  public static fromMap(map: any): SolicitudFormal {
    return new SolicitudFormal(
        map.id,
        map.solicitudInicialId,
        map.comercianteId,
        map.nombreCompleto,
        map.apellido,
        map.telefono,
        map.email,
        map.fechaSolicitud,
        map.recibo,
        map.estado,
        map.aceptaTarjeta,
        map.fechaNacimiento,
        map.domicilio,
        map.referentes.map((r: any) => Referente.fromMap(r)),
        map.importeNeto,
        map.comentarios || [],
        map.ponderador || 0,
        map.solicitaAmpliacionDeCredito || false,
        map.clienteId,
        map.razonSocialEmpleador,
        map.cuitEmpleador,
        map.cargoEmpleador,
        map.sectorEmpleador,
        map.codigoPostalEmpleador,
        map.localidadEmpleador,
        map.provinciaEmpleador,
        map.telefonoEmpleador,
        map.sexo,
        map.codigoPostal,
        map.localidad,
        map.provincia,
        map.numeroDomicilio,
        map.barrio,
        map.fechaAprobacion,
        map.analistaAprobadorId,
        map.administradorAprobadorId,
        map.comercianteAprobadorId,
        map.nuevoLimiteCompletoSolicitado
    );
}

  // Métodos para cálculos financieros
    private calcularLimites(): void {
        this.limiteBase = this.importeNeto / 2;
        this.limiteCompleto = this.importeNeto * this.ponderador;
    }

    public validarCompletitud(): void {
        const camposRequeridos = [
            this.nombreCompleto,
            this.apellido,
            this.telefono,
            this.email,
            this.recibo,
            this.fechaNacimiento,
            this.domicilio,
            this.importeNeto
        ];


        if (camposRequeridos.some(campo => {
            if (Buffer.isBuffer(campo)) return campo.length === 0;
            return !campo || (typeof campo === 'string' && campo.trim() === '');
        })) {
            throw new Error("Faltan datos obligatorios en la solicitud formal");
        }

        if (this.referentes.length === 0) {
            throw new Error("Se requiere al menos un referente");
        }

        if (this.importeNeto <= 0) {
            throw new Error("El importe neto debe ser mayor a cero");
        }


    }

    
}
