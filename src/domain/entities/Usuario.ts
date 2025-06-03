// src/domain/entities/Usuario.ts
export abstract class Usuario {
  // Atributos
  private readonly id: string;
    private nombre: string;
    private apellido: string;
    private email: string;
    private password: string;
    private telefono: string;
  constructor(
    id: string | undefined,
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    telefono: string
  ) {
    this.id = id || '';
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.password = password;
    this.telefono = telefono;
  }

  // Getters y Setters
  public getId(): string | undefined {
    return this.id;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public getApellido(): string {
    return this.apellido;
  }

  public setApellido(apellido: string): void {
    this.apellido = apellido;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getTelefono(): string {
    return this.telefono;
  }

  public setTelefono(telefono: string): void {
    this.telefono = telefono;
  }

  public getPassword(): string {
      return this.password;
  }

  // Métodos adicionales
  public toString(): string {
    return `Usuario[id=${this.id}, nombre=${this.nombre}, apellido=${this.apellido}, email=${this.email}, telefono=${this.telefono}]`;
  }

  public toPlainObject(): any {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      telefono: this.telefono
    };
  }

  public static fromMap(map: any): Usuario {
    throw new Error("No se puede instanciar clase abstracta directamente");
  }

  public autenticar(password: string): boolean {
        // Implementación real debería comparar hashes, no texto plano
        return this.password === password;
    }
}