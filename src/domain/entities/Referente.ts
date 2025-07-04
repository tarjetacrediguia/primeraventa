// src/domain/entities/Referente.ts
export class Referente {
    private id?: number;
    private nombreCompleto: string
    private apellido: string
    private vinculo: string
    private telefono: string
  constructor(
    nombreCompleto: string,
    apellido: string,
    vinculo: string,
    telefono: string
  ) {
    this.nombreCompleto = nombreCompleto;
    this.apellido = apellido;
    this.vinculo = vinculo;
    this.telefono = telefono;
  }

  // Getters y Setters
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

  public getVinculo(): string {
    return this.vinculo;
  }

  public setVinculo(vinculo: string): void {
    this.vinculo = vinculo;
  }

  public getTelefono(): string {
    return this.telefono;
  }

  public setTelefono(telefono: string): void {
    this.telefono = telefono;
  }

   public getId(): number | undefined {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

  // Métodos adicionales
  public toString(): string {
    return `Referente[nombre=${this.nombreCompleto} ${this.apellido}, vinculo=${this.vinculo}, tel=${this.telefono}]`;
  }

  public toPlainObject(): any {
    return {
      nombreCompleto: this.nombreCompleto,
      apellido: this.apellido,
      vinculo: this.vinculo,
      telefono: this.telefono
    };
  }

  public static fromMap(map: any): Referente {
    return new Referente(
      map.nombreCompleto,
      map.apellido,
      map.vinculo,
      map.telefono
    );
  }
}
