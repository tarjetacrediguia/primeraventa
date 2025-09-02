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
    getSolicitudFormalBySolicitudInicialId(solicitudInicialId) {
        return __awaiter(this, void 0, void 0, function* () {
            const solicitudes = yield this.getSolicitudesFormalesBySolicitudInicialId(solicitudInicialId);
            return solicitudes.length > 0 ? solicitudes[0] : null;
        });
    }
    getSolicitudesFormalesByCuil(cuil) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT 
            sf.id,
                c.nombre_completo,
                c.apellido,
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador,
                sf.comerciante_id,
                sf.razon_social_empleador,
                sf.cuit_empleador,
                sf.cargo_funcion_empleador,
                sf.sector_empleador,
                sf.codigo_postal_empleador,
                sf.localidad_empleador,
                sf.provincia_empleador,
                sf.telefono_empleador,
                sf.solicita_ampliacion_credito,
                sf.cliente_id,
                sf.nuevo_limite_completo_solicitado,
                c.sexo,
                c.codigo_postal,
                c.localidad,
                c.provincia,
                c.numero_domicilio,
                c.barrio,
                sf.fecha_aprobacion,
                sf.analista_aprobador_id,
                sf.administrador_aprobador_id,
                sf.comerciante_aprobador_id
        FROM solicitudes_formales sf
        INNER JOIN clientes c ON sf.cliente_id = c.id
        WHERE c.cuil = $1
        ORDER BY sf.fecha_solicitud DESC
    `;
            return yield this.executeSolicitudesQuery(query, [cuil]);
        });
    }
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
                yield client.query("BEGIN");
                // 1. Obtener cliente_id de la solicitud inicial asociada
                const initQuery = `SELECT cliente_id FROM solicitudes_iniciales WHERE id = $1`;
                const initResult = yield client.query(initQuery, [
                    solicitudFormal.getSolicitudInicialId(),
                ]);
                if (initResult.rows.length === 0) {
                    throw new Error("Solicitud inicial no encontrada");
                }
                const clienteId = initResult.rows[0].cliente_id;
                if (!clienteId) {
                    throw new Error("La solicitud inicial no tiene un cliente asociado");
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
                    acepta_tarjeta = $7,
                    sexo = $9,
                    codigo_postal = $10,
                    localidad = $11,
                    provincia = $12,
                    numero_domicilio = $13,
                    barrio = $14
                WHERE id = $8
            `;
                yield client.query(updateClienteQuery, [
                    solicitudFormal.getNombreCompleto(),
                    solicitudFormal.getApellido(),
                    solicitudFormal.getTelefono(),
                    solicitudFormal.getEmail(),
                    solicitudFormal.getFechaNacimiento(),
                    solicitudFormal.getDomicilio(),
                    solicitudFormal.getAceptaTarjeta(),
                    clienteId,
                    solicitudFormal.getSexo(),
                    solicitudFormal.getCodigoPostal(),
                    solicitudFormal.getLocalidad(),
                    solicitudFormal.getProvincia(),
                    solicitudFormal.getNumeroDomicilio(),
                    solicitudFormal.getBarrio()
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
                    comentarios,
                    importe_neto,
                    limite_base,
                    limite_completo,
                    solicita_ampliacion_credito,
                    nuevo_limite_completo_solicitado,
                    ponderador,
                    razon_social_empleador,
                    cargo_funcion_empleador,
                    sector_empleador,
                    codigo_postal_empleador,
                    localidad_empleador,
                    provincia_empleador,
                    telefono_empleador
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14, $15, $16, $17, $18, $19, $20, $21)
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
                    solicitudFormal.getComentarios(),
                    solicitudFormal.getImporteNeto(),
                    solicitudFormal.getLimiteBase(),
                    solicitudFormal.getLimiteCompleto(),
                    solicitudFormal.getSolicitaAmpliacionDeCredito(),
                    solicitudFormal.getNuevoLimiteCompletoSolicitado(),
                    solicitudFormal.getPonderador(),
                    solicitudFormal.getRazonSocialEmpleador() || null,
                    solicitudFormal.getCargoEmpleador() || null,
                    solicitudFormal.getSectorEmpleador() || null,
                    solicitudFormal.getCodigoPostalEmpleador() || null,
                    solicitudFormal.getLocalidadEmpleador() || null,
                    solicitudFormal.getProvinciaEmpleador() || null,
                    solicitudFormal.getTelefonoEmpleador() || null,
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
                        referente.getTelefono(),
                    ];
                    const referenteResult = yield client.query(referenteQuery, referenteValues);
                    const referenteId = referenteResult.rows[0].id;
                    const relacionQuery = `
                    INSERT INTO solicitud_referente (solicitud_formal_id, referente_id, orden)
                    VALUES ($1, $2, $3)
                `;
                    yield client.query(relacionQuery, [solicitudId, referenteId, i + 1]);
                }
                yield client.query("COMMIT");
                // Retornar la solicitud creada
                return (yield this.getSolicitudFormalById(solicitudId));
            }
            catch (error) {
                yield client.query("ROLLBACK");
                throw new Error(`Error al crear solicitud formal: ${error instanceof Error ? error.message : "Error desconocido"}`);
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
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                c.sexo,
                c.codigo_postal,
                c.localidad,
                c.provincia,
                c.numero_domicilio,
                c.barrio,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.comerciante_id,
                sf.fecha_aprobacion,
                sf.analista_aprobador_id,
                sf.administrador_aprobador_id,
                sf.comerciante_aprobador_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.cliente_id,
                sf.solicita_ampliacion_credito,
                sf.nuevo_limite_completo_solicitado,
                sf.ponderador,
                sf.razon_social_empleador,
                sf.cuit_empleador,
                sf.cargo_funcion_empleador,
                sf.sector_empleador,
                sf.codigo_postal_empleador,
                sf.localidad_empleador,
                sf.provincia_empleador,
                sf.telefono_empleador
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
            const referentes = referentesResult.rows.map((refRow) => new Referente_1.Referente(refRow.nombre_completo, refRow.apellido, refRow.vinculo, refRow.telefono));
            return new SolicitudFormal_1.SolicitudFormal(Number(row.id), // Convertir a número
            row.solicitud_inicial_id, row.comerciante_id, row.nombre_completo, row.apellido, row.telefono, row.email, new Date(row.fecha_solicitud), row.recibo, row.estado, row.acepta_tarjeta, new Date(row.fecha_nacimiento), row.domicilio, referentes, row.importe_neto, row.comentarios || [], Number(row.ponderador) || 0, row.solicita_ampliacion_credito || false, row.cliente_id || 0, row.razon_social_empleador, row.cuit_empleador, row.cargo_funcion_empleador, row.sector_empleador, row.codigo_postal_empleador, row.localidad_empleador, row.provincia_empleador, row.telefono_empleador, row.sexo, row.codigo_postal, row.localidad, row.provincia, row.numero_domicilio, row.barrio, row.fecha_aprobacion ? new Date(row.fecha_aprobacion) : undefined, row.analista_aprobador_id, row.administrador_aprobador_id, row.comerciante_aprobador_id, row.nuevo_limite_completo_solicitado !== null
                ? Number(row.nuevo_limite_completo_solicitado)
                : null);
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
                yield client.query("BEGIN");
                // Buscar la solicitud formal por solicitud_inicial_id
                const buscarQuery = `
                SELECT sf.id, sf.cliente_id 
                FROM solicitudes_formales sf 
                WHERE sf.solicitud_inicial_id = $1
            `;
                const buscarResult = yield client.query(buscarQuery, [
                    solicitudFormal.getSolicitudInicialId(),
                ]);
                if (buscarResult.rows.length === 0) {
                    throw new Error(`No existe una solicitud formal con solicitud_inicial_id: ${solicitudFormal.getSolicitudInicialId()}`);
                }
                const solicitudId = buscarResult.rows[0].id;
                const clienteId = buscarResult.rows[0].cliente_id;
                // Actualizar cliente
                const actualizarClienteQuery = `
                UPDATE clientes 
                SET nombre_completo = $1, apellido = $2, telefono = $3, email = $4,
                    fecha_nacimiento = $5, domicilio = $6, acepta_tarjeta = $7
                WHERE id = $8
            `;
                yield client.query(actualizarClienteQuery, [
                    solicitudFormal.getNombreCompleto(),
                    solicitudFormal.getApellido(),
                    solicitudFormal.getTelefono(),
                    solicitudFormal.getEmail(),
                    solicitudFormal.getFechaNacimiento(),
                    solicitudFormal.getDomicilio(),
                    solicitudFormal.getAceptaTarjeta(),
                    clienteId,
                ]);
                // Actualizar solicitud formal
                const actualizarSolicitudQuery = `
                UPDATE solicitudes_formales
                SET fecha_solicitud = $1, 
                    recibo = $2, 
                    estado = $3, 
                    acepta_tarjeta = $4, 
                    comentarios = $5, 
                    fecha_actualizacion = CURRENT_TIMESTAMP,
                    importe_neto = $7,
                    limite_base = $8,
                    limite_completo = $9,
                    razon_social_empleador = $10,
                    cuit_empleador = $11,
                    cargo_funcion_empleador = $12,
                    sector_empleador = $13,
                    codigo_postal_empleador = $14,
                    localidad_empleador = $15,
                    provincia_empleador = $16,
                    telefono_empleador = $17
                WHERE id = $6
            `;
                yield client.query(actualizarSolicitudQuery, [
                    solicitudFormal.getFechaSolicitud(),
                    solicitudFormal.getRecibo(),
                    solicitudFormal.getEstado(),
                    solicitudFormal.getAceptaTarjeta(),
                    solicitudFormal.getComentarios(),
                    solicitudId,
                    solicitudFormal.getImporteNeto(),
                    solicitudFormal.getLimiteBase(),
                    solicitudFormal.getLimiteCompleto(),
                    solicitudFormal.getRazonSocialEmpleador(),
                    solicitudFormal.getCuitEmpleador(),
                    solicitudFormal.getCargoEmpleador(),
                    solicitudFormal.getSectorEmpleador(),
                    solicitudFormal.getCodigoPostalEmpleador(),
                    solicitudFormal.getLocalidadEmpleador(),
                    solicitudFormal.getProvinciaEmpleador(),
                    solicitudFormal.getTelefonoEmpleador()
                ]);
                // Eliminar referentes existentes
                yield client.query("DELETE FROM solicitud_referente WHERE solicitud_formal_id = $1", [solicitudId]);
                const referentesIds = yield client.query("SELECT referente_id FROM solicitud_referente WHERE solicitud_formal_id = $1", [solicitudId]);
                for (const refId of referentesIds.rows) {
                    yield client.query("DELETE FROM referentes WHERE id = $1", [
                        refId.referente_id,
                    ]);
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
                        referente.getTelefono(),
                    ]);
                    const referenteId = referenteResult.rows[0].id;
                    yield client.query("INSERT INTO solicitud_referente (solicitud_formal_id, referente_id, orden) VALUES ($1, $2, $3)", [solicitudId, referenteId, i + 1]);
                }
                yield client.query("COMMIT");
                return (yield this.getSolicitudFormalById(solicitudId.toString()));
            }
            catch (error) {
                yield client.query("ROLLBACK");
                throw new Error(`Error al actualizar solicitud formal: ${error instanceof Error ? error.message : "Error desconocido"}`);
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
                yield client.query("BEGIN");
                // Obtener ID directamente de la entidad
                const solicitudId = solicitudFormal.getId();
                // 1. Obtener cliente_id de la solicitud
                const clienteIdQuery = "SELECT cliente_id FROM solicitudes_formales WHERE id = $1";
                const clienteIdResult = yield client.query(clienteIdQuery, [solicitudId]);
                if (clienteIdResult.rows.length === 0) {
                    throw new Error(`Solicitud formal no encontrada: ${solicitudId}`);
                }
                const clienteId = clienteIdResult.rows[0].cliente_id;
                // Actualizar cliente
                const actualizarClienteQuery = `
                UPDATE clientes 
                SET nombre_completo = $1, apellido = $2, telefono = $3, email = $4,
                  fecha_nacimiento = $5, domicilio = $6, acepta_tarjeta = $7,
                  sexo = $9, codigo_postal = $10, localidad = $11, provincia = $12,
                  numero_domicilio = $13, barrio = $14
                WHERE id = $8
            `;
                yield client.query(actualizarClienteQuery, [
                    solicitudFormal.getNombreCompleto(),
                    solicitudFormal.getApellido(),
                    solicitudFormal.getTelefono(),
                    solicitudFormal.getEmail(),
                    solicitudFormal.getFechaNacimiento(),
                    solicitudFormal.getDomicilio(),
                    solicitudFormal.getAceptaTarjeta(),
                    clienteId,
                    solicitudFormal.getSexo(),
                    solicitudFormal.getCodigoPostal(),
                    solicitudFormal.getLocalidad(),
                    solicitudFormal.getProvincia(),
                    solicitudFormal.getNumeroDomicilio(),
                    solicitudFormal.getBarrio()
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
                fecha_aprobacion = CURRENT_TIMESTAMP,
                analista_aprobador_id = $7,
                administrador_aprobador_id = $8,
                comerciante_aprobador_id = $9
            WHERE id = $6
        `;
                yield client.query(actualizarSolicitudQuery, [
                    solicitudFormal.getFechaSolicitud(),
                    solicitudFormal.getRecibo(),
                    solicitudFormal.getEstado(),
                    solicitudFormal.getAceptaTarjeta(),
                    solicitudFormal.getComentarios(),
                    solicitudFormal.getId(),
                    solicitudFormal.getAnalistaAprobadorId(),
                    solicitudFormal.getAdministradorAprobadorId(),
                    solicitudFormal.getComercianteAprobadorId() || null,
                ]);
                // Eliminar referentes existentes
                yield client.query("DELETE FROM solicitud_referente WHERE solicitud_formal_id = $1", [solicitudId]);
                const referentesIds = yield client.query("SELECT referente_id FROM solicitud_referente WHERE solicitud_formal_id = $1", [solicitudId]);
                for (const refId of referentesIds.rows) {
                    yield client.query("DELETE FROM referentes WHERE id = $1", [
                        refId.referente_id,
                    ]);
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
                        referente.getTelefono(),
                    ]);
                    const referenteId = referenteResult.rows[0].id;
                    yield client.query("INSERT INTO solicitud_referente (solicitud_formal_id, referente_id, orden) VALUES ($1, $2, $3)", [solicitudId, referenteId, i + 1]);
                }
                yield client.query("COMMIT");
                return (yield this.getSolicitudFormalById(solicitudId));
            }
            catch (error) {
                yield client.query("ROLLBACK");
                throw new Error(`Error al actualizar solicitud formal: ${error instanceof Error ? error.message : "Error desconocido"}`);
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
                yield client.query("BEGIN");
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
                    solicitudId,
                ]);
                // Registrar acción en el historial
                const accion = `Solicitud formal ${solicitudId} rechazada`;
                const detalles = {
                    comentarios: solicitudFormal.getComentarios(),
                    aprobador_id: solicitudFormal.getAnalistaAprobadorId() ||
                        solicitudFormal.getAdministradorAprobadorId(),
                };
                yield client.query("INSERT INTO historial (usuario_id, accion, entidad_afectada, entidad_id, detalles) VALUES ($1, $2, $3, $4, $5)", [
                    solicitudFormal.getAnalistaAprobadorId() ||
                        solicitudFormal.getAdministradorAprobadorId(),
                    accion,
                    "solicitudes_formales",
                    solicitudId,
                    JSON.stringify(detalles),
                ]);
                yield client.query("COMMIT");
                return (yield this.getSolicitudFormalById(solicitudId));
            }
            catch (error) {
                yield client.query("ROLLBACK");
                throw new Error(`Error al rechazar solicitud formal: ${error instanceof Error ? error.message : "Error desconocido"}`);
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
                yield client.query("BEGIN");
                // Buscar la solicitud formal
                const buscarQuery = "SELECT id FROM solicitudes_formales WHERE solicitud_inicial_id = $1";
                const buscarResult = yield client.query(buscarQuery, [id]);
                if (buscarResult.rows.length === 0) {
                    throw new Error(`No existe una solicitud formal con solicitud_inicial_id: ${id}`);
                }
                const solicitudId = buscarResult.rows[0].id;
                // Eliminar referentes asociados
                const referentesQuery = `
                SELECT referente_id FROM solicitud_referente WHERE solicitud_formal_id = $1
            `;
                const referentesResult = yield client.query(referentesQuery, [
                    solicitudId,
                ]);
                for (const ref of referentesResult.rows) {
                    yield client.query("DELETE FROM referentes WHERE id = $1", [
                        ref.referente_id,
                    ]);
                }
                // Eliminar relaciones solicitud-referente
                yield client.query("DELETE FROM solicitud_referente WHERE solicitud_formal_id = $1", [solicitudId]);
                // Eliminar solicitud formal (el cliente se mantiene)
                yield client.query("DELETE FROM solicitudes_formales WHERE id = $1", [
                    solicitudId,
                ]);
                yield client.query("COMMIT");
            }
            catch (error) {
                yield client.query("ROLLBACK");
                throw new Error(`Error al eliminar solicitud formal: ${error instanceof Error ? error.message : "Error desconocido"}`);
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
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,          
                sf.limite_base,            
                sf.limite_completo,
                sf.ponderador,
                sf.razon_social_empleador,
                sf.cuit_empleador,
                sf.cargo_funcion_empleador,
                sf.sector_empleador,
                sf.codigo_postal_empleador,
                sf.localidad_empleador,
                sf.provincia_empleador,
                sf.telefono_empleador             
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
                const referentes = referentesResult.rows.map((refRow) => new Referente_1.Referente(refRow.nombre_completo, refRow.apellido, refRow.vinculo, refRow.telefono));
                solicitudes.push(new SolicitudFormal_1.SolicitudFormal(row.id.toString(), row.solicitud_inicial_id, row.comerciante_id, row.nombre_completo, row.apellido, row.telefono, row.email, new Date(row.fecha_solicitud), Buffer.alloc(0), row.estado, row.acepta_tarjeta, new Date(row.fecha_nacimiento), row.domicilio, referentes, row.importe_neto, row.cuotas_solicitadas, row.comentarios || [], row.ponderador, row.razon_social_empleador, row.cuit_empleador, row.cargo_funcion_empleador, row.sector_empleador, row.codigo_postal_empleador, row.localidad_empleador, row.provincia_empleador, row.telefono_empleador));
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
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador,
                sf.comerciante_id,
                sf.razon_social_empleador,
                sf.cuit_empleador,
                sf.cargo_funcion_empleador,
                sf.sector_empleador,
                sf.codigo_postal_empleador,
                sf.localidad_empleador,
                sf.provincia_empleador,
                sf.telefono_empleador,
                sf.solicita_ampliacion_credito,
                sf.cliente_id,
                sf.nuevo_limite_completo_solicitado,
                c.sexo,
                c.codigo_postal,
                c.localidad,
                c.provincia,
                c.numero_domicilio,
                c.barrio,
                sf.fecha_aprobacion,
                sf.analista_aprobador_id,
                sf.administrador_aprobador_id,
                sf.comerciante_aprobador_id
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
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador,
                sf.comerciante_id,
                sf.razon_social_empleador,
                sf.cuit_empleador,
                sf.cargo_funcion_empleador,
                sf.sector_empleador,
                sf.codigo_postal_empleador,
                sf.localidad_empleador,
                sf.provincia_empleador,
                sf.telefono_empleador,
                sf.solicita_ampliacion_credito,
                sf.cliente_id,
                sf.nuevo_limite_completo_solicitado,
                c.sexo,
                c.codigo_postal,
                c.localidad,
                c.provincia,
                c.numero_domicilio,
                c.barrio,
                sf.fecha_aprobacion,
                sf.analista_aprobador_id,
                sf.administrador_aprobador_id,
                sf.comerciante_aprobador_id 
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
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador,
                sf.comerciante_id,
                sf.razon_social_empleador,
                sf.cuit_empleador,
                sf.cargo_funcion_empleador,
                sf.sector_empleador,
                sf.codigo_postal_empleador,
                sf.localidad_empleador,
                sf.provincia_empleador,
                sf.telefono_empleador,
                sf.solicita_ampliacion_credito,
                sf.cliente_id,
                sf.nuevo_limite_completo_solicitado,
                c.sexo,
                c.codigo_postal,
                c.localidad,
                c.provincia,
                c.numero_domicilio,
                c.barrio,
                sf.fecha_aprobacion,
                sf.analista_aprobador_id,
                sf.administrador_aprobador_id,
                sf.comerciante_aprobador_id
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
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador,
                sf.comerciante_id,
                sf.razon_social_empleador,
                sf.cuit_empleador,
                sf.cargo_funcion_empleador,
                sf.sector_empleador,
                sf.codigo_postal_empleador,
                sf.localidad_empleador,
                sf.provincia_empleador,
                sf.telefono_empleador,
                sf.solicita_ampliacion_credito,
                sf.cliente_id,
                sf.nuevo_limite_completo_solicitado,
                c.sexo,
                c.codigo_postal,
                c.localidad,
                c.provincia,
                c.numero_domicilio,
                c.barrio,
                sf.fecha_aprobacion,
                sf.analista_aprobador_id,
                sf.administrador_aprobador_id,
                sf.comerciante_aprobador_id
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
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador,
                sf.comerciante_id,
                sf.razon_social_empleador,
                sf.cuit_empleador,
                sf.cargo_funcion_empleador,
                sf.sector_empleador,
                sf.codigo_postal_empleador,
                sf.localidad_empleador,
                sf.provincia_empleador,
                sf.telefono_empleador,
                sf.solicita_ampliacion_credito,
                sf.cliente_id,
                sf.nuevo_limite_completo_solicitado,
                c.sexo,
                c.codigo_postal,
                c.localidad,
                c.provincia,
                c.numero_domicilio,
                c.barrio,
                sf.fecha_aprobacion,
                sf.analista_aprobador_id,
                sf.administrador_aprobador_id,
                sf.comerciante_aprobador_id
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
                c.telefono,
                c.email,
                sf.fecha_solicitud,
                sf.recibo,
                sf.estado,
                sf.acepta_tarjeta,
                c.fecha_nacimiento,
                c.domicilio,
                sf.comentarios,
                sf.solicitud_inicial_id,
                sf.importe_neto,
                sf.limite_base,
                sf.limite_completo,
                sf.ponderador,
                sf.comerciante_id,
                sf.razon_social_empleador,
                sf.cuit_empleador,
                sf.cargo_funcion_empleador,
                sf.sector_empleador,
                sf.codigo_postal_empleador,
                sf.localidad_empleador,
                sf.provincia_empleador,
                sf.telefono_empleador,
                sf.solicita_ampliacion_credito,
                sf.cliente_id,
                sf.nuevo_limite_completo_solicitado,
                c.sexo,
                c.codigo_postal,
                c.localidad,
                c.provincia,
                c.numero_domicilio,
                c.barrio,
                sf.fecha_aprobacion,
                sf.analista_aprobador_id,
                sf.administrador_aprobador_id,
                sf.comerciante_aprobador_id
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
                yield client.query("BEGIN");
                // Buscar la solicitud formal por solicitud_inicial_id
                const buscarQuery = "SELECT id FROM solicitudes_formales WHERE solicitud_inicial_id = $1";
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
                const result = yield client.query(vincularQuery, [
                    solicitudFormalId,
                    contratoId,
                ]);
                if (result.rowCount === 0) {
                    throw new Error(`No existe un contrato con ID: ${contratoId}`);
                }
                yield client.query("COMMIT");
            }
            catch (error) {
                yield client.query("ROLLBACK");
                throw new Error(`Error al vincular contrato: ${error instanceof Error ? error.message : "Error desconocido"}`);
            }
            finally {
                client.release();
            }
        });
    }
    // Método auxiliar para ejecutar consultas de solicitudes y mapear resultados
    executeSolicitudesQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
                const referentes = referentesResult.rows.map((refRow) => new Referente_1.Referente(refRow.nombre_completo, refRow.apellido, refRow.vinculo, refRow.telefono));
                solicitudes.push(new SolicitudFormal_1.SolicitudFormal(Number(row.id), row.solicitud_inicial_id, row.comerciante_id, row.nombre_completo, row.apellido, row.telefono, row.email, new Date(row.fecha_solicitud), row.recibo, row.estado, row.acepta_tarjeta, new Date(row.fecha_nacimiento), row.domicilio, referentes, row.importe_neto, row.comentarios || [], (_a = row.ponderador) !== null && _a !== void 0 ? _a : 0, row.solicita_ampliacion_credito || false, // Campo booleano correcto
                row.cliente_id, row.razon_social_empleador, row.cuit_empleador, row.cargo_funcion_empleador, row.sector_empleador, row.codigo_postal_empleador, row.localidad_empleador, row.provincia_empleador, row.telefono_empleador, row.sexo, row.codigo_postal, row.localidad, row.provincia, row.numero_domicilio, row.barrio, row.fecha_aprobacion ? new Date(row.fecha_aprobacion) : undefined, row.analista_aprobador_id, row.administrador_aprobador_id, row.comerciante_aprobador_id, row.nuevo_limite_completo_solicitado !== null
                    ? Number(row.nuevo_limite_completo_solicitado)
                    : null));
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
            c.telefono,
            c.email,
            sf.fecha_solicitud,
            sf.recibo,
            sf.estado,
            sf.acepta_tarjeta,
            c.fecha_nacimiento,
            c.domicilio,
            sf.comentarios,
            sf.solicitud_inicial_id,
            sf.comerciante_id,
            sf.ponderador,
            sf.razon_social_empleador,
            sf.cuit_empleador,
            sf.cargo_funcion_empleador,
            sf.sector_empleador,
            sf.codigo_postal_empleador,
            sf.localidad_empleador,
            sf.provincia_empleador,
            sf.telefono_empleador 
        FROM solicitudes_formales sf
        INNER JOIN clientes c ON sf.cliente_id = c.id
        WHERE sf.comerciante_id = $1 AND sf.estado = $2
        ORDER BY sf.fecha_solicitud DESC
    `;
            return yield this.executeSolicitudesQuery(query, [comercianteId, estado]);
        });
    }
    solicitarAmpliacion(solicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query("BEGIN");
                const query = `
                UPDATE solicitudes_formales
                SET estado = $1,
                    nuevo_limite_completo_solicitado = $2,
                    comentarios = $3,
                    fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id = $4
                RETURNING id;
            `;
                const result = yield client.query(query, [
                    solicitud.getEstado(),
                    solicitud.getNuevoLimiteCompletoSolicitado(),
                    solicitud.getComentarios(),
                    solicitud.getId(),
                ]);
                if (result.rows.length === 0) {
                    throw new Error("Error al actualizar la solicitud");
                }
                yield client.query("COMMIT");
                return (yield this.getSolicitudFormalById(solicitud.getId()));
            }
            catch (error) {
                yield client.query("ROLLBACK");
                throw new Error(`Error al solicitar ampliación: ${error instanceof Error ? error.message : "Error desconocido"}`);
            }
            finally {
                client.release();
            }
        });
    }
    aprobarAmpliacion(solicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query("BEGIN");
                const query = `
                UPDATE solicitudes_formales
                SET estado = $1,
                    limite_completo = $2,
                    nuevo_limite_completo_solicitado = NULL,
                    comentarios = $3,
                    fecha_actualizacion = CURRENT_TIMESTAMP,
                    analista_aprobador_id = $4,
                    administrador_aprobador_id = $5
                WHERE id = $6
                RETURNING id;
            `;
                const result = yield client.query(query, [
                    solicitud.getEstado(),
                    solicitud.getLimiteCompleto(),
                    solicitud.getComentarios(),
                    solicitud.getAnalistaAprobadorId(),
                    solicitud.getAdministradorAprobadorId(),
                    solicitud.getId(),
                ]);
                if (result.rows.length === 0) {
                    throw new Error("Error al aprobar ampliación");
                }
                yield client.query("COMMIT");
                return (yield this.getSolicitudFormalById(solicitud.getId()));
            }
            catch (error) {
                yield client.query("ROLLBACK");
                throw new Error(`Error al aprobar ampliación: ${error instanceof Error ? error.message : "Error desconocido"}`);
            }
            finally {
                client.release();
            }
        });
    }
    rechazarAmpliacion(solicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query("BEGIN");
                const query = `
                UPDATE solicitudes_formales
                SET estado = $1,
                    nuevo_limite_completo_solicitado = NULL,
                    comentarios = $2,
                    fecha_actualizacion = CURRENT_TIMESTAMP,
                    analista_aprobador_id = $3,
                    administrador_aprobador_id = $4
                WHERE id = $5
                RETURNING id;
            `;
                const result = yield client.query(query, [
                    solicitud.getEstado(),
                    solicitud.getComentarios(),
                    solicitud.getAnalistaAprobadorId(),
                    solicitud.getAdministradorAprobadorId(),
                    solicitud.getId(),
                ]);
                if (result.rows.length === 0) {
                    throw new Error("Error al rechazar ampliación");
                }
                yield client.query("COMMIT");
                return (yield this.getSolicitudFormalById(solicitud.getId()));
            }
            catch (error) {
                yield client.query("ROLLBACK");
                throw new Error(`Error al rechazar ampliación: ${error instanceof Error ? error.message : "Error desconocido"}`);
            }
            finally {
                client.release();
            }
        });
    }
}
exports.SolicitudFormalRepositoryAdapter = SolicitudFormalRepositoryAdapter;
