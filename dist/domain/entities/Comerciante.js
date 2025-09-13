"use strict";
/**
 * MÓDULO: Entidad Comerciante
 *
 * Este archivo define la clase Comerciante que representa a un usuario comerciante
 * en el sistema de gestión de préstamos, con información específica de su negocio.
 *
 * Responsabilidades:
 * - Representar usuarios con rol de comerciante
 * - Gestionar información específica del negocio (nombre, CUIL, dirección)
 * - Proporcionar funcionalidades para comerciantes
 * - Extender la funcionalidad base de Usuario
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comerciante = void 0;
const Usuario_1 = require("./Usuario");
/**
 * Clase que representa un usuario comerciante en el sistema.
 * Extiende la clase Usuario y agrega información específica del negocio,
 * incluyendo nombre del comercio, CUIL y dirección.
 */
class Comerciante extends Usuario_1.Usuario {
    /**
     * Constructor de la clase Comerciante.
     * Inicializa un comerciante con sus datos básicos e información del negocio.
     *
     * @param id - Identificador único del comerciante.
     * @param nombre - Nombre del comerciante.
     * @param apellido - Apellido del comerciante.
     * @param email - Dirección de email del comerciante.
     * @param password - Contraseña del comerciante (hash).
     * @param telefono - Número de teléfono del comerciante.
     * @param nombreComercio - Nombre del comercio o negocio.
     * @param cuil - CUIL del comerciante.
     * @param direccionComercio - Dirección del comercio.
     * @param permisos - Array de permisos del comerciante (opcional).
     */
    constructor(params) {
        // Extraemos los parámetros específicos de Comerciante
        const { nombreComercio, cuil, direccionComercio, permisos } = params, usuarioParams = __rest(params, ["nombreComercio", "cuil", "direccionComercio", "permisos"]);
        // Llamamos al constructor padre con el objeto de parámetros de usuario
        super(usuarioParams);
        // Inicializamos los parámetros específicos de Comerciante
        this.nombreComercio = nombreComercio;
        this.cuil = cuil;
        this.direccionComercio = direccionComercio;
        this.permisos = permisos !== null && permisos !== void 0 ? permisos : [];
    }
    /**
     * Obtiene el nombre del comercio.
     *
     * @returns string - Nombre del comercio o negocio.
     */
    getNombreComercio() {
        return this.nombreComercio;
    }
    /**
     * Establece el nombre del comercio.
     *
     * @param nombreComercio - Nuevo nombre del comercio.
     */
    setNombreComercio(nombreComercio) {
        this.nombreComercio = nombreComercio;
    }
    /**
     * Obtiene el CUIL del comerciante.
     *
     * @returns string - CUIL del comerciante.
     */
    getCuil() {
        return this.cuil;
    }
    /**
     * Establece el CUIL del comerciante.
     *
     * @param cuil - Nuevo CUIL del comerciante.
     */
    setCuil(cuil) {
        this.cuil = cuil;
    }
    /**
     * Obtiene la dirección del comercio.
     *
     * @returns string - Dirección del comercio.
     */
    getDireccionComercio() {
        return this.direccionComercio;
    }
    /**
     * Establece la dirección del comercio.
     *
     * @param direccionComercio - Nueva dirección del comercio.
     */
    setDireccionComercio(direccionComercio) {
        this.direccionComercio = direccionComercio;
    }
    /**
     * Obtiene los permisos específicos del comerciante.
     *
     * @returns Permiso[] - Array de permisos del comerciante.
     */
    getPermisos() {
        return this.permisos;
    }
    /**
     * Establece los permisos del comerciante.
     *
     * @param permisos - Nuevo array de permisos para el comerciante.
     */
    setPermisos(permisos) {
        this.permisos = permisos;
    }
    /**
     * Convierte el comerciante a una representación de string.
     * Incluye la información base del usuario más los datos del comercio.
     *
     * @returns string - Representación en string del comerciante.
     */
    toString() {
        return `${super.toString()}, comercio=${this.nombreComercio}, CUIL=${this.cuil}, direccion=${this.direccionComercio}`;
    }
    /**
     * Convierte el comerciante a un objeto plano.
     * Incluye todos los datos del usuario base más la información del comercio.
     *
     * @returns any - Objeto plano con los datos del comerciante.
     */
    toPlainObject() {
        return Object.assign(Object.assign({}, super.toPlainObject()), { nombreComercio: this.nombreComercio, cuil: this.cuil, direccionComercio: this.direccionComercio });
    }
    /**
     * Crea una instancia de Comerciante desde un mapa de datos.
     * Método estático para crear comerciantes desde datos serializados.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns Comerciante - Nueva instancia de Comerciante.
     */
    static fromMap(map) {
        return new Comerciante({
            id: map.id,
            nombre: map.nombre,
            apellido: map.apellido,
            email: map.email,
            password: map.password,
            telefono: map.telefono,
            nombreComercio: map.nombreComercio,
            cuil: map.cuil,
            direccionComercio: map.direccionComercio,
            permisos: map.permisos
        });
    }
    /**
     * Autentica al comerciante comparando la contraseña proporcionada.
     * Utiliza el método de autenticación de la clase padre.
     *
     * @param password - Contraseña a verificar.
     * @returns boolean - true si la contraseña coincide, false en caso contrario.
     */
    autenticar(password) {
        return super.autenticar(password);
    }
    /**
     * Obtiene el rol específico del comerciante.
     * Implementación del método abstracto de la clase padre.
     *
     * @returns string - Rol del comerciante ('comerciante').
     */
    getRol() {
        return 'comerciante';
    }
}
exports.Comerciante = Comerciante;
