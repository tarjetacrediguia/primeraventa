// src/domain/entities/SolicitudFormal.ts
import { Referente } from "./Referente";

export class SolicitudFormal {
    private readonly id: string;
    private nombreCompleto: string;
    private apellido: string;
    private dni: string;
    private telefono: string;
    private email: string;
    private fechaSolicitud: Date;
    private recibo: Buffer;
    private estado: "pendiente" | "aprobada" | "rechazada";
    private aceptaTarjeta: boolean;
    private fechaNacimiento: Date;
    private domicilio: string;
    private datosEmpleador: string;
    private referentes: Referente[];
    private comentarios: string[];

  constructor(
    id: string,
    nombreCompleto: string,
    apellido: string,
    dni: string,
    telefono: string,
    email: string,
    fechaSolicitud: Date,
    recibo: Buffer,
    estado: "pendiente" | "aprobada" | "rechazada",
    aceptaTarjeta: boolean,
    fechaNacimiento: Date,
    domicilio: string,
    datosEmpleador: string,
    referentes: Referente[],
    comentarios: string[] = [] // Nuevo parámetro
  ) {
    this.id = id;
    this.nombreCompleto = nombreCompleto;
    this.apellido = apellido;
    this.dni = dni;
    this.telefono = telefono;
    this.email = email;
    this.fechaSolicitud = fechaSolicitud;
    this.recibo = recibo;
    this.estado = estado;
    this.aceptaTarjeta = aceptaTarjeta;
    this.fechaNacimiento = fechaNacimiento;
    this.domicilio = domicilio;
    this.datosEmpleador = datosEmpleador;
    this.referentes = referentes || [];
    this.comentarios = comentarios;
  }

  // Getters y Setters
  public getId(): string {
    return this.id;
  }

  public getNombreCompleto(): string {
    return this.nombreCompleto;
  }

  public setNombreCompleto(nombreCompleto: string): void {
    this.nombreCompleto = nombreCompleto;
  }

  public getApellido(): string {
    return this.apellido;
  }

  public setApellido(apellido: string): void {
    this.apellido = apellido;
  }

  public getDni(): string {
    return this.dni;
  }

  public setDni(dni: string): void {
    this.dni = dni;
  }

  public getTelefono(): string {
    return this.telefono;
  }

  public setTelefono(telefono: string): void {
    this.telefono = telefono;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getFechaSolicitud(): Date {
    return this.fechaSolicitud;
  }

  public setFechaSolicitud(fechaSolicitud: Date): void {
    this.fechaSolicitud = fechaSolicitud;
  }

  public getRecibo(): Buffer {
    return this.recibo;
  }

  public setRecibo(recibo: Buffer): void {
    this.recibo = recibo;
  }

  public getEstado(): string {
    return this.estado;
  }

  public setEstado(estado: "pendiente" | "aprobada" | "rechazada"): void {
    this.estado = estado;
  }

  public getAceptaTarjeta(): boolean {
    return this.aceptaTarjeta;
  }

  public setAceptaTarjeta(aceptaTarjeta: boolean): void {
    this.aceptaTarjeta = aceptaTarjeta;
  }

  public getFechaNacimiento(): Date {
    return this.fechaNacimiento;
  }

  public setFechaNacimiento(fechaNacimiento: Date): void {
    this.fechaNacimiento = fechaNacimiento;
  }

  public getDomicilio(): string {
    return this.domicilio;
  }

  public setDomicilio(domicilio: string): void {
    this.domicilio = domicilio;
  }

  public getDatosEmpleador(): string {
    return this.datosEmpleador;
  }

  public setDatosEmpleador(datosEmpleador: string): void {
    this.datosEmpleador = datosEmpleador;
  }

  public getReferentes(): Referente[] {
    return this.referentes;
  }

  public setReferentes(referentes: Referente[]): void {
    this.referentes = referentes;
  }

  // Métodos para comentarios
  public getComentarios(): string[] {
    return this.comentarios;
  }

  public setComentarios(comentarios: string[]): void {
    this.comentarios = comentarios;
  }

  public agregarComentario(comentario: string): void {
    this.comentarios.push(comentario);
  }

  // Métodos adicionales
  public toString(): string {
    return `SolicitudFormal[id=${this.id}, estado=${this.estado}, solicitante=${this.nombreCompleto} ${this.apellido}]`;
  }

  public toPlainObject(): any {
    return {
      id: this.id,
      nombreCompleto: this.nombreCompleto,
      apellido: this.apellido,
      dni: this.dni,
      telefono: this.telefono,
      email: this.email,
      fechaSolicitud: this.fechaSolicitud,
      recibo: this.recibo,
      estado: this.estado,
      aceptaTarjeta: this.aceptaTarjeta,
      fechaNacimiento: this.fechaNacimiento,
      domicilio: this.domicilio,
      datosEmpleador: this.datosEmpleador,
      referentes: this.referentes.map(r => r.toPlainObject()),
      comentarios: this.comentarios // Nuevo campo
    };
  }

  public static fromMap(map: any): SolicitudFormal {
    return new SolicitudFormal(
      map.id,
      map.nombreCompleto,
      map.apellido,
      map.dni,
      map.telefono,
      map.email,
      map.fechaSolicitud,
      map.recibo,
      map.estado,
      map.aceptaTarjeta,
      map.fechaNacimiento,
      map.domicilio,
      map.datosEmpleador,
      map.referentes.map((r: any) => Referente.fromMap(r)),
      map.comentarios || []
    );
  }
}