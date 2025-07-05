"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
/**
 * Clase que representa un cliente en el sistema de gestión de préstamos.
 * Contiene toda la información personal, de contacto y laboral del cliente,
 * así como métodos de validación y cálculo de elegibilidad para productos.
 */
class Cliente {
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
    constructor(id, nombreCompleto, apellido, dni, cuil, telefono = null, email = null, fechaNacimiento = null, domicilio = null, datosEmpleador = null, aceptaTarjeta = false, fechaCreacion = null, comercianteId = 0) {
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
    getComercianteId() {
        return this.comercianteId;
    }
    /**
     * Obtiene el ID único del cliente.
     *
     * @returns number - ID del cliente.
     */
    getId() {
        return this.id;
    }
    /**
     * Obtiene el nombre completo del cliente.
     *
     * @returns string - Nombre completo del cliente.
     */
    getNombreCompleto() {
        return this.nombreCompleto;
    }
    /**
     * Establece el nombre completo del cliente.
     *
     * @param nombreCompleto - Nuevo nombre completo del cliente.
     */
    setNombreCompleto(nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    /**
     * Obtiene el apellido del cliente.
     *
     * @returns string - Apellido del cliente.
     */
    getApellido() {
        return this.apellido;
    }
    /**
     * Establece el apellido del cliente.
     *
     * @param apellido - Nuevo apellido del cliente.
     */
    setApellido(apellido) {
        this.apellido = apellido;
    }
    /**
     * Obtiene el DNI del cliente.
     *
     * @returns string - DNI del cliente.
     */
    getDni() {
        return this.dni;
    }
    /**
     * Establece el DNI del cliente.
     *
     * @param dni - Nuevo DNI del cliente.
     */
    setDni(dni) {
        this.dni = dni;
    }
    /**
     * Obtiene el CUIL del cliente.
     *
     * @returns string - CUIL del cliente.
     */
    getCuil() {
        return this.cuil;
    }
    /**
     * Establece el CUIL del cliente.
     *
     * @param cuil - Nuevo CUIL del cliente.
     */
    setCuil(cuil) {
        this.cuil = cuil;
    }
    /**
     * Obtiene el teléfono del cliente.
     *
     * @returns string | null - Teléfono del cliente o null si no tiene.
     */
    getTelefono() {
        return this.telefono;
    }
    /**
     * Establece el teléfono del cliente.
     *
     * @param telefono - Nuevo teléfono del cliente.
     */
    setTelefono(telefono) {
        this.telefono = telefono;
    }
    /**
     * Obtiene el email del cliente.
     *
     * @returns string | null - Email del cliente o null si no tiene.
     */
    getEmail() {
        return this.email;
    }
    /**
     * Establece el email del cliente.
     *
     * @param email - Nuevo email del cliente.
     */
    setEmail(email) {
        this.email = email;
    }
    /**
     * Obtiene la fecha de nacimiento del cliente.
     *
     * @returns Date | null - Fecha de nacimiento del cliente o null si no tiene.
     */
    getFechaNacimiento() {
        return this.fechaNacimiento;
    }
    /**
     * Establece la fecha de nacimiento del cliente.
     *
     * @param fechaNacimiento - Nueva fecha de nacimiento del cliente.
     */
    setFechaNacimiento(fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    /**
     * Obtiene el domicilio del cliente.
     *
     * @returns string | null - Domicilio del cliente o null si no tiene.
     */
    getDomicilio() {
        return this.domicilio;
    }
    /**
     * Establece el domicilio del cliente.
     *
     * @param domicilio - Nuevo domicilio del cliente.
     */
    setDomicilio(domicilio) {
        this.domicilio = domicilio;
    }
    /**
     * Obtiene los datos del empleador del cliente.
     *
     * @returns string | null - Datos del empleador o null si no tiene.
     */
    getDatosEmpleador() {
        return this.datosEmpleador;
    }
    /**
     * Establece los datos del empleador del cliente.
     *
     * @param datosEmpleador - Nuevos datos del empleador.
     */
    setDatosEmpleador(datosEmpleador) {
        this.datosEmpleador = datosEmpleador;
    }
    /**
     * Obtiene si el cliente acepta tarjeta de crédito.
     *
     * @returns boolean - true si acepta tarjeta, false en caso contrario.
     */
    getAceptaTarjeta() {
        return this.aceptaTarjeta;
    }
    /**
     * Establece si el cliente acepta tarjeta de crédito.
     *
     * @param aceptaTarjeta - Nuevo valor de aceptación de tarjeta.
     */
    setAceptaTarjeta(aceptaTarjeta) {
        this.aceptaTarjeta = aceptaTarjeta;
    }
    /**
     * Obtiene la fecha de creación del registro del cliente.
     *
     * @returns Date - Fecha de creación del registro.
     */
    getFechaCreacion() {
        return this.fechaCreacion;
    }
    /**
     * Obtiene el nombre completo del cliente incluyendo apellido.
     *
     * @returns string - Nombre completo con apellido.
     */
    getNombreCompletoConApellido() {
        return `${this.nombreCompleto} ${this.apellido}`;
    }
    /**
     * Calcula la edad del cliente basada en su fecha de nacimiento.
     *
     * @returns number | null - Edad del cliente o null si no tiene fecha de nacimiento.
     */
    getEdad() {
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
    esMayorDeEdad() {
        const edad = this.getEdad();
        return edad !== null && edad >= 18;
    }
    /**
     * Verifica si el cliente tiene información de contacto completa.
     *
     * @returns boolean - true si tiene teléfono o email, false en caso contrario.
     */
    tieneContactoCompleto() {
        return this.telefono !== null || this.email !== null;
    }
    /**
     * Verifica si el cliente es elegible para obtener una tarjeta de crédito.
     *
     * @returns boolean - true si es elegible, false en caso contrario.
     */
    esElegibleParaTarjeta() {
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
    validarDni() {
        if (!this.dni)
            return false;
        // Validación básica de DNI argentino (7-8 dígitos)
        const dniRegex = /^\d{7,8}$/;
        return dniRegex.test(this.dni.toString());
    }
    /**
     * Valida el formato del CUIL del cliente.
     *
     * @returns boolean - true si el CUIL es válido, false en caso contrario.
     */
    validarCuil() {
        if (!this.cuil)
            return false;
        // Validación básica de CUIL argentino (11 dígitos con formato XX-XXXXXXXX-X)
        const cuilRegex = /^\d{2}-?\d{8}-?\d{1}$|^\d{11}$/;
        return cuilRegex.test(this.cuil);
    }
    /**
     * Valida el formato del email del cliente.
     *
     * @returns boolean - true si el email es válido o no tiene email, false en caso contrario.
     */
    validarEmail() {
        if (!this.email)
            return true; // Email es opcional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }
    /**
     * Valida el formato del teléfono del cliente.
     *
     * @returns boolean - true si el teléfono es válido o no tiene teléfono, false en caso contrario.
     */
    validarTelefono() {
        if (!this.telefono)
            return true; // Teléfono es opcional
        // Validación básica de teléfono argentino
        const telefonoRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
        return telefonoRegex.test(this.telefono);
    }
    /**
     * Valida que todos los datos obligatorios del cliente sean correctos.
     *
     * @returns boolean - true si todos los datos son válidos, false en caso contrario.
     */
    esValido() {
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
    toString() {
        return `Cliente[id=${this.id}, nombreCompleto=${this.nombreCompleto}, apellido=${this.apellido}, dni=${this.dni}, cuil=${this.cuil}, email=${this.email}, telefono=${this.telefono}]`;
    }
    /**
     * Convierte el cliente a un objeto plano.
     * Útil para serialización y transferencia de datos.
     *
     * @returns any - Objeto plano con todos los datos del cliente.
     */
    toPlainObject() {
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
    static fromMap(map) {
        var _a, _b, _c, _d;
        return new Cliente((_a = map.id) === null || _a === void 0 ? void 0 : _a.toString(), map.nombreCompleto || map.nombre_completo, map.apellido, map.dni, map.cuil, map.telefono, map.email, map.fechaNacimiento ? new Date(map.fechaNacimiento) :
            map.fecha_nacimiento ? new Date(map.fecha_nacimiento) : null, map.domicilio, map.datosEmpleador || map.datos_empleador, (_c = (_b = map.aceptaTarjeta) !== null && _b !== void 0 ? _b : map.acepta_tarjeta) !== null && _c !== void 0 ? _c : false, map.fechaCreacion ? new Date(map.fechaCreacion) :
            map.fecha_creacion ? new Date(map.fecha_creacion) : new Date(), (_d = map.comercianteId) !== null && _d !== void 0 ? _d : 0);
    }
    /**
     * Crea una copia exacta del cliente.
     *
     * @returns Cliente - Nueva instancia con los mismos datos.
     */
    clone() {
        return new Cliente(this.id, this.nombreCompleto, this.apellido, this.dni, this.cuil, this.telefono, this.email, this.fechaNacimiento, this.domicilio, this.datosEmpleador, this.aceptaTarjeta, this.fechaCreacion, this.comercianteId);
    }
    /**
     * Actualiza los datos del cliente con la información proporcionada.
     * Solo actualiza los campos que se proporcionan en el objeto.
     *
     * @param datosActualizados - Objeto con los datos a actualizar.
     */
    actualizar(datosActualizados) {
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
exports.Cliente = Cliente;
