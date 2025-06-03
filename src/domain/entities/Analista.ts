// src/domain/entities/Analista.ts
import { Usuario } from "./Usuario";
  
export class Analista extends Usuario {
  private permisos: string[]
  constructor(
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    telefono: string,
    permisos: string[]
  ) {
    super(id, nombre, apellido, email, password, telefono);
    this.permisos = permisos;
  }

  // Getters y Setters
  public getPermisos(): string[] {
    return this.permisos;
  }

  public setPermisos(permisos: string[]): void {
    this.permisos = permisos;
  }

  // Métodos adicionales
  public toString(): string {
    return `${super.toString()}, permisos=${this.permisos.join(',')}`;
  }

  public toPlainObject(): any {
    return {
      ...super.toPlainObject(),
      permisos: this.permisos
    };
  }

  public static fromMap(map: any): Analista {
    return new Analista(
      map.id,
      map.nombre,
      map.apellido,
      map.email,
      map.password,
      map.telefono,
      map.permisos
    );
  }

  autenticar(password: string): boolean {
    return super.autenticar(password);
  }
}