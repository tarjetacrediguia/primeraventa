"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
// src/domain/entities/Cliente.ts
class Cliente {
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
    // Getters y Setters
    getComercianteId() {
        return this.comercianteId;
    }
    getId() {
        return this.id;
    }
    getNombreCompleto() {
        return this.nombreCompleto;
    }
    setNombreCompleto(nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    getApellido() {
        return this.apellido;
    }
    setApellido(apellido) {
        this.apellido = apellido;
    }
    getDni() {
        return this.dni;
    }
    setDni(dni) {
        this.dni = dni;
    }
    getCuil() {
        return this.cuil;
    }
    setCuil(cuil) {
        this.cuil = cuil;
    }
    getTelefono() {
        return this.telefono;
    }
    setTelefono(telefono) {
        this.telefono = telefono;
    }
    getEmail() {
        return this.email;
    }
    setEmail(email) {
        this.email = email;
    }
    getFechaNacimiento() {
        return this.fechaNacimiento;
    }
    setFechaNacimiento(fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    getDomicilio() {
        return this.domicilio;
    }
    setDomicilio(domicilio) {
        this.domicilio = domicilio;
    }
    getDatosEmpleador() {
        return this.datosEmpleador;
    }
    setDatosEmpleador(datosEmpleador) {
        this.datosEmpleador = datosEmpleador;
    }
    getAceptaTarjeta() {
        return this.aceptaTarjeta;
    }
    setAceptaTarjeta(aceptaTarjeta) {
        this.aceptaTarjeta = aceptaTarjeta;
    }
    getFechaCreacion() {
        return this.fechaCreacion;
    }
    // Métodos de negocio
    getNombreCompletoConApellido() {
        return `${this.nombreCompleto} ${this.apellido}`;
    }
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
    esMayorDeEdad() {
        const edad = this.getEdad();
        return edad !== null && edad >= 18;
    }
    tieneContactoCompleto() {
        return this.telefono !== null || this.email !== null;
    }
    esElegibleParaTarjeta() {
        return this.esMayorDeEdad() &&
            this.tieneContactoCompleto() &&
            this.domicilio !== null &&
            this.datosEmpleador !== null;
    }
    // Métodos de validación
    validarDni() {
        if (!this.dni)
            return false;
        // Validación básica de DNI argentino (7-8 dígitos)
        const dniRegex = /^\d{7,8}$/;
        return dniRegex.test(this.dni.toString());
    }
    validarCuil() {
        if (!this.cuil)
            return false;
        // Validación básica de CUIL argentino (11 dígitos con formato XX-XXXXXXXX-X)
        const cuilRegex = /^\d{2}-?\d{8}-?\d{1}$|^\d{11}$/;
        return cuilRegex.test(this.cuil);
    }
    validarEmail() {
        if (!this.email)
            return true; // Email es opcional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }
    validarTelefono() {
        if (!this.telefono)
            return true; // Teléfono es opcional
        // Validación básica de teléfono argentino
        const telefonoRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
        return telefonoRegex.test(this.telefono);
    }
    esValido() {
        return this.validarDni() &&
            this.validarCuil() &&
            this.validarEmail() &&
            this.validarTelefono() &&
            this.nombreCompleto.trim().length > 0 &&
            this.apellido.trim().length > 0;
    }
    // Métodos adicionales
    toString() {
        return `Cliente[id=${this.id}, nombreCompleto=${this.nombreCompleto}, apellido=${this.apellido}, dni=${this.dni}, cuil=${this.cuil}, email=${this.email}, telefono=${this.telefono}]`;
    }
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
    static fromMap(map) {
        var _a, _b, _c, _d;
        return new Cliente((_a = map.id) === null || _a === void 0 ? void 0 : _a.toString(), map.nombreCompleto || map.nombre_completo, map.apellido, map.dni, map.cuil, map.telefono, map.email, map.fechaNacimiento ? new Date(map.fechaNacimiento) :
            map.fecha_nacimiento ? new Date(map.fecha_nacimiento) : null, map.domicilio, map.datosEmpleador || map.datos_empleador, (_c = (_b = map.aceptaTarjeta) !== null && _b !== void 0 ? _b : map.acepta_tarjeta) !== null && _c !== void 0 ? _c : false, map.fechaCreacion ? new Date(map.fechaCreacion) :
            map.fecha_creacion ? new Date(map.fecha_creacion) : new Date(), (_d = map.comercianteId) !== null && _d !== void 0 ? _d : 0);
    }
    // Método para crear una copia del cliente
    clone() {
        return new Cliente(this.id, this.nombreCompleto, this.apellido, this.dni, this.cuil, this.telefono, this.email, this.fechaNacimiento, this.domicilio, this.datosEmpleador, this.aceptaTarjeta, this.fechaCreacion, this.comercianteId);
    }
    // Método para actualizar los datos del cliente
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
