//src/domain/entities/Permiso.ts

export class Permiso {
  constructor(
    public readonly nombre: string,
    public descripcion: string
  ) {}

  // Getters y Setters
  public getNombre(): string {
    return this.nombre;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  public setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }


  // Métodos adicionales
  public toString(): string {
    return `Permiso[nombre=${this.nombre}, descripcion=${this.descripcion}]`;
  }

  public toPlainObject(): any {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion
    };
  }

  public static fromMap(map: any): Permiso {
    return new Permiso(
      map.nombre,
      map.descripcion
    );
  }
}