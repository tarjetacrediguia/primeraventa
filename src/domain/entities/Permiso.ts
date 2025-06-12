//src/domain/entities/Permiso.ts

export class Permiso {
  constructor(
    public readonly nombre: string,
    public descripcion: string,
    public categoria: string,
    public fechaCreacion: Date
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

  public getCategoria(): string {
    return this.categoria;
  }

  public setCategoria(categoria: string): void {
    this.categoria = categoria;
  }

  public getFechaCreacion(): Date {
    return this.fechaCreacion;
  }

  // Métodos adicionales
  public toString(): string {
    return `Permiso[nombre=${this.nombre}, categoria=${this.categoria}]`;
  }

  public toPlainObject(): any {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion,
      categoria: this.categoria,
      fechaCreacion: this.fechaCreacion
    };
  }

  public static fromMap(map: any): Permiso {
    return new Permiso(
      map.nombre,
      map.descripcion,
      map.categoria,
      map.fecha_creacion
    );
  }
}