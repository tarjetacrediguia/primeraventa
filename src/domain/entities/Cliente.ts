// src/domain/entities/Cliente.ts
/**
 * MÓDULO: Entidad Cliente
 *
 * Este archivo define la clase Cliente que representa a un cliente en el sistema
 * de gestión de préstamos, con toda su información personal y de contacto.
 * 
 * Responsabilidades:
 * - Representar clientes del sistema de préstamos
 * - Gestionar información personal y de contacto
 * - Proporcionar validaciones de datos del cliente
 * - Calcular edad y elegibilidad para productos
 * - Manejar datos de empleo y domicilio
 * - Validar documentos argentinos (DNI, CUIL)
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

/**
 * Clase que representa un cliente en el sistema de gestión de préstamos.
 * Contiene toda la información personal, de contacto y laboral del cliente,
 * así como métodos de validación y cálculo de elegibilidad para productos.
 */
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

    /**
     * Constructor de la clase Cliente.
     * Inicializa un cliente con todos sus datos personales y de contacto.
     * 
     * @param id - Identificador único del cliente.
     * @param nombreCompleto - Nombre completo del cliente.
     * @param apellido - Apellido del cliente.
     * @param dni - DNI del cliente.
     * @param cuil - CUIL del cliente.
     * @param telefono - Número de teléfono del cliente (opcional).
     * @param email - Dirección de email del cliente (opcional).
     * @param fechaNacimiento - Fecha de nacimiento del cliente (opcional).
     * @param domicilio - Domicilio del cliente (opcional).
     * @param datosEmpleador - Datos del empleador del cliente (opcional).
     * @param aceptaTarjeta - Indica si el cliente acepta tarjeta de crédito.
     * @param fechaCreacion - Fecha de creación del registro (opcional).
     * @param comercianteId - ID del comerciante asociado al cliente.
     */
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

    /**
     * Obtiene el ID del comerciante asociado al cliente.
     * 
     * @returns number - ID del comerciante.
     */
    getComercianteId(): number {
    return this.comercianteId;
  }

    /**
     * Obtiene el ID único del cliente.
     * 
     * @returns number - ID del cliente.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * Obtiene el nombre completo del cliente.
     * 
     * @returns string - Nombre completo del cliente.
     */
    public getNombreCompleto(): string {
        return this.nombreCompleto;
    }

    /**
     * Establece el nombre completo del cliente.
     * 
     * @param nombreCompleto - Nuevo nombre completo del cliente.
     */
    public setNombreCompleto(nombreCompleto: string): void {
        this.nombreCompleto = nombreCompleto;
    }

    /**
     * Obtiene el apellido del cliente.
     * 
     * @returns string - Apellido del cliente.
     */
    public getApellido(): string {
        return this.apellido;
    }

    /**
     * Establece el apellido del cliente.
     * 
     * @param apellido - Nuevo apellido del cliente.
     */
    public setApellido(apellido: string): void {
        this.apellido = apellido;
    }

    /**
     * Obtiene el DNI del cliente.
     * 
     * @returns string - DNI del cliente.
     */
    public getDni(): string {
        return this.dni;
    }

    /**
     * Establece el DNI del cliente.
     * 
     * @param dni - Nuevo DNI del cliente.
     */
    public setDni(dni: string): void {
        this.dni = dni;
    }

    /**
     * Obtiene el CUIL del cliente.
     * 
     * @returns string - CUIL del cliente.
     */
    public getCuil(): string {
        return this.cuil;
    }

    /**
     * Establece el CUIL del cliente.
     * 
     * @param cuil - Nuevo CUIL del cliente.
     */
    public setCuil(cuil: string): void {
        this.cuil = cuil;
    }

    /**
     * Obtiene el teléfono del cliente.
     * 
     * @returns string | null - Teléfono del cliente o null si no tiene.
     */
    public getTelefono(): string | null {
        return this.telefono;
    }

    /**
     * Establece el teléfono del cliente.
     * 
     * @param telefono - Nuevo teléfono del cliente.
     */
    public setTelefono(telefono: string | null): void {
        this.telefono = telefono;
    }

    /**
     * Obtiene el email del cliente.
     * 
     * @returns string | null - Email del cliente o null si no tiene.
     */
    public getEmail(): string | null {
        return this.email;
    }

    /**
     * Establece el email del cliente.
     * 
     * @param email - Nuevo email del cliente.
     */
    public setEmail(email: string | null): void {
        this.email = email;
    }

    /**
     * Obtiene la fecha de nacimiento del cliente.
     * 
     * @returns Date | null - Fecha de nacimiento del cliente o null si no tiene.
     */
    public getFechaNacimiento(): Date | null {
        return this.fechaNacimiento;
    }

    /**
     * Establece la fecha de nacimiento del cliente.
     * 
     * @param fechaNacimiento - Nueva fecha de nacimiento del cliente.
     */
    public setFechaNacimiento(fechaNacimiento: Date | null): void {
        this.fechaNacimiento = fechaNacimiento;
    }

    /**
     * Obtiene el domicilio del cliente.
     * 
     * @returns string | null - Domicilio del cliente o null si no tiene.
     */
    public getDomicilio(): string | null {
        return this.domicilio;
    }

    /**
     * Establece el domicilio del cliente.
     * 
     * @param domicilio - Nuevo domicilio del cliente.
     */
    public setDomicilio(domicilio: string | null): void {
        this.domicilio = domicilio;
    }

    /**
     * Obtiene los datos del empleador del cliente.
     * 
     * @returns string | null - Datos del empleador o null si no tiene.
     */
    public getDatosEmpleador(): string | null {
        return this.datosEmpleador;
    }

    /**
     * Establece los datos del empleador del cliente.
     * 
     * @param datosEmpleador - Nuevos datos del empleador.
     */
    public setDatosEmpleador(datosEmpleador: string | null): void {
        this.datosEmpleador = datosEmpleador;
    }

    /**
     * Obtiene si el cliente acepta tarjeta de crédito.
     * 
     * @returns boolean - true si acepta tarjeta, false en caso contrario.
     */
    public getAceptaTarjeta(): boolean {
        return this.aceptaTarjeta;
    }

    /**
     * Establece si el cliente acepta tarjeta de crédito.
     * 
     * @param aceptaTarjeta - Nuevo valor de aceptación de tarjeta.
     */
    public setAceptaTarjeta(aceptaTarjeta: boolean): void {
        this.aceptaTarjeta = aceptaTarjeta;
    }

    /**
     * Obtiene la fecha de creación del registro del cliente.
     * 
     * @returns Date - Fecha de creación del registro.
     */
    public getFechaCreacion(): Date {
        return this.fechaCreacion;
    }

    /**
     * Obtiene el nombre completo del cliente incluyendo apellido.
     * 
     * @returns string - Nombre completo con apellido.
     */
    public getNombreCompletoConApellido(): string {
        return `${this.nombreCompleto} ${this.apellido}`;
    }

    /**
     * Calcula la edad del cliente basada en su fecha de nacimiento.
     * 
     * @returns number | null - Edad del cliente o null si no tiene fecha de nacimiento.
     */
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

    /**
     * Verifica si el cliente es mayor de edad.
     * 
     * @returns boolean - true si es mayor de edad, false en caso contrario.
     */
    public esMayorDeEdad(): boolean {
        const edad = this.getEdad();
        return edad !== null && edad >= 18;
    }

    /**
     * Verifica si el cliente tiene información de contacto completa.
     * 
     * @returns boolean - true si tiene teléfono o email, false en caso contrario.
     */
    public tieneContactoCompleto(): boolean {
        return this.telefono !== null || this.email !== null;
    }

    /**
     * Verifica si el cliente es elegible para obtener una tarjeta de crédito.
     * 
     * @returns boolean - true si es elegible, false en caso contrario.
     */
    public esElegibleParaTarjeta(): boolean {
        return this.esMayorDeEdad() && 
               this.tieneContactoCompleto() && 
               this.domicilio !== null &&
               this.datosEmpleador !== null;
    }

    /**
     * Valida el formato del DNI del cliente.
     * 
     * @returns boolean - true si el DNI es válido, false en caso contrario.
     */
    public validarDni(): boolean {
        if (!this.dni) return false;
        // Validación básica de DNI argentino (7-8 dígitos)
        const dniRegex = /^\d{7,8}$/;
        return dniRegex.test(this.dni.toString());
    }

    /**
     * Valida el formato del CUIL del cliente.
     * 
     * @returns boolean - true si el CUIL es válido, false en caso contrario.
     */
    public validarCuil(): boolean {
        if (!this.cuil) return false;
        // Validación básica de CUIL argentino (11 dígitos con formato XX-XXXXXXXX-X)
        const cuilRegex = /^\d{2}-?\d{8}-?\d{1}$|^\d{11}$/;
        return cuilRegex.test(this.cuil);
    }

    /**
     * Valida el formato del email del cliente.
     * 
     * @returns boolean - true si el email es válido o no tiene email, false en caso contrario.
     */
    public validarEmail(): boolean {
        if (!this.email) return true; // Email es opcional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    /**
     * Valida el formato del teléfono del cliente.
     * 
     * @returns boolean - true si el teléfono es válido o no tiene teléfono, false en caso contrario.
     */
    public validarTelefono(): boolean {
        if (!this.telefono) return true; // Teléfono es opcional
        // Validación básica de teléfono argentino
        const telefonoRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
        return telefonoRegex.test(this.telefono);
    }

    /**
     * Valida que todos los datos obligatorios del cliente sean correctos.
     * 
     * @returns boolean - true si todos los datos son válidos, false en caso contrario.
     */
    public esValido(): boolean {
        return this.validarDni() && 
               this.validarCuil() && 
               this.validarEmail() && 
               this.validarTelefono() &&
               this.nombreCompleto.trim().length > 0 &&
               this.apellido.trim().length > 0;
    }

    /**
     * Convierte el cliente a una representación de string.
     * Útil para logging y debugging.
     * 
     * @returns string - Representación en string del cliente.
     */
    public toString(): string {
        return `Cliente[id=${this.id}, nombreCompleto=${this.nombreCompleto}, apellido=${this.apellido}, dni=${this.dni}, cuil=${this.cuil}, email=${this.email}, telefono=${this.telefono}]`;
    }

    /**
     * Convierte el cliente a un objeto plano.
     * Útil para serialización y transferencia de datos.
     * 
     * @returns any - Objeto plano con todos los datos del cliente.
     */
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

    /**
     * Crea una instancia de Cliente desde un mapa de datos.
     * Método estático para crear clientes desde datos serializados.
     * 
     * @param map - Mapa de datos para crear la instancia.
     * @returns Cliente - Nueva instancia de Cliente.
     */
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

    /**
     * Crea una copia exacta del cliente.
     * 
     * @returns Cliente - Nueva instancia con los mismos datos.
     */
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

    /**
     * Actualiza los datos del cliente con la información proporcionada.
     * Solo actualiza los campos que se proporcionan en el objeto.
     * 
     * @param datosActualizados - Objeto con los datos a actualizar.
     */
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
