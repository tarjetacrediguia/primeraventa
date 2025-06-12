
// src/domain/entities/Cliente.ts
export class Cliente {
    // Atributos
    private readonly id: number;
    private nombreCompleto: string;
    private apellido: string;
    private dni: string;
    private cuil: string;
    private telefono: string | null;
    private email: string | null;
    private fechaNacimiento: Date | null;
    private domicilio: string | null;
    private datosEmpleador: string | null;
    private aceptaTarjeta: boolean;
    private readonly fechaCreacion: Date;
    public comercianteId: number

    constructor(
        id: number,
        nombreCompleto: string,
        apellido: string,
        dni: string,
        cuil: string,
        telefono: string | null = null,
        email: string | null = null,
        fechaNacimiento: Date | null = null,
        domicilio: string | null = null,
        datosEmpleador: string | null = null,
        aceptaTarjeta: boolean = false,
        fechaCreacion: Date | null = null,
        comercianteId: number = 0
    ) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.apellido = apellido;
        this.dni = dni;
        this.cuil = cuil;
        this.telefono = telefono;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.domicilio = domicilio;
        this.datosEmpleador = datosEmpleador;
        this.aceptaTarjeta = aceptaTarjeta;
        this.fechaCreacion = fechaCreacion || new Date();
        this.comercianteId = comercianteId;
    }

    // Getters y Setters

    getComercianteId(): number {
    return this.comercianteId;
  }


    public getId(): number {
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

    public getCuil(): string {
        return this.cuil;
    }

    public setCuil(cuil: string): void {
        this.cuil = cuil;
    }

    public getTelefono(): string | null {
        return this.telefono;
    }

    public setTelefono(telefono: string | null): void {
        this.telefono = telefono;
    }

    public getEmail(): string | null {
        return this.email;
    }

    public setEmail(email: string | null): void {
        this.email = email;
    }

    public getFechaNacimiento(): Date | null {
        return this.fechaNacimiento;
    }

    public setFechaNacimiento(fechaNacimiento: Date | null): void {
        this.fechaNacimiento = fechaNacimiento;
    }

    public getDomicilio(): string | null {
        return this.domicilio;
    }

    public setDomicilio(domicilio: string | null): void {
        this.domicilio = domicilio;
    }

    public getDatosEmpleador(): string | null {
        return this.datosEmpleador;
    }

    public setDatosEmpleador(datosEmpleador: string | null): void {
        this.datosEmpleador = datosEmpleador;
    }

    public getAceptaTarjeta(): boolean {
        return this.aceptaTarjeta;
    }

    public setAceptaTarjeta(aceptaTarjeta: boolean): void {
        this.aceptaTarjeta = aceptaTarjeta;
    }

    public getFechaCreacion(): Date {
        return this.fechaCreacion;
    }

    // Métodos de negocio
    public getNombreCompletoConApellido(): string {
        return `${this.nombreCompleto} ${this.apellido}`;
    }

    public getEdad(): number | null {
        if (!this.fechaNacimiento) {
            return null;
        }
        const hoy = new Date();
        const edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
        const mesActual = hoy.getMonth();
        const mesNacimiento = this.fechaNacimiento.getMonth();
        
        if (mesActual < mesNacimiento || 
            (mesActual === mesNacimiento && hoy.getDate() < this.fechaNacimiento.getDate())) {
            return edad - 1;
        }
        return edad;
    }

    public esMayorDeEdad(): boolean {
        const edad = this.getEdad();
        return edad !== null && edad >= 18;
    }

    public tieneContactoCompleto(): boolean {
        return this.telefono !== null || this.email !== null;
    }

    public esElegibleParaTarjeta(): boolean {
        return this.esMayorDeEdad() && 
               this.tieneContactoCompleto() && 
               this.domicilio !== null &&
               this.datosEmpleador !== null;
    }

    // Métodos de validación
    public validarDni(): boolean {
        if (!this.dni) return false;
        // Validación básica de DNI argentino (7-8 dígitos)
        const dniRegex = /^\d{7,8}$/;
        return dniRegex.test(this.dni.toString());
    }

    public validarCuil(): boolean {
        if (!this.cuil) return false;
        // Validación básica de CUIL argentino (11 dígitos con formato XX-XXXXXXXX-X)
        const cuilRegex = /^\d{2}-?\d{8}-?\d{1}$|^\d{11}$/;
        return cuilRegex.test(this.cuil);
    }

    public validarEmail(): boolean {
        if (!this.email) return true; // Email es opcional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    public validarTelefono(): boolean {
        if (!this.telefono) return true; // Teléfono es opcional
        // Validación básica de teléfono argentino
        const telefonoRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
        return telefonoRegex.test(this.telefono);
    }

    public esValido(): boolean {
        return this.validarDni() && 
               this.validarCuil() && 
               this.validarEmail() && 
               this.validarTelefono() &&
               this.nombreCompleto.trim().length > 0 &&
               this.apellido.trim().length > 0;
    }

    // Métodos adicionales
    public toString(): string {
        return `Cliente[id=${this.id}, nombreCompleto=${this.nombreCompleto}, apellido=${this.apellido}, dni=${this.dni}, cuil=${this.cuil}, email=${this.email}, telefono=${this.telefono}]`;
    }

    public toPlainObject(): any {
        return {
            id: this.id,
            nombreCompleto: this.nombreCompleto,
            apellido: this.apellido,
            dni: this.dni,
            cuil: this.cuil,
            telefono: this.telefono,
            email: this.email,
            fechaNacimiento: this.fechaNacimiento,
            domicilio: this.domicilio,
            datosEmpleador: this.datosEmpleador,
            aceptaTarjeta: this.aceptaTarjeta,
            fechaCreacion: this.fechaCreacion,
            comercianteId: this.comercianteId
        };
    }

    public static fromMap(map: any): Cliente {
        return new Cliente(
            map.id?.toString(),
            map.nombreCompleto || map.nombre_completo,
            map.apellido,
            map.dni,
            map.cuil,
            map.telefono,
            map.email,
            map.fechaNacimiento ? new Date(map.fechaNacimiento) : 
            map.fecha_nacimiento ? new Date(map.fecha_nacimiento) : null,
            map.domicilio,
            map.datosEmpleador || map.datos_empleador,
            map.aceptaTarjeta ?? map.acepta_tarjeta ?? false,
            map.fechaCreacion ? new Date(map.fechaCreacion) : 
            map.fecha_creacion ? new Date(map.fecha_creacion) : new Date(),
            map.comercianteId ?? 0
        );
    }

    // Método para crear una copia del cliente
    public clone(): Cliente {
        return new Cliente(
            this.id,
            this.nombreCompleto,
            this.apellido,
            this.dni,
            this.cuil,
            this.telefono,
            this.email,
            this.fechaNacimiento,
            this.domicilio,
            this.datosEmpleador,
            this.aceptaTarjeta,
            this.fechaCreacion,
            this.comercianteId
        );
    }

    // Método para actualizar los datos del cliente
    public actualizar(datosActualizados: Partial<{
        nombreCompleto: string;
        apellido: string;
        telefono: string | null;
        email: string | null;
        fechaNacimiento: Date | null;
        domicilio: string | null;
        datosEmpleador: string | null;
        aceptaTarjeta: boolean;
    }>): void {
        if (datosActualizados.nombreCompleto !== undefined) {
            this.setNombreCompleto(datosActualizados.nombreCompleto);
        }
        if (datosActualizados.apellido !== undefined) {
            this.setApellido(datosActualizados.apellido);
        }
        if (datosActualizados.telefono !== undefined) {
            this.setTelefono(datosActualizados.telefono);
        }
        if (datosActualizados.email !== undefined) {
            this.setEmail(datosActualizados.email);
        }
        if (datosActualizados.fechaNacimiento !== undefined) {
            this.setFechaNacimiento(datosActualizados.fechaNacimiento);
        }
        if (datosActualizados.domicilio !== undefined) {
            this.setDomicilio(datosActualizados.domicilio);
        }
        if (datosActualizados.datosEmpleador !== undefined) {
            this.setDatosEmpleador(datosActualizados.datosEmpleador);
        }
        if (datosActualizados.aceptaTarjeta !== undefined) {
            this.setAceptaTarjeta(datosActualizados.aceptaTarjeta);
        }
    }
}