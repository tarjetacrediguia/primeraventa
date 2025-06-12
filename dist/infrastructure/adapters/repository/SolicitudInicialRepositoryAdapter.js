"use strict";
//src/infrastructure/adapters/repository/SolicitudInicialRepositoryAdapter.ts
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
exports.SolicitudInicialRepositoryAdapter = void 0;
const SolicitudInicial_1 = require("../../../domain/entities/SolicitudInicial");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
class SolicitudInicialRepositoryAdapter {
    createSolicitudInicial(solicitudInicial) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Buscar cliente por DNI o crear uno nuevo
                let clienteId;
                const dniCliente = solicitudInicial.getDniCliente();
                const cuilCliente = solicitudInicial.getCuilCliente();
                const clienteQuery = `SELECT id FROM clientes WHERE dni = $1`;
                const clienteResult = yield client.query(clienteQuery, [dniCliente]);
                if (clienteResult.rows.length === 0) {
                    // Crear nuevo cliente con datos mínimos
                    const insertClienteQuery = `
                    INSERT INTO clientes (
                        nombre_completo, apellido, dni, cuil, 
                        telefono, email, fecha_nacimiento, domicilio, 
                        datos_empleador, acepta_tarjeta
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    RETURNING id
                `;
                    const insertClienteValues = [
                        'Nombre por definir', // nombre_completo
                        'Apellido por definir', // apellido
                        dniCliente,
                        cuilCliente,
                        null, // telefono
                        null, // email
                        null, // fecha_nacimiento
                        null, // domicilio
                        null, // datos_empleador
                        false // acepta_tarjeta
                    ];
                    const insertResult = yield client.query(insertClienteQuery, insertClienteValues);
                    clienteId = insertResult.rows[0].id;
                }
                else {
                    clienteId = clienteResult.rows[0].id;
                }
                // Crear la solicitud inicial
                const query = `
                INSERT INTO solicitudes_iniciales (
                    cliente_id, comerciante_id, fecha_creacion, estado, 
                    reciboSueldo, comentarios
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, fecha_creacion
            `;
                const values = [
                    clienteId,
                    solicitudInicial.getComercianteId() || null,
                    solicitudInicial.getFechaCreacion(),
                    solicitudInicial.getEstado(),
                    solicitudInicial.getReciboSueldo() || null,
                    solicitudInicial.getComentarios()
                ];
                const result = yield client.query(query, values);
                const createdRow = result.rows[0];
                yield client.query('COMMIT');
                // Retornar la solicitud creada con su ID
                return new SolicitudInicial_1.SolicitudInicial(createdRow.id.toString(), createdRow.fecha_creacion, solicitudInicial.getEstado(), dniCliente, clienteId, cuilCliente, solicitudInicial.getReciboSueldo(), solicitudInicial.getComercianteId(), solicitudInicial.getComentarios());
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getSolicitudInicialById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE si.id = $1
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return this.mapRowToSolicitudInicial(result.rows[0]);
        });
    }
    updateSolicitudInicial(solicitudInicial) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Verificar que el cliente existe y obtener su ID
                const clienteQuery = `SELECT id FROM clientes WHERE dni = $1`;
                const clienteResult = yield client.query(clienteQuery, [solicitudInicial.getDniCliente()]);
                if (clienteResult.rows.length === 0) {
                    throw new Error(`Cliente con DNI ${solicitudInicial.getDniCliente()} no encontrado`);
                }
                const clienteId = clienteResult.rows[0].id;
                const query = `
                UPDATE solicitudes_iniciales
                SET 
                    cliente_id = $1,
                    comerciante_id = $2,
                    estado = $3,
                    reciboSueldo = $4,
                    comentarios = $5,
                    fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id = $6
                RETURNING *
            `;
                const values = [
                    clienteId,
                    solicitudInicial.getComercianteId() || null,
                    solicitudInicial.getEstado(),
                    solicitudInicial.getReciboSueldo() || null,
                    solicitudInicial.getComentarios(),
                    solicitudInicial.getId()
                ];
                const result = yield client.query(query, values);
                if (result.rows.length === 0) {
                    throw new Error(`Solicitud inicial con ID ${solicitudInicial.getId()} no encontrada`);
                }
                yield client.query('COMMIT');
                // Obtener los datos completos para retornar
                const solicitudActualizada = yield this.getSolicitudInicialById(solicitudInicial.getId());
                return solicitudActualizada;
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getAllSolicitudesIniciales() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            ORDER BY si.fecha_creacion DESC
        `;
            const result = yield DatabaseDonfig_1.pool.query(query);
            return result.rows.map(row => this.mapRowToSolicitudInicial(row));
        });
    }
    getSolicitudesInicialesByDni(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE c.dni = $1
            ORDER BY si.fecha_creacion DESC
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [dni]);
            return result.rows.map(row => this.mapRowToSolicitudInicial(row));
        });
    }
    getSolicitudesInicialesByEstado(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE si.estado = $1
            ORDER BY si.fecha_creacion DESC
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [estado]);
            return result.rows.map(row => this.mapRowToSolicitudInicial(row));
        });
    }
    getSolicitudesInicialesByFecha(fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE DATE(si.fecha_creacion) = DATE($1)
            ORDER BY si.fecha_creacion DESC
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [fecha]);
            return result.rows.map(row => this.mapRowToSolicitudInicial(row));
        });
    }
    getSolicitudesInicialesByComercianteId(comercianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE si.comerciante_id = $1
            ORDER BY si.fecha_creacion DESC
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [comercianteId]);
            return result.rows.map(row => this.mapRowToSolicitudInicial(row));
        });
    }
    getSolicitudesInicialesByClienteId(clienteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                si.id, si.fecha_creacion, si.estado, si.reciboSueldo, 
                si.comentarios, si.comerciante_id,
                c.dni as dni_cliente, c.cuil as cuil_cliente
            FROM solicitudes_iniciales si
            INNER JOIN clientes c ON si.cliente_id = c.id
            WHERE si.cliente_id = $1
            ORDER BY si.fecha_creacion DESC
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [clienteId]);
            return result.rows.map(row => this.mapRowToSolicitudInicial(row));
        });
    }
    mapRowToSolicitudInicial(row) {
        var _a;
        return new SolicitudInicial_1.SolicitudInicial(row.id.toString(), row.fecha_creacion, row.estado, row.dni_cliente, row.cuil_cliente, row.recibosueldo || undefined, // BYTEA field
        ((_a = row.comerciante_id) === null || _a === void 0 ? void 0 : _a.toString()) || undefined, row.comentarios || []);
    }
}
exports.SolicitudInicialRepositoryAdapter = SolicitudInicialRepositoryAdapter;
