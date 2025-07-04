"use strict";
//src/infrastructure/adapters/repository/SolicitudFormalRepositoryAdapter.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudFormalRepositoryAdapter = void 0;
const SolicitudFormal_1 = require("../../../domain/entities/SolicitudFormal");
const Referente_1 = require("../../../domain/entities/Referente");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
class SolicitudFormalRepositoryAdapter {
    // src/infrastructure/adapters/repository/SolicitudFormalRepositoryAdapter.ts
    /**
     * Crea una nueva solicitud formal en la base de datos.
     * @param solicitudFormal - Objeto SolicitudFormal a crear.
     * @returns Promise<SolicitudFormal> - La solicitud formal creada con su ID asignado.
     */
    createSolicitudFormal(solicitudFormal) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // 1. Obtener cliente_id de la solicitud inicial asociada
                const initQuery = `SELECT cliente_id FROM solicitudes_iniciales WHERE id = $1`;
                const initResult = yield client.query(initQuery, [solicitudFormal.getSolicitudInicialId()]);
                if (initResult.rows.length === 0) {
                    throw new Error('Solicitud inicial no encontrada');
                }
                const clienteId = initResult.rows[0].cliente_id;
                if (!clienteId) {
                    throw new Error('La solicitud inicial no tiene un cliente asociado');
                }
                // 2. Actualizar cliente con los nuevos datos
                const updateClienteQuery = `
                UPDATE clientes SET
                    nombre_completo = $1,
                    apellido = $2,
                    telefono = $3,
                    email = $4,
                    fecha_nacimiento = $5,
                    domicilio = $6,
                    datos_empleador = $7,
                    acepta_tarjeta = $8
                WHERE id = $9
            `;
                yield client.query(updateClienteQuery, [
                    solicitudFormal.getNombreCompleto(),
                    solicitudFormal.getApellido(),
                    solicitudFormal.getTelefono(),
                    solicitudFormal.getEmail(),
                    solicitudFormal.getFechaNacimiento(),
                    solicitudFormal.getDomicilio(),
                    solicitudFormal.getDatosEmpleador(),
                    solicitudFormal.getAceptaTarjeta(),
                    clienteId
                ]);
                // 3. Crear solicitud formal usando el mismo cliente_id
                const reciboStream = solicitudFormal.getReciboStream();
                const chunks = [];
                try {
                    for (var _d = true, reciboStream_1 = __asyncValues(reciboStream), reciboStream_1_1; reciboStream_1_1 = yield reciboStream_1.next(), _a = reciboStream_1_1.done, !_a; _d = true) {
                        _c = reciboStream_1_1.value;
                        _d = false;
                        const chunk = _c;
                        chunks.push(chunk);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = reciboStream_1.return)) yield _b.call(reciboStream_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                const reciboBuffer = Buffer.concat(chunks);
                // Insertar en la base de datos
                const solicitudQuery = `
          INSERT INTO solicitudes_formales (
            cliente_id, 
            solicitud_inicial_id, 
            comerciante_id,
            fecha_solicitud, 
            recibo, 
            estado, 
            acepta_tarjeta, 
            comentarios
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id
        `;
                const solicitudValues = [
                    clienteId,
                    solicitudFormal.getSolicitudInicialId(),
                    solicitudFormal.getComercianteId(),
                    solicitudFormal.getFechaSolicitud(),
                    solicitudFormal.getRecibo(),
                    solicitudFormal.getEstado(),
                    solicitudFormal.getAceptaTarjeta(),
                    solicitudFormal.getComentarios()
                ];
                const solicitudResult = yield client.query(solicitudQuery, solicitudValues);
                const solicitudId = solicitudResult.rows[0].id;
                // 4. Insertar referentes
                for (let i = 0; i < solicitudFormal.getReferentes().length; i++) {
                    const referente = solicitudFormal.getReferentes()[i];
                    const referenteQuery = `
                    INSERT INTO referentes (nombre_completo, apellido, vinculo, telefono)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `;
                    const referenteValues = [
                        referente.getNombreCompleto(),
                        referente.getApellido(),
                        referente.getVinculo(),
                        referente.getTelefono()
                    ];
                    const referenteResult = yield client.query(referenteQuery, referenteValues);
                    const referenteId = referenteResult.rows[0].id;
                    const relacionQuery = `
                    INSERT INTO solicitud_referente (solicitud_formal_id, referente_id, orden)
                    VALUES ($1, $2, $3)
                `;
                    yield client.query(relacionQuery, [solicitudId, referenteId, i + 1]);
                }
                yield client.query('COMMIT');
                // Retornar la solicitud creada
                return yield this.getSolicitudFormalById(solicitudId);
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw new Error(`Error al crear solicitud formal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Obtiene una solicitud formal por su ID.
     * @param id - ID de la solicitud formal a buscar.
     * @returns Promise<SolicitudFormal | null> - La solicitud formal encontrada o null si no existe.
     */
    getSolicitudFormalById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.dni,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.comerciante_id,
                sf.numero_cuenta,
                sf.numero_tarjeta,
                sf.fecha_aprobacion,
                sf.analista_aprobador_id,
                sf.administrador_aprobador_id
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE sf.id = $1
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [id]);
            if (result.rows.length === 0) {
                return null;
            }
            const row = result.rows[0];
            // Obtener referentes
            const referentesQuery = `
            SELECT r.nombre_completo, r.apellido, r.vinculo, r.telefono, sr.orden
            FROM referentes r
            INNER JOIN solicitud_referente sr ON r.id = sr.referente_id
            WHERE sr.solicitud_formal_id = $1
            ORDER BY sr.orden
        `;
            const referentesResult = yield DatabaseDonfig_1.pool.query(referentesQuery, [id]);
            const referentes = referentesResult.rows.map(refRow => new Referente_1.Referente(refRow.nombre_completo, refRow.apellido, refRow.vinculo, refRow.telefono));
            return new SolicitudFormal_1.SolicitudFormal(Number(row.id), // Convertir a número
            row.solicitud_inicial_id, row.comerciante_id, row.nombre_completo, row.apellido, row.dni, row.telefono, row.email, new Date(row.fecha_solicitud), row.recibo, row.estado, row.acepta_tarjeta, new Date(row.fecha_nacimiento), row.domicilio, row.datos_empleador, referentes, row.comentarios || [], row.cliente_id || 0, row.numero_tarjeta, row.numero_cuenta, row.fecha_aprobacion ? new Date(row.fecha_aprobacion) : undefined, row.analista_aprobador_id, row.administrador_aprobador_id);
        });
    }
    /**
     * Actualiza los datos de una solicitud formal existente.
     * @param solicitudFormal - Objeto SolicitudFormal con los datos actualizados.
     * @returns Promise<SolicitudFormal> - La solicitud formal actualizada.
     */
    updateSolicitudFormal(solicitudFormal) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Buscar la solicitud formal por solicitud_inicial_id
                const buscarQuery = `
                SELECT sf.id, sf.cliente_id 
                FROM solicitudes_formales sf 
                WHERE sf.solicitud_inicial_id = $1
            `;
                const buscarResult = yield client.query(buscarQuery, [solicitudFormal.getSolicitudInicialId()]);
                if (buscarResult.rows.length === 0) {
                    throw new Error(`No existe una solicitud formal con solicitud_inicial_id: ${solicitudFormal.getSolicitudInicialId()}`);
                }
                const solicitudId = buscarResult.rows[0].id;
                const clienteId = buscarResult.rows[0].cliente_id;
                // Actualizar cliente
                const actualizarClienteQuery = `
                UPDATE clientes 
                SET nombre_completo = $1, apellido = $2, telefono = $3, email = $4,
                    fecha_nacimiento = $5, domicilio = $6, datos_empleador = $7, acepta_tarjeta = $8
                WHERE id = $9
            `;
                yield client.query(actualizarClienteQuery, [
                    solicitudFormal.getNombreCompleto(),
                    solicitudFormal.getApellido(),
                    solicitudFormal.getTelefono(),
                    solicitudFormal.getEmail(),
                    solicitudFormal.getFechaNacimiento(),
                    solicitudFormal.getDomicilio(),
                    solicitudFormal.getDatosEmpleador(),
                    solicitudFormal.getAceptaTarjeta(),
                    clienteId
                ]);
                // Actualizar solicitud formal
                const actualizarSolicitudQuery = `
                UPDATE solicitudes_formales
                SET fecha_solicitud = $1, recibo = $2, estado = $3, acepta_tarjeta = $4, 
                    comentarios = $5, fecha_actualizacion = CURRENT_TIMESTAMP, numero_tarjeta = $7, numero_cuenta = $8
                WHERE id = $6
            `;
                yield client.query(actualizarSolicitudQuery, [
                    solicitudFormal.getFechaSolicitud(),
                    solicitudFormal.getRecibo(),
                    solicitudFormal.getEstado(),
                    solicitudFormal.getAceptaTarjeta(),
                    solicitudFormal.getComentarios(),
                    solicitudId,
                    solicitudFormal.getNumeroTarjeta(),
                    solicitudFormal.getNumeroCuenta()
                ]);
                // Eliminar referentes existentes
                yield client.query('DELETE FROM solicitud_referente WHERE solicitud_formal_id = $1', [solicitudId]);
                const referentesIds = yield client.query('SELECT referente_id FROM solicitud_referente WHERE solicitud_formal_id = $1', [solicitudId]);
                for (const refId of referentesIds.rows) {
                    yield client.query('DELETE FROM referentes WHERE id = $1', [refId.referente_id]);
                }
                // Insertar nuevos referentes
                for (let i = 0; i < solicitudFormal.getReferentes().length; i++) {
                    const referente = solicitudFormal.getReferentes()[i];
                    const referenteQuery = `
                    INSERT INTO referentes (nombre_completo, apellido, vinculo, telefono)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `;
                    const referenteResult = yield client.query(referenteQuery, [
                        referente.getNombreCompleto(),
                        referente.getApellido(),
                        referente.getVinculo(),
                        referente.getTelefono()
                    ]);
                    const referenteId = referenteResult.rows[0].id;
                    yield client.query('INSERT INTO solicitud_referente (solicitud_formal_id, referente_id, orden) VALUES ($1, $2, $3)', [solicitudId, referenteId, i + 1]);
                }
                yield client.query('COMMIT');
                return yield this.getSolicitudFormalById(solicitudId.toString());
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw new Error(`Error al actualizar solicitud formal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Actualiza el estado de aprobación de una solicitud formal.
     * @param solicitudFormal - Objeto SolicitudFormal con el nuevo estado de aprobación.
     * @returns Promise<SolicitudFormal> - La solicitud formal actualizada.
     */
    updateSolicitudFormalAprobacion(solicitudFormal) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Obtener ID directamente de la entidad
                const solicitudId = solicitudFormal.getId();
                // 1. Obtener cliente_id de la solicitud
                const clienteIdQuery = 'SELECT cliente_id FROM solicitudes_formales WHERE id = $1';
                const clienteIdResult = yield client.query(clienteIdQuery, [solicitudId]);
                if (clienteIdResult.rows.length === 0) {
                    throw new Error(`Solicitud formal no encontrada: ${solicitudId}`);
                }
                const clienteId = clienteIdResult.rows[0].cliente_id;
                // Actualizar cliente
                const actualizarClienteQuery = `
                UPDATE clientes 
                SET nombre_completo = $1, apellido = $2, telefono = $3, email = $4,
                    fecha_nacimiento = $5, domicilio = $6, datos_empleador = $7, acepta_tarjeta = $8
                WHERE id = $9
            `;
                yield client.query(actualizarClienteQuery, [
                    solicitudFormal.getNombreCompleto(),
                    solicitudFormal.getApellido(),
                    solicitudFormal.getTelefono(),
                    solicitudFormal.getEmail(),
                    solicitudFormal.getFechaNacimiento(),
                    solicitudFormal.getDomicilio(),
                    solicitudFormal.getDatosEmpleador(),
                    solicitudFormal.getAceptaTarjeta(),
                    clienteId
                ]);
                // Actualizar solicitud formal
                const actualizarSolicitudQuery = `
            UPDATE solicitudes_formales
            SET 
                fecha_solicitud = $1, 
                recibo = $2, 
                estado = $3, 
                acepta_tarjeta = $4, 
                comentarios = $5,
                numero_tarjeta = $6,
                numero_cuenta = $7,
                fecha_aprobacion = CURRENT_TIMESTAMP,
                analista_aprobador_id = $9,
                administrador_aprobador_id = $10
            WHERE id = $8
        `;
                yield client.query(actualizarSolicitudQuery, [
                    solicitudFormal.getFechaSolicitud(),
                    solicitudFormal.getRecibo(),
                    solicitudFormal.getEstado(),
                    solicitudFormal.getAceptaTarjeta(),
                    solicitudFormal.getComentarios(),
                    solicitudFormal.getNumeroTarjeta(),
                    solicitudFormal.getNumeroCuenta(),
                    solicitudFormal.getId(),
                    solicitudFormal.getAnalistaAprobadorId(),
                    solicitudFormal.getAdministradorAprobadorId()
                ]);
                // Eliminar referentes existentes
                yield client.query('DELETE FROM solicitud_referente WHERE solicitud_formal_id = $1', [solicitudId]);
                const referentesIds = yield client.query('SELECT referente_id FROM solicitud_referente WHERE solicitud_formal_id = $1', [solicitudId]);
                for (const refId of referentesIds.rows) {
                    yield client.query('DELETE FROM referentes WHERE id = $1', [refId.referente_id]);
                }
                // Insertar nuevos referentes
                for (let i = 0; i < solicitudFormal.getReferentes().length; i++) {
                    const referente = solicitudFormal.getReferentes()[i];
                    const referenteQuery = `
                    INSERT INTO referentes (nombre_completo, apellido, vinculo, telefono)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `;
                    const referenteResult = yield client.query(referenteQuery, [
                        referente.getNombreCompleto(),
                        referente.getApellido(),
                        referente.getVinculo(),
                        referente.getTelefono()
                    ]);
                    const referenteId = referenteResult.rows[0].id;
                    yield client.query('INSERT INTO solicitud_referente (solicitud_formal_id, referente_id, orden) VALUES ($1, $2, $3)', [solicitudId, referenteId, i + 1]);
                }
                yield client.query('COMMIT');
                return yield this.getSolicitudFormalById(solicitudId);
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw new Error(`Error al actualizar solicitud formal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Actualiza el estado de rechazo de una solicitud formal.
     * @param solicitudFormal - Objeto SolicitudFormal con el nuevo estado de rechazo.
     * @returns Promise<SolicitudFormal> - La solicitud formal actualizada.
     */
    updateSolicitudFormalRechazo(solicitudFormal) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                const solicitudId = solicitudFormal.getId();
                // Actualizar solicitud formal con información de rechazo
                const actualizarSolicitudQuery = `
            UPDATE solicitudes_formales
            SET 
                estado = $1,
                comentarios = $2,
                fecha_actualizacion = CURRENT_TIMESTAMP,
                analista_aprobador_id = $3,
                administrador_aprobador_id = $4
            WHERE id = $5
        `;
                yield client.query(actualizarSolicitudQuery, [
                    solicitudFormal.getEstado(),
                    solicitudFormal.getComentarios(),
                    solicitudFormal.getAnalistaAprobadorId(),
                    solicitudFormal.getAdministradorAprobadorId(),
                    solicitudId
                ]);
                // Registrar acción en el historial
                const accion = `Solicitud formal ${solicitudId} rechazada`;
                const detalles = {
                    comentarios: solicitudFormal.getComentarios(),
                    aprobador_id: solicitudFormal.getAnalistaAprobadorId() || solicitudFormal.getAdministradorAprobadorId()
                };
                yield client.query('INSERT INTO historial (usuario_id, accion, entidad_afectada, entidad_id, detalles) VALUES ($1, $2, $3, $4, $5)', [
                    solicitudFormal.getAnalistaAprobadorId() || solicitudFormal.getAdministradorAprobadorId(),
                    accion,
                    'solicitudes_formales',
                    solicitudId,
                    JSON.stringify(detalles)
                ]);
                yield client.query('COMMIT');
                return yield this.getSolicitudFormalById(solicitudId);
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw new Error(`Error al rechazar solicitud formal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Elimina una solicitud formal por su ID.
     * @param id - ID de la solicitud formal a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    deleteSolicitudFormal(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Buscar la solicitud formal
                const buscarQuery = 'SELECT id FROM solicitudes_formales WHERE solicitud_inicial_id = $1';
                const buscarResult = yield client.query(buscarQuery, [id]);
                if (buscarResult.rows.length === 0) {
                    throw new Error(`No existe una solicitud formal con solicitud_inicial_id: ${id}`);
                }
                const solicitudId = buscarResult.rows[0].id;
                // Eliminar referentes asociados
                const referentesQuery = `
                SELECT referente_id FROM solicitud_referente WHERE solicitud_formal_id = $1
            `;
                const referentesResult = yield client.query(referentesQuery, [solicitudId]);
                for (const ref of referentesResult.rows) {
                    yield client.query('DELETE FROM referentes WHERE id = $1', [ref.referente_id]);
                }
                // Eliminar relaciones solicitud-referente
                yield client.query('DELETE FROM solicitud_referente WHERE solicitud_formal_id = $1', [solicitudId]);
                // Eliminar solicitud formal (el cliente se mantiene)
                yield client.query('DELETE FROM solicitudes_formales WHERE id = $1', [solicitudId]);
                yield client.query('COMMIT');
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw new Error(`Error al eliminar solicitud formal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Obtiene todas las solicitudes formales del sistema.
     * @returns Promise<SolicitudFormal[]> - Array de todas las solicitudes formales.
     */
    getAllSolicitudesFormales() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.dni,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            ORDER BY sf.fecha_solicitud DESC
        `;
            const result = yield DatabaseDonfig_1.pool.query(query);
            const solicitudes = [];
            for (const row of result.rows) {
                // Obtener referentes para cada solicitud
                const referentesQuery = `
                SELECT r.nombre_completo, r.apellido, r.vinculo, r.telefono
                FROM referentes r
                INNER JOIN solicitud_referente sr ON r.id = sr.referente_id
                WHERE sr.solicitud_formal_id = $1
                ORDER BY sr.orden
            `;
                const referentesResult = yield DatabaseDonfig_1.pool.query(referentesQuery, [row.id]);
                const referentes = referentesResult.rows.map(refRow => new Referente_1.Referente(refRow.nombre_completo, refRow.apellido, refRow.vinculo, refRow.telefono));
                solicitudes.push(new SolicitudFormal_1.SolicitudFormal(row.id.toString(), row.solicitud_inicial_id, row.comerciante_id, row.nombre_completo, row.apellido, row.dni, row.telefono, row.email, new Date(row.fecha_solicitud), Buffer.alloc(0), row.estado, row.acepta_tarjeta, new Date(row.fecha_nacimiento), row.domicilio, row.datos_empleador, referentes, row.comentarios || []));
            }
            return solicitudes;
        });
    }
    /**
     * Obtiene las solicitudes formales por DNI del cliente.
     * @param dni - DNI del cliente.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales del cliente.
     */
    getSolicitudesFormalesByDni(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.dni,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE c.dni = $1
            ORDER BY sf.fecha_solicitud DESC
        `;
            return yield this.executeSolicitudesQuery(query, [dni]);
        });
    }
    /**
     * Obtiene las solicitudes formales por estado.
     * @param estado - Estado de las solicitudes a buscar.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales con el estado especificado.
     */
    getSolicitudesFormalesByEstado(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.dni,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE sf.estado = $1
            ORDER BY sf.fecha_solicitud DESC
        `;
            return yield this.executeSolicitudesQuery(query, [estado]);
        });
    }
    /**
     * Obtiene las solicitudes formales por fecha de solicitud.
     * @param fecha - Fecha de solicitud.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales creadas en esa fecha.
     */
    getSolicitudesFormalesByFecha(fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.dni,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE DATE(sf.fecha_solicitud) = DATE($1)
            ORDER BY sf.fecha_solicitud DESC
        `;
            return yield this.executeSolicitudesQuery(query, [fecha]);
        });
    }
    /**
     * Obtiene las solicitudes formales por ID del comerciante.
     * @param comercianteId - ID del comerciante.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales del comerciante.
     */
    getSolicitudesFormalesByComercianteId(comercianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.dni,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE sf.comerciante_id = $1
            ORDER BY sf.fecha_solicitud DESC
        `;
            return yield this.executeSolicitudesQuery(query, [comercianteId]);
        });
    }
    /**
     * Obtiene las solicitudes formales por ID del analista.
     * @param analistaId - ID del analista.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales aprobadas por el analista.
     */
    getSolicitudesFormalesByAnalistaId(analistaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.dni,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE sf.analista_aprobador_id = $1
            ORDER BY sf.fecha_solicitud DESC
        `;
            return yield this.executeSolicitudesQuery(query, [analistaId]);
        });
    }
    /**
     * Obtiene las solicitudes formales por ID de la solicitud inicial.
     * @param solicitudInicialId - ID de la solicitud inicial.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales asociadas a la solicitud inicial.
     */
    getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT 
                sf.id,
                c.nombre_completo,
                c.apellido,
                c.dni,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.datos_empleador,
                sf.comentarios,
                sf.solicitud_inicial_id
            FROM solicitudes_formales sf
            INNER JOIN clientes c ON sf.cliente_id = c.id
            WHERE sf.solicitud_inicial_id = $1
            ORDER BY sf.fecha_solicitud DESC
        `;
            return yield this.executeSolicitudesQuery(query, [solicitudInicialId]);
        });
    }
    /**
     * Vincula un contrato a una solicitud formal.
     * @param solicitudId - ID de la solicitud formal.
     * @param contratoId - ID del contrato a vincular.
     * @returns Promise<void> - No retorna valor.
     */
    vincularContrato(solicitudId, contratoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Buscar la solicitud formal por solicitud_inicial_id
                const buscarQuery = 'SELECT id FROM solicitudes_formales WHERE solicitud_inicial_id = $1';
                const buscarResult = yield client.query(buscarQuery, [solicitudId]);
                if (buscarResult.rows.length === 0) {
                    throw new Error(`No existe una solicitud formal con solicitud_inicial_id: ${solicitudId}`);
                }
                const solicitudFormalId = buscarResult.rows[0].id;
                // Actualizar el contrato para vincularlo con la solicitud formal
                const vincularQuery = `
                UPDATE contratos 
                SET solicitud_formal_id = $1 
                WHERE id = $2
            `;
                const result = yield client.query(vincularQuery, [solicitudFormalId, contratoId]);
                if (result.rowCount === 0) {
                    throw new Error(`No existe un contrato con ID: ${contratoId}`);
                }
                yield client.query('COMMIT');
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw new Error(`Error al vincular contrato: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
            finally {
                client.release();
            }
        });
    }
    // Método auxiliar para ejecutar consultas de solicitudes y mapear resultados
    executeSolicitudesQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield DatabaseDonfig_1.pool.query(query, params);
            const solicitudes = [];
            for (const row of result.rows) {
                // Obtener referentes para cada solicitud
                const referentesQuery = `
                SELECT r.nombre_completo, r.apellido, r.vinculo, r.telefono
                FROM referentes r
                INNER JOIN solicitud_referente sr ON r.id = sr.referente_id
                WHERE sr.solicitud_formal_id = $1
                ORDER BY sr.orden
            `;
                const referentesResult = yield DatabaseDonfig_1.pool.query(referentesQuery, [row.id]);
                const referentes = referentesResult.rows.map(refRow => new Referente_1.Referente(refRow.nombre_completo, refRow.apellido, refRow.vinculo, refRow.telefono));
                solicitudes.push(new SolicitudFormal_1.SolicitudFormal(row.id.toString(), row.solicitud_inicial_id, row.comerciante_id, row.nombre_completo, row.apellido, row.dni, row.telefono, row.email, new Date(row.fecha_solicitud), row.recibo, row.estado, row.acepta_tarjeta, new Date(row.fecha_nacimiento), row.domicilio, row.datos_empleador, referentes, row.comentarios || []));
            }
            return solicitudes;
        });
    }
    /**
     * Obtiene las solicitudes formales por comerciante y estado.
     * @param comercianteId - ID del comerciante.
     * @param estado - Estado de las solicitudes.
     * @returns Promise<SolicitudFormal[]> - Array de solicitudes formales del comerciante con el estado especificado.
     */
    getSolicitudesFormalesByComercianteYEstado(comercianteId, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT 
            sf.id,
            c.nombre_completo,
            c.apellido,
            c.dni,
            c.telefono,
            c.email,
            sf.fecha_solicitud,
            sf.recibo,
            sf.estado,
            sf.acepta_tarjeta,
            c.fecha_nacimiento,
            c.domicilio,
            c.datos_empleador,
            sf.comentarios,
            sf.solicitud_inicial_id,
            sf.comerciante_id
        FROM solicitudes_formales sf
        INNER JOIN clientes c ON sf.cliente_id = c.id
        WHERE sf.comerciante_id = $1 AND sf.estado = $2
        ORDER BY sf.fecha_solicitud DESC
    `;
            return yield this.executeSolicitudesQuery(query, [comercianteId, estado]);
        });
    }
}
exports.SolicitudFormalRepositoryAdapter = SolicitudFormalRepositoryAdapter;
