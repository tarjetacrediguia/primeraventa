// src/domain/entities/ArchivosAdjuntos.ts
export class ArchivoAdjunto {
  private id: number;
  private nombre: string;
  private tipo: string;
  private contenido: Buffer;
  private fechaCreacion: Date;

  constructor(
    id: number,
    nombre: string,
    tipo: string,
    contenido: Buffer,
    fechaCreacion: Date = new Date()
  ) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.contenido = contenido;
    this.fechaCreacion = fechaCreacion;
  }

  // Getters
  public getId(): number { return this.id; }
  public getNombre(): string { return this.nombre; }
  public getTipo(): string { return this.tipo; }
  public getContenido(): Buffer { return this.contenido; }
  public getFechaCreacion(): Date { return this.fechaCreacion; }

  // Setters
    public setNombre(nombre: string): void { this.nombre = nombre; }
    public setTipo(tipo: string): void { this.tipo = tipo; }
    public setContenido(contenido: Buffer): void { this.contenido = contenido; }
    public setFechaCreacion(fechaCreacion: Date): void { this.fechaCreacion = fechaCreacion; }
    public setId(id: number): void { this.id = id; }

  public toPlainObject(): any {
    return {
      id: this.id,
      nombre: this.nombre,
      tipo: this.tipo,
      contenido: this.contenido.toString('base64'),
      fechaCreacion: this.fechaCreacion
    };
  }
}