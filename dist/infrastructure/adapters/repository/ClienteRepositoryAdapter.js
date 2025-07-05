"use strict";
// src/infrastructure/repositories/ClienteRepositoryAdapter.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteRepositoryAdapter = void 0;
const Cliente_1 = require("../../../domain/entities/Cliente");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
class ClienteRepositoryAdapter {
    constructor() { }
    mapRowToCliente(row) {
        return new Cliente_1.Cliente(row.id, row.nombre_completo, row.apellido, row.dni, row.cuil || '', row.telefono, row.email, row.fecha_nacimiento ? new Date(row.fecha_nacimiento) : null, row.domicilio, row.datos_empleador, row.acepta_tarjeta, row.fecha_creacion ? new Date(row.fecha_creacion) : new Date(), 0 // comercianteId no está en la tabla clientes
        );
    }
    /**
     * Obtiene un cliente por su ID.
     * @param id - ID del cliente a buscar.
     * @returns Promise<Cliente> - El cliente encontrado.
     * @throws Error si el cliente no existe.
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM clientes WHERE id = $1';
            const result = yield DatabaseDonfig_1.pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Cliente no encontrado');
            }
            return this.mapRowToCliente(result.rows[0]);
        });
    }
    /**
     * Obtiene un cliente por su DNI.
     * @param dni - DNI del cliente a buscar.
     * @returns Promise<Cliente> - El cliente encontrado.
     * @throws Error si el cliente no existe.
     */
    findByDni(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM clientes WHERE dni = $1';
            const result = yield DatabaseDonfig_1.pool.query(query, [dni]);
            if (result.rows.length === 0) {
                throw new Error('Cliente no encontrado');
            }
            return this.mapRowToCliente(result.rows[0]);
        });
    }
    /**
     * Obtiene un cliente por su CUIL.
     * @param cuil - CUIL del cliente a buscar.
     * @returns Promise<Cliente> - El cliente encontrado.
     * @throws Error si el cliente no existe.
     */
    findByCuil(cuil) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM clientes WHERE cuil = $1';
            const result = yield DatabaseDonfig_1.pool.query(query, [cuil]);
            if (result.rows.length === 0) {
                throw new Error('Cliente no encontrado');
            }
            return this.mapRowToCliente(result.rows[0]);
        });
    }
    /**
     * Obtiene un cliente por su email.
     * @param email - Email del cliente a buscar.
     * @returns Promise<Cliente> - El cliente encontrado.
     * @throws Error si el cliente no existe.
     */
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM clientes WHERE email = $1';
            const result = yield DatabaseDonfig_1.pool.query(query, [email]);
            if (result.rows.length === 0) {
                throw new Error('Cliente no encontrado');
            }
            return this.mapRowToCliente(result.rows[0]);
        });
    }
    /**
     * Obtiene todos los clientes del sistema.
     * @returns Promise<Cliente[]> - Array de todos los clientes.
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM clientes';
            const result = yield DatabaseDonfig_1.pool.query(query);
            return result.rows.map((row) => this.mapRowToCliente(row));
        });
    }
    /**
     * Guarda un nuevo cliente en la base de datos.
     * @param cliente - Objeto Cliente a guardar.
     * @returns Promise<void> - No retorna valor.
     */
    save(cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            INSERT INTO clientes (
                nombre_completo, 
                apellido, 
                dni, 
                cuil, 
                telefono, 
                email, 
                fecha_nacimiento, 
                domicilio, 
                datos_empleador, 
                acepta_tarjeta
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
            const values = [
                cliente.getNombreCompleto(),
                cliente.getApellido(),
                cliente.getDni(),
                cliente.getCuil(),
                cliente.getTelefono(),
                cliente.getEmail(),
                cliente.getFechaNacimiento(),
                cliente.getDomicilio(),
                cliente.getDatosEmpleador(),
                cliente.getAceptaTarjeta()
            ];
            yield DatabaseDonfig_1.pool.query(query, values);
        });
    }
    /**
     * Actualiza los datos de un cliente existente.
     * @param cliente - Objeto Cliente con los datos actualizados.
     * @returns Promise<void> - No retorna valor.
     */
    update(cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            UPDATE clientes SET
                nombre_completo = $1,
                apellido = $2,
                dni = $3,
                cuil = $4,
                telefono = $5,
                email = $6,
                fecha_nacimiento = $7,
                domicilio = $8,
                datos_empleador = $9,
                acepta_tarjeta = $10
            WHERE id = $11
        `;
            const values = [
                cliente.getNombreCompleto(),
                cliente.getApellido(),
                cliente.getDni(),
                cliente.getCuil(),
                cliente.getTelefono(),
                cliente.getEmail(),
                cliente.getFechaNacimiento(),
                cliente.getDomicilio(),
                cliente.getDatosEmpleador(),
                cliente.getAceptaTarjeta(),
                cliente.getId()
            ];
            yield DatabaseDonfig_1.pool.query(query, values);
        });
    }
    /**
     * Elimina un cliente por su ID.
     * @param id - ID del cliente a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM clientes WHERE id = $1';
            yield DatabaseDonfig_1.pool.query(query, [id]);
        });
    }
}
exports.ClienteRepositoryAdapter = ClienteRepositoryAdapter;
