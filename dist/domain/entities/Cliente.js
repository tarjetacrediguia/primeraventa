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
     * @param sexo - Sexo del cliente (opcional).
     * @param codigoPostal - Código postal del cliente (opcional).
     * @param localidad - Localidad del cliente (opcional).
     * @param provincia - Provincia del cliente (opcional).
     * @param cuitLaboral - CUIL laboral del cliente (opcional).
     * @param numeroDomicilio - Número del domicilio del cliente (opcional).
     * @param barrio - Barrio del cliente (opcional).
     */
    constructor(params) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        this.id = params.id;
        this.nombreCompleto = params.nombreCompleto;
        this.apellido = params.apellido;
        this.dni = params.dni;
        this.cuil = params.cuil;
        this.telefono = (_a = params.telefono) !== null && _a !== void 0 ? _a : null;
        this.email = (_b = params.email) !== null && _b !== void 0 ? _b : null;
        this.fechaNacimiento = (_c = params.fechaNacimiento) !== null && _c !== void 0 ? _c : null;
        this.domicilio = (_d = params.domicilio) !== null && _d !== void 0 ? _d : null;
        this.aceptaTarjeta = (_e = params.aceptaTarjeta) !== null && _e !== void 0 ? _e : false;
        this.fechaCreacion = (_f = params.fechaCreacion) !== null && _f !== void 0 ? _f : new Date();
        this.comercianteId = (_g = params.comercianteId) !== null && _g !== void 0 ? _g : 0;
        this.sexo = (_h = params.sexo) !== null && _h !== void 0 ? _h : null;
        this.codigoPostal = (_j = params.codigoPostal) !== null && _j !== void 0 ? _j : null;
        this.localidad = (_k = params.localidad) !== null && _k !== void 0 ? _k : null;
        this.provincia = (_l = params.provincia) !== null && _l !== void 0 ? _l : null;
        this.numeroDomicilio = (_m = params.numeroDomicilio) !== null && _m !== void 0 ? _m : null;
        this.barrio = (_o = params.barrio) !== null && _o !== void 0 ? _o : null;
        this.empleadorRazonSocial = (_p = params.empleadorRazonSocial) !== null && _p !== void 0 ? _p : null;
        this.empleadorCuit = (_q = params.empleadorCuit) !== null && _q !== void 0 ? _q : null;
        this.empleadorDomicilio = (_r = params.empleadorDomicilio) !== null && _r !== void 0 ? _r : null;
        this.empleadorTelefono = (_s = params.empleadorTelefono) !== null && _s !== void 0 ? _s : null;
        this.empleadorCodigoPostal = (_t = params.empleadorCodigoPostal) !== null && _t !== void 0 ? _t : null;
        this.empleadorLocalidad = (_u = params.empleadorLocalidad) !== null && _u !== void 0 ? _u : null;
        this.empleadorProvincia = (_v = params.empleadorProvincia) !== null && _v !== void 0 ? _v : null;
        this.nacionalidad = (_w = params.nacionalidad) !== null && _w !== void 0 ? _w : null;
        this.estadoCivil = (_x = params.estadoCivil) !== null && _x !== void 0 ? _x : null;
    }
    /*
        * Obtiene la razón social del empleador del cliente.
        *
        * @returns string | null - Razón social del empleador o null si no tiene.
        */
    getEmpleadorRazonSocial() {
        return this.empleadorRazonSocial;
    }
    /**
     * Establece la razón social del empleador del cliente.
     *
     * @param empleadorRazonSocial - Nueva razón social del empleador.
     */
    setEmpleadorRazonSocial(empleadorRazonSocial) {
        this.empleadorRazonSocial = empleadorRazonSocial;
    }
    /*
        * Obtiene el CUIL del empleador del cliente.
        *
        * @returns string | null - CUIL del empleador o null si no tiene.
        */
    getEmpleadorCuit() {
        return this.empleadorCuit;
    }
    /**
     * Establece el CUIL del empleador del cliente.
     *
     * @param empleadorCuit - Nuevo CUIL del empleador.
     */
    setEmpleadorCuit(empleadorCuit) {
        this.empleadorCuit = empleadorCuit;
    }
    /*
        * Obtiene el domicilio del empleador del cliente.
        *
        * @returns string | null - Domicilio del empleador o null si no tiene.
        */
    getEmpleadorDomicilio() {
        return this.empleadorDomicilio;
    }
    /**
     * Establece el domicilio del empleador del cliente.
     *
     * @param empleadorDomicilio - Nuevo domicilio del empleador.
     */
    setEmpleadorDomicilio(empleadorDomicilio) {
        this.empleadorDomicilio = empleadorDomicilio;
    }
    /*
        * Obtiene el teléfono del empleador del cliente.
        *
        * @returns string | null - Teléfono del empleador o null si no tiene.
        */
    getEmpleadorTelefono() {
        return this.empleadorTelefono;
    }
    /**
     * Establece el teléfono del empleador del cliente.
     *
     * @param empleadorTelefono - Nuevo teléfono del empleador.
     */
    setEmpleadorTelefono(empleadorTelefono) {
        this.empleadorTelefono = empleadorTelefono;
    }
    /*
        * Obtiene el código postal del empleador del cliente.
        *
        * @returns string | null - Código postal del empleador o null si no tiene.
        */
    getEmpleadorCodigoPostal() {
        return this.empleadorCodigoPostal;
    }
    /**
     * Establece el código postal del empleador del cliente.
     *
     * @param empleadorCodigoPostal - Nuevo código postal del empleador.
     */
    setEmpleadorCodigoPostal(empleadorCodigoPostal) {
        this.empleadorCodigoPostal = empleadorCodigoPostal;
    }
    /*
        * Obtiene la localidad del empleador del cliente.
        *
        * @returns string | null - Localidad del empleador o null si no tiene.
        */
    getEmpleadorLocalidad() {
        return this.empleadorLocalidad;
    }
    /**
     * Establece la localidad del empleador del cliente.
     *
     * @param empleadorLocalidad - Nueva localidad del empleador.
     */
    setEmpleadorLocalidad(empleadorLocalidad) {
        this.empleadorLocalidad = empleadorLocalidad;
    }
    /*
        * Obtiene la provincia del empleador del cliente.
        *
        * @returns string | null - Provincia del empleador o null si no tiene.
        */
    getEmpleadorProvincia() {
        return this.empleadorProvincia;
    }
    /**
     * Establece la provincia del empleador del cliente.
     *
     * @param empleadorProvincia - Nueva provincia del empleador.
     */
    setEmpleadorProvincia(empleadorProvincia) {
        this.empleadorProvincia = empleadorProvincia;
    }
    /*
        * Obtiene la nacionalidad del cliente.
        *
        * @returns string | null - Nacionalidad del cliente o null si no tiene.
        */
    getNacionalidad() {
        return this.nacionalidad;
    }
    /**
     * Establece la nacionalidad del cliente.
     *
     * @param nacionalidad - Nueva nacionalidad del cliente.
     */
    setNacionalidad(nacionalidad) {
        this.nacionalidad = nacionalidad;
    }
    /*
        * Obtiene el estado civil del cliente.
        *
        * @returns string | null - Estado civil del cliente o null si no tiene.
        */
    getEstadoCivil() {
        return this.estadoCivil;
    }
    /**
     * Establece el estado civil del cliente.
     *
     * @param estadoCivil - Nuevo estado civil del cliente.
     */
    setEstadoCivil(estadoCivil) {
        this.estadoCivil = estadoCivil;
    }
    /*
        * Obtiene el barrio del cliente.
        *
        * @returns string | null - Barrio del cliente o null si no tiene.
        */
    getBarrio() {
        return this.barrio;
    }
    /**
     * Establece el barrio del cliente.
     *
     * @param barrio - Nuevo barrio del cliente.
     */
    setBarrio(barrio) {
        this.barrio = barrio;
    }
    /*
        * Obtiene el número del domicilio del cliente.
        *
        * @returns string | null - Número del domicilio del cliente o null si no tiene.
        */
    getNumeroDomicilio() {
        return this.numeroDomicilio;
    }
    /**
     * Establece el número del domicilio del cliente.
     *
     * @param numeroDomicilio - Nuevo número del domicilio del cliente.
     */
    setNumeroDomicilio(numeroDomicilio) {
        this.numeroDomicilio = numeroDomicilio;
    }
    /*
        * Obtiene el código postal del cliente.
        *
        * @returns string | null - Código postal del cliente o null si no tiene.
        */
    getCodigoPostal() {
        return this.codigoPostal;
    }
    /**
     * Establece el código postal del cliente.
     *
     * @param codigoPostal - Nuevo código postal del cliente.
     */
    setCodigoPostal(codigoPostal) {
        this.codigoPostal = codigoPostal;
    }
    /*
        * Obtiene la localidad del cliente.
        *
        * @returns string | null - Localidad del cliente o null si no tiene.
        */
    getLocalidad() {
        return this.localidad;
    }
    /**
     * Establece la localidad del cliente.
     *
     * @param localidad - Nueva localidad del cliente.
     */
    setLocalidad(localidad) {
        this.localidad = localidad;
    }
    /*
        * Obtiene la provincia del cliente.
        *
        * @returns string | null - Provincia del cliente o null si no tiene.
        */
    getProvincia() {
        return this.provincia;
    }
    /**
     * Establece la provincia del cliente.
     *
     * @param provincia - Nueva provincia del cliente.
     */
    setProvincia(provincia) {
        this.provincia = provincia;
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
    /*
        * Obtiene el sexo del cliente.
        *
        * @returns string | null - Sexo del cliente o null si no tiene.
        */
    getSexo() {
        return this.sexo;
    }
    /**
     * Establece el sexo del cliente.
     *
     * @param sexo - Nuevo sexo del cliente.
     */
    setSexo(sexo) {
        this.sexo = sexo;
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
            this.domicilio !== null;
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
            aceptaTarjeta: this.aceptaTarjeta,
            fechaCreacion: this.fechaCreacion,
            comercianteId: this.comercianteId,
            sexo: this.sexo,
            codigoPostal: this.codigoPostal,
            localidad: this.localidad,
            provincia: this.provincia,
            numeroDomicilio: this.numeroDomicilio,
            barrio: this.barrio,
            empleadorRazonSocial: this.empleadorRazonSocial,
            empleadorCuit: this.empleadorCuit,
            empleadorDomicilio: this.empleadorDomicilio,
            empleadorTelefono: this.empleadorTelefono,
            empleadorCodigoPostal: this.empleadorCodigoPostal,
            empleadorLocalidad: this.empleadorLocalidad,
            empleadorProvincia: this.empleadorProvincia,
            nacionalidad: this.nacionalidad,
            estadoCivil: this.estadoCivil
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
        return new Cliente({
            id: (_a = map.id) === null || _a === void 0 ? void 0 : _a.toString(),
            nombreCompleto: map.nombreCompleto || map.nombre_completo,
            apellido: map.apellido,
            dni: map.dni,
            cuil: map.cuil,
            telefono: map.telefono,
            email: map.email,
            fechaNacimiento: map.fechaNacimiento ? new Date(map.fechaNacimiento) :
                map.fecha_nacimiento ? new Date(map.fecha_nacimiento) : null,
            domicilio: map.domicilio,
            aceptaTarjeta: (_c = (_b = map.aceptaTarjeta) !== null && _b !== void 0 ? _b : map.acepta_tarjeta) !== null && _c !== void 0 ? _c : false,
            fechaCreacion: map.fechaCreacion ? new Date(map.fechaCreacion) :
                map.fecha_creacion ? new Date(map.fecha_creacion) : new Date(),
            comercianteId: (_d = map.comercianteId) !== null && _d !== void 0 ? _d : 0
        });
    }
    /**
     * Crea una copia exacta del cliente.
     *
     * @returns Cliente - Nueva instancia con los mismos datos.
     */
    clone() {
        return new Cliente({
            id: this.id,
            nombreCompleto: this.nombreCompleto,
            apellido: this.apellido,
            dni: this.dni,
            cuil: this.cuil,
            telefono: this.telefono,
            email: this.email,
            fechaNacimiento: this.fechaNacimiento,
            domicilio: this.domicilio,
            aceptaTarjeta: this.aceptaTarjeta,
            fechaCreacion: this.fechaCreacion,
            comercianteId: this.comercianteId
        });
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
        if (datosActualizados.aceptaTarjeta !== undefined) {
            this.setAceptaTarjeta(datosActualizados.aceptaTarjeta);
        }
    }
}
exports.Cliente = Cliente;
