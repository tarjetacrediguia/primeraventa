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
        return new Cliente_1.Cliente({
            id: row.id,
            nombreCompleto: row.nombre_completo,
            apellido: row.apellido,
            dni: row.dni,
            cuil: row.cuil || "",
            telefono: row.telefono,
            email: row.email,
            fechaNacimiento: row.fecha_nacimiento ? new Date(row.fecha_nacimiento) : null,
            domicilio: row.domicilio,
            aceptaTarjeta: row.acepta_tarjeta,
            fechaCreacion: row.fecha_creacion ? new Date(row.fecha_creacion) : new Date(),
            comercianteId: row.comerciante_id || 0,
            sexo: row.sexo || null,
            codigoPostal: row.codigo_postal || null,
            localidad: row.localidad || null,
            provincia: row.provincia || null,
            numeroDomicilio: row.numero_domicilio || null,
            barrio: row.barrio || null,
            empleadorRazonSocial: row.empleador_razon_social || null,
            empleadorCuit: row.empleador_cuit || null,
            empleadorDomicilio: row.empleador_domicilio || null,
            empleadorTelefono: row.empleador_telefono || null,
            empleadorCodigoPostal: row.empleador_codigo_postal || null,
            empleadorLocalidad: row.empleador_localidad || null,
            empleadorProvincia: row.empleador_provincia || null,
            nacionalidad: row.nacionalidad || null,
            estadoCivil: row.estado_civil || null
        });
    }
    /**
     * Obtiene un cliente por su ID.
     * @param id - ID del cliente a buscar.
     * @returns Promise<Cliente> - El cliente encontrado.
     * @throws Error si el cliente no existe.
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM clientes WHERE id = $1";
            const result = yield DatabaseDonfig_1.pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error("Cliente no encontrado");
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
            const query = "SELECT * FROM clientes WHERE dni = $1";
            const result = yield DatabaseDonfig_1.pool.query(query, [dni]);
            if (result.rows.length === 0) {
                throw new Error("Cliente no encontrado");
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
            const query = "SELECT * FROM clientes WHERE cuil = $1";
            const result = yield DatabaseDonfig_1.pool.query(query, [cuil]);
            if (result.rows.length === 0) {
                throw new Error("Cliente no encontrado");
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
            const query = "SELECT * FROM clientes WHERE email = $1";
            const result = yield DatabaseDonfig_1.pool.query(query, [email]);
            if (result.rows.length === 0) {
                throw new Error("Cliente no encontrado");
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
            const query = "SELECT * FROM clientes";
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
                acepta_tarjeta,
                sexo,
                codigo_postal,
                localidad,
                provincia,
                numero_domicilio,
                barrio,
                nacionalidad,
                estado_civil,
                empleador_razon_social,
                empleador_cuit,
                empleador_domicilio,
                empleador_telefono,
                empleador_codigo_postal,
                empleador_localidad,
                empleador_provincia
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
            RETURNING *
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
                cliente.getAceptaTarjeta(),
                cliente.getSexo(),
                cliente.getCodigoPostal(),
                cliente.getLocalidad(),
                cliente.getProvincia(),
                cliente.getNumeroDomicilio(),
                cliente.getBarrio(),
                cliente.getNacionalidad(),
                cliente.getEstadoCivil(),
                cliente.getEmpleadorRazonSocial(),
                cliente.getEmpleadorCuit(),
                cliente.getEmpleadorDomicilio(),
                cliente.getEmpleadorTelefono(),
                cliente.getEmpleadorCodigoPostal(),
                cliente.getEmpleadorLocalidad(),
                cliente.getEmpleadorProvincia(),
            ];
            const result = yield DatabaseDonfig_1.pool.query(query, values);
            return this.mapRowToCliente(result.rows[0]);
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
                acepta_tarjeta = $9,
                sexo = $10,
                codigo_postal = $11,
                localidad = $12,
                provincia = $13,
                numero_domicilio = $14,
                barrio = $15,
                nacionalidad = $16,
                estado_civil = $17,
                empleador_razon_social = $18,
                empleador_cuit = $19,
                empleador_domicilio = $20,
                empleador_telefono = $21,
                empleador_codigo_postal = $22,
                empleador_localidad = $23,
                empleador_provincia = $24
            WHERE id = $25
            RETURNING *
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
                cliente.getAceptaTarjeta(),
                cliente.getSexo(),
                cliente.getCodigoPostal(),
                cliente.getLocalidad(),
                cliente.getProvincia(),
                cliente.getNumeroDomicilio(),
                cliente.getBarrio(),
                cliente.getNacionalidad(),
                cliente.getEstadoCivil(),
                cliente.getEmpleadorRazonSocial(),
                cliente.getEmpleadorCuit(),
                cliente.getEmpleadorDomicilio(),
                cliente.getEmpleadorTelefono(),
                cliente.getEmpleadorCodigoPostal(),
                cliente.getEmpleadorLocalidad(),
                cliente.getEmpleadorProvincia(),
                cliente.getId(),
            ];
            const result = yield DatabaseDonfig_1.pool.query(query, values);
            return this.mapRowToCliente(result.rows[0]);
        });
    }
    /**
     * Elimina un cliente por su ID.
     * @param id - ID del cliente a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "DELETE FROM clientes WHERE id = $1";
            yield DatabaseDonfig_1.pool.query(query, [id]);
        });
    }
    /*
     * Obtiene un cliente por ID con verificación de pertenencia al comerciante
     * @param id - ID del cliente
     * @param comercianteId - ID del comerciante
     * @returns Promise<Cliente> - El cliente si existe y pertenece al comerciante
     */
    findByIdWithComercianteCheck(id, comercianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT c.* 
            FROM clientes c
            INNER JOIN solicitudes_iniciales si ON c.id = si.cliente_id
            WHERE c.id = $1 AND si.comerciante_id = $2
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [id, comercianteId]);
            if (result.rows.length === 0) {
                throw new Error("Cliente no encontrado o no pertenece al comerciante");
            }
            return this.mapRowToCliente(result.rows[0]);
        });
    }
}
exports.ClienteRepositoryAdapter = ClienteRepositoryAdapter;
