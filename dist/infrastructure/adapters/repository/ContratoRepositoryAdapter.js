"use strict";
// src/infrastructure/adapters/repository/ContratoRepositoryAdapter.ts
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
exports.ContratoRepositoryAdapter = void 0;
const Contrato_1 = require("../../../domain/entities/Contrato");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
class ContratoRepositoryAdapter {
    /**
     * Guarda un contrato en la base de datos (alias de createContrato).
     * @param contrato - Objeto Contrato a guardar.
     * @returns Promise<Contrato> - El contrato guardado con su ID asignado.
     */
    saveContrato(contrato) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createContrato(contrato);
        });
    }
    /**
     * Obtiene un contrato por su ID.
     * @param id - ID del contrato a buscar.
     * @returns Promise<Contrato | null> - El contrato encontrado o null si no existe.
     */
    getContratoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_tarjeta, numero_cuenta
            FROM contratos 
            WHERE id = $1
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return this.mapRowToContrato(result.rows[0]);
        });
    }
    /**
     * Actualiza los datos de un contrato existente.
     * @param contrato - Objeto Contrato con los datos actualizados.
     * @returns Promise<Contrato> - El contrato actualizado.
     */
    updateContrato(contrato) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                const query = `
                UPDATE contratos 
                SET fecha_generacion = $1, 
                    monto = $2, 
                    estado = $3, 
                    solicitud_formal_id = $4, 
                    cliente_id = $5, 
                    numero_tarjeta = $6, 
                    numero_cuenta = $7
                WHERE id = $8
            `;
                yield client.query(query, [
                    contrato.getFechaGeneracion(),
                    contrato.getMonto(),
                    contrato.getEstado(),
                    contrato.getSolicitudFormalId(),
                    contrato.getClienteId(),
                    contrato.getNumeroTarjeta(),
                    contrato.getNumeroCuenta(),
                    contrato.getId()
                ]);
                yield client.query('COMMIT');
                // Devolver el contrato actualizado
                const updated = yield this.getContratoById(contrato.getId().toString());
                if (!updated) {
                    throw new Error("Error al recuperar contrato actualizado");
                }
                return updated;
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
    /**
     * Elimina un contrato por su ID.
     * @param id - ID del contrato a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    deleteContrato(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                yield client.query('DELETE FROM contratos WHERE id = $1', [id]);
                yield client.query('COMMIT');
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
    /**
     * Crea un nuevo contrato en la base de datos.
     * @param contrato - Objeto Contrato a crear.
     * @returns Promise<Contrato> - El contrato creado con su ID asignado.
     */
    createContrato(contrato) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                const query = `
      INSERT INTO contratos 
        (solicitud_formal_id, cliente_id, fecha_generacion, 
         monto, estado, numero_tarjeta, numero_cuenta)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, fecha_generacion, monto, estado, 
                solicitud_formal_id, cliente_id, 
                numero_tarjeta, numero_cuenta
    `;
                const result = yield DatabaseDonfig_1.pool.query(query, [
                    contrato.getSolicitudFormalId(),
                    contrato.getClienteId(),
                    contrato.getFechaGeneracion(),
                    contrato.getMonto(),
                    contrato.getEstado(),
                    contrato.getNumeroTarjeta(),
                    contrato.getNumeroCuenta()
                ]);
                yield client.query('COMMIT');
                const savedData = result.rows[0];
                return this.mapRowToContrato(savedData);
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
    /**
     * Obtiene todos los contratos del sistema.
     * @returns Promise<Contrato[]> - Array de todos los contratos.
     */
    getAllContratos() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_tarjeta, numero_cuenta
            FROM contratos
        `;
            const result = yield DatabaseDonfig_1.pool.query(query);
            return result.rows.map(row => this.mapRowToContrato(row));
        });
    }
    /**
     * Obtiene contratos por ID de solicitud formal.
     * @param solicitudFormalId - ID de la solicitud formal.
     * @returns Promise<Contrato[]> - Array de contratos asociados a la solicitud.
     */
    getContratosBySolicitudFormalId(solicitudFormalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_tarjeta, numero_cuenta
            FROM contratos
            WHERE solicitud_formal_id = $1
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [solicitudFormalId]);
            return result.rows.map(row => this.mapRowToContrato(row));
        });
    }
    /**
     * Obtiene contratos por ID de analista.
     * @param analistaId - ID del analista.
     * @returns Promise<Contrato[]> - Array de contratos aprobados por el analista.
     */
    getContratosByAnalistaId(analistaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT c.id, c.fecha_generacion, c.monto, c.estado, 
                   c.solicitud_formal_id, c.cliente_id, 
                   c.numero_tarjeta, c.numero_cuenta
            FROM contratos c
            JOIN solicitudes_formales sf ON c.solicitud_formal_id = sf.id
            WHERE sf.analista_aprobador_id = $1
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [analistaId]);
            return result.rows.map(row => this.mapRowToContrato(row));
        });
    }
    /**
     * Obtiene contratos por ID de comerciante.
     * @param comercianteId - ID del comerciante.
     * @returns Promise<Contrato[]> - Array de contratos del comerciante.
     */
    getContratosByComercianteId(comercianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT c.id, c.fecha_generacion, c.monto, c.estado, 
                   c.solicitud_formal_id, c.cliente_id, 
                   c.numero_tarjeta, c.numero_cuenta
            FROM contratos c
            JOIN solicitudes_formales sf ON c.solicitud_formal_id = sf.id
            WHERE sf.comerciante_id = $1
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [comercianteId]);
            return result.rows.map(row => this.mapRowToContrato(row));
        });
    }
    /**
     * Obtiene contratos por estado.
     * @param estado - Estado de los contratos a buscar.
     * @returns Promise<Contrato[]> - Array de contratos con el estado especificado.
     */
    getContratosByEstado(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_tarjeta, numero_cuenta
            FROM contratos
            WHERE estado = $1
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [estado]);
            return result.rows.map(row => this.mapRowToContrato(row));
        });
    }
    mapRowToContrato(row) {
        return new Contrato_1.Contrato(row.id, row.fecha_generacion, parseFloat(row.monto), row.estado, Number(row.solicitud_formal_id), Number(row.cliente_id), row.numero_tarjeta, row.numero_cuenta);
    }
}
exports.ContratoRepositoryAdapter = ContratoRepositoryAdapter;
