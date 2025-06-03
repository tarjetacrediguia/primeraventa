// src/domain/entities/Comerciante.ts
import { Usuario } from "./Usuario";

export class Comerciante extends Usuario {

  private nombreComercio: string
  private cuil: string
  private direccionComercio: string
  private permisos: string[]

  constructor(
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    telefono: string,
    nombreComercio: string,
    cuil: string,
    direccionComercio: string,
    permisos:string[]
  ) {
    super(id, nombre, apellido, email, password, telefono);
    this.nombreComercio = nombreComercio;
    this.cuil = cuil;
    this.direccionComercio = direccionComercio;
    this.permisos = permisos;
  }

  // Getters y Setters
  public getNombreComercio(): string {
    return this.nombreComercio;
  }

  public setNombreComercio(nombreComercio: string): void {
    this.nombreComercio = nombreComercio;
  }

  public getCuil(): string {
    return this.cuil;
  }

  public setCuil(cuil: string): void {
    this.cuil = cuil;
  }

  public getDireccionComercio(): string {
    return this.direccionComercio;
  }

  public setDireccionComercio(direccionComercio: string): void {
    this.direccionComercio = direccionComercio;
  }

  public getPermisos(): string[] {
    return this.permisos;
  }

  public setPermisos(permisos: string[]): void {
    this.permisos = permisos;
  }

  // Métodos adicionales
  public toString(): string {
    return `${super.toString()}, comercio=${this.nombreComercio}, CUIL=${this.cuil}, direccion=${this.direccionComercio}`;
  }

  public toPlainObject(): any {
    return {
      ...super.toPlainObject(),
      nombreComercio: this.nombreComercio,
      cuil: this.cuil,
      direccionComercio: this.direccionComercio
    };
  }

  public static fromMap(map: any): Comerciante {
    return new Comerciante(
      map.id,
      map.nombre,
      map.apellido,
      map.email,
      map.password,
      map.telefono,
      map.nombreComercio,
      map.cuil,
      map.direccionComercio,
      map.permisos
    );
  }

  autenticar(password: string): boolean {
    return super.autenticar(password);
  }
}