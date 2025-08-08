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
            if (contrato.getId() && contrato.getId() !== 0) {
                return this.updateContrato(contrato);
            }
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
                   cliente_id, numero_tarjeta, numero_cuenta, pdf_contrato
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
                yield client.query("BEGIN");
                const query = `
      UPDATE contratos 
      SET fecha_generacion = $1, 
          estado = $2, 
          cliente_id = $3, 
          monto = $4,
          numero_tarjeta = $5, 
          numero_cuenta = $6,
          pdf_contrato = $7,
          comercio_nombre = $8,
          comercio_fecha = $9,
          comercio_n_autorizacion = $10,
          comercio_producto = $11,
          comercio_sucursal = $12,
          cliente_nombre_completo = $13,
          cliente_sexo = $14,
          cliente_cuitocuil = $15,
          cliente_tipo_documento = $16,
          cliente_dni = $17,
          cliente_fecha_nacimiento = $18,
          cliente_estado_civil = $19,
          cliente_nacionalidad = $20,
          cliente_domicilio_calle = $21,
          cliente_domicilio_numero = $22,
          cliente_domicilio_piso = $23,
          cliente_domicilio_departamento = $24,
          cliente_domicilio_localidad = $25,
          cliente_domicilio_provincia = $26,
          cliente_domicilio_barrio = $27,
          cliente_domicilio_pais = $28,
          cliente_domicilio_codigo_postal = $29,
          cliente_domicilio_correo_electronico = $30,
          cliente_domicilio_telefono_fijo = $31,
          cliente_domicilio_telefono_celular = $32,
          cliente_datos_laborales_actividad = $33,
          cliente_datos_laborales_razon_social = $34,
          cliente_datos_laborales_cuit = $35,
          cliente_datos_laborales_inicio_actividades = $36,
          cliente_datos_laborales_cargo = $37,
          cliente_datos_laborales_sector = $38,
          cliente_datos_laborales_domicilio_legal = $39,
          cliente_datos_laborales_codigo_postal = $40,
          cliente_datos_laborales_localidad = $41,
          cliente_datos_laborales_provincia = $42,
          cliente_datos_laborales_telefono = $43,
          tasas_tea_ctf_financiacion = $44,
          tasas_tna_compensatorios_financiacion = $45,
          tasas_tna_punitorios = $46,
          tasas_ctf_financiacion = $47,
          tasas_comision_renovacion_anual = $48,
          tasas_comision_mantenimiento = $49,
          tasas_comision_reposicion_plastico = $50,
          tasas_atraso_05_31_dias = $51,
          tasas_atraso_32_60_dias = $52,
          tasas_atraso_61_90_dias = $53,
          tasas_pago_facil = $54,
          tasas_platinium_pago_facil = $55,
          tasas_platinium_tea_ctf_financiacion = $56,
          tasas_platinium_tna_compensatorios_financiacion = $57,
          tasas_platinium_tna_punitorios = $58,
          tasas_platinium_ctf_financiacion = $59,
          tasas_platinium_comision_renovacion_anual = $60,
          tasas_platinium_comision_mantenimiento = $61,
          tasas_platinium_comision_reposicion_plastico = $62,
          tasas_platinium_atraso_05_31_dias = $63,
          tasas_platinium_atraso_32_60_dias = $64,
          tasas_platinium_atraso_61_90_dias = $65
      WHERE id = $66
            `;
                yield client.query(query, [
                    contrato.getFechaGeneracion(),
                    contrato.getEstado(),
                    contrato.getClienteId(),
                    contrato.getMonto(),
                    contrato.getNumeroTarjeta(),
                    contrato.getNumeroCuenta(),
                    contrato.getPdfContrato(),
                    contrato.comercioNombre,
                    contrato.comercioFecha,
                    contrato.comercioNAutorizacion,
                    contrato.comercioProducto,
                    contrato.comercioSucursal,
                    contrato.clienteNombreCompleto,
                    contrato.clienteSexo,
                    contrato.clienteCuitOcuil,
                    contrato.clienteTipoDocumento,
                    contrato.clienteDni,
                    contrato.clienteFechaNacimiento,
                    contrato.clienteEstadoCivil,
                    contrato.clienteNacionalidad,
                    contrato.clienteDomicilioCalle,
                    contrato.clienteDomicilioNumero,
                    contrato.clienteDomicilioPiso,
                    contrato.clienteDomicilioDepartamento,
                    contrato.clienteDomicilioLocalidad,
                    contrato.clienteDomicilioProvincia,
                    contrato.clienteDomicilioBarrio,
                    contrato.clienteDomicilioPais,
                    contrato.clienteDomicilioCodigoPostal,
                    contrato.clienteDomicilioCorreoElectronico,
                    contrato.clienteDomicilioTelefonoFijo,
                    contrato.clienteDomicilioTelefonoCelular,
                    contrato.clienteDatosLaboralesActividad,
                    contrato.clienteDatosLaboralesRazonSocial,
                    contrato.clienteDatosLaboralesCuit,
                    contrato.clienteDatosLaboralesInicioActividades,
                    contrato.clienteDatosLaboralesCargo,
                    contrato.clienteDatosLaboralesSector,
                    contrato.clienteDatosLaboralesDomicilioLegal,
                    contrato.clienteDatosLaboralesCodigoPostal,
                    contrato.clienteDatosLaboralesLocalidad,
                    contrato.clienteDatosLaboralesProvincia,
                    contrato.clienteDatosLaboralesTelefono,
                    contrato.tasasTeaCtfFinanciacion,
                    contrato.tasasTnaCompensatoriosFinanciacion,
                    contrato.tasasTnaPunitorios,
                    contrato.tasasCtfFinanciacion,
                    contrato.tasasComisionRenovacionAnual,
                    contrato.tasasComisionMantenimiento,
                    contrato.tasasComisionReposicionPlastico,
                    contrato.tasasAtraso05_31Dias,
                    contrato.tasasAtraso32_60Dias,
                    contrato.tasasAtraso61_90Dias,
                    contrato.tasasPagoFacil,
                    contrato.tasasPlatiniumPagoFacil,
                    contrato.tasasPlatiniumTeaCtfFinanciacion,
                    contrato.tasasPlatiniumTnaCompensatoriosFinanciacion,
                    contrato.tasasPlatiniumTnaPunitorios,
                    contrato.tasasPlatiniumCtfFinanciacion,
                    contrato.tasasPlatiniumComisionRenovacionAnual,
                    contrato.tasasPlatiniumComisionMantenimiento,
                    contrato.tasasPlatiniumComisionReposicionPlastico,
                    contrato.tasasPlatiniumAtraso05_31Dias,
                    contrato.tasasPlatiniumAtraso32_60Dias,
                    contrato.tasasPlatiniumAtraso61_90Dias,
                    contrato.getId() // Último parámetro (WHERE id = $66)
                ]);
                yield client.query("COMMIT");
                // Devolver el contrato actualizado
                const updated = yield this.getContratoById(contrato.getId().toString());
                if (!updated) {
                    throw new Error("Error al recuperar contrato actualizado");
                }
                return updated;
            }
            catch (error) {
                yield client.query("ROLLBACK");
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
                yield client.query("BEGIN");
                yield client.query("DELETE FROM contratos WHERE id = $1", [id]);
                yield client.query("COMMIT");
            }
            catch (error) {
                yield client.query("ROLLBACK");
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
                yield client.query("BEGIN");
                const query = `
        INSERT INTO contratos (
            solicitud_formal_id,
            cliente_id,
            monto,
            fecha_generacion,
            estado,
            numero_tarjeta,
            numero_cuenta,
            pdf_contrato,
            comercio_nombre,
            comercio_fecha,
            comercio_n_autorizacion,
            comercio_producto,
            comercio_sucursal,
            cliente_nombre_completo,
            cliente_sexo,
            cliente_cuitocuil,
            cliente_tipo_documento,
            cliente_dni,
            cliente_fecha_nacimiento,
            cliente_estado_civil,
            cliente_nacionalidad,
            cliente_domicilio_calle,
            cliente_domicilio_numero,
            cliente_domicilio_piso,
            cliente_domicilio_departamento,
            cliente_domicilio_localidad,
            cliente_domicilio_provincia,
            cliente_domicilio_barrio,
            cliente_domicilio_pais,
            cliente_domicilio_codigo_postal,
            cliente_domicilio_correo_electronico,
            cliente_domicilio_telefono_fijo,
            cliente_domicilio_telefono_celular,
            cliente_datos_laborales_actividad,
            cliente_datos_laborales_razon_social,
            cliente_datos_laborales_cuit,
            cliente_datos_laborales_inicio_actividades,
            cliente_datos_laborales_cargo,
            cliente_datos_laborales_sector,
            cliente_datos_laborales_domicilio_legal,
            cliente_datos_laborales_codigo_postal,
            cliente_datos_laborales_localidad,
            cliente_datos_laborales_provincia,
            cliente_datos_laborales_telefono,
            tasas_tea_ctf_financiacion,
            tasas_tna_compensatorios_financiacion,
            tasas_tna_punitorios,
            tasas_ctf_financiacion,
            tasas_comision_renovacion_anual,
            tasas_comision_mantenimiento,
            tasas_comision_reposicion_plastico,
            tasas_atraso_05_31_dias,
            tasas_atraso_32_60_dias,
            tasas_atraso_61_90_dias,
            tasas_pago_facil,
            tasas_platinium_pago_facil,
            tasas_platinium_tea_ctf_financiacion,
            tasas_platinium_tna_compensatorios_financiacion,
            tasas_platinium_tna_punitorios,
            tasas_platinium_ctf_financiacion,
            tasas_platinium_comision_renovacion_anual,
            tasas_platinium_comision_mantenimiento,
            tasas_platinium_comision_reposicion_plastico,
            tasas_platinium_atraso_05_31_dias,
            tasas_platinium_atraso_32_60_dias,
            tasas_platinium_atraso_61_90_dias
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
            $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
            $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
            $51, $52, $53, $54, $55, $56, $57, $58, $59, $60,
            $61, $62, $63, $64, $65, $66
        )
        RETURNING *;
    `;
                const params = [
                    contrato.solicitudFormalId,
                    contrato.clienteId,
                    contrato.getMonto(),
                    contrato.fechaGeneracion,
                    contrato.estado,
                    contrato.numeroTarjeta,
                    contrato.numeroCuenta,
                    contrato.getPdfContrato(),
                    contrato.comercioNombre,
                    contrato.comercioFecha,
                    contrato.comercioNAutorizacion,
                    contrato.comercioProducto,
                    contrato.comercioSucursal,
                    contrato.clienteNombreCompleto,
                    contrato.clienteSexo,
                    contrato.clienteCuitOcuil,
                    contrato.clienteTipoDocumento,
                    contrato.clienteDni,
                    contrato.clienteFechaNacimiento,
                    contrato.clienteEstadoCivil,
                    contrato.clienteNacionalidad,
                    contrato.clienteDomicilioCalle,
                    contrato.clienteDomicilioNumero,
                    contrato.clienteDomicilioPiso,
                    contrato.clienteDomicilioDepartamento,
                    contrato.clienteDomicilioLocalidad,
                    contrato.clienteDomicilioProvincia,
                    contrato.clienteDomicilioBarrio,
                    contrato.clienteDomicilioPais,
                    contrato.clienteDomicilioCodigoPostal,
                    contrato.clienteDomicilioCorreoElectronico,
                    contrato.clienteDomicilioTelefonoFijo,
                    contrato.clienteDomicilioTelefonoCelular,
                    contrato.clienteDatosLaboralesActividad,
                    contrato.clienteDatosLaboralesRazonSocial,
                    contrato.clienteDatosLaboralesCuit,
                    contrato.clienteDatosLaboralesInicioActividades,
                    contrato.clienteDatosLaboralesCargo,
                    contrato.clienteDatosLaboralesSector,
                    contrato.clienteDatosLaboralesDomicilioLegal,
                    contrato.clienteDatosLaboralesCodigoPostal,
                    contrato.clienteDatosLaboralesLocalidad,
                    contrato.clienteDatosLaboralesProvincia,
                    contrato.clienteDatosLaboralesTelefono,
                    contrato.tasasTeaCtfFinanciacion,
                    contrato.tasasTnaCompensatoriosFinanciacion,
                    contrato.tasasTnaPunitorios,
                    contrato.tasasCtfFinanciacion,
                    contrato.tasasComisionRenovacionAnual,
                    contrato.tasasComisionMantenimiento,
                    contrato.tasasComisionReposicionPlastico,
                    contrato.tasasAtraso05_31Dias,
                    contrato.tasasAtraso32_60Dias,
                    contrato.tasasAtraso61_90Dias,
                    contrato.tasasPagoFacil,
                    contrato.tasasPlatiniumPagoFacil,
                    contrato.tasasPlatiniumTeaCtfFinanciacion,
                    contrato.tasasPlatiniumTnaCompensatoriosFinanciacion,
                    contrato.tasasPlatiniumTnaPunitorios,
                    contrato.tasasPlatiniumCtfFinanciacion,
                    contrato.tasasPlatiniumComisionRenovacionAnual,
                    contrato.tasasPlatiniumComisionMantenimiento,
                    contrato.tasasPlatiniumComisionReposicionPlastico,
                    contrato.tasasPlatiniumAtraso05_31Dias,
                    contrato.tasasPlatiniumAtraso32_60Dias,
                    contrato.tasasPlatiniumAtraso61_90Dias,
                ];
                // Ejecutar la consulta y mapear resultado
                const result = yield client.query(query, params);
                yield client.query("COMMIT");
                const savedData = result.rows[0];
                return this.mapRowToContrato(savedData);
            }
            catch (error) {
                yield client.query("ROLLBACK");
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
            return result.rows.map((row) => this.mapRowToContrato(row));
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
            return result.rows.map((row) => this.mapRowToContrato(row));
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
            return result.rows.map((row) => this.mapRowToContrato(row));
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
            return result.rows.map((row) => this.mapRowToContrato(row));
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
            return result.rows.map((row) => this.mapRowToContrato(row));
        });
    }
    mapRowToContrato(row) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11;
        const contrato = new Contrato_1.Contrato(row.id, row.fecha_generacion, row.estado, Number(row.solicitud_formal_id), Number(row.cliente_id), row.monto ? parseFloat(row.monto) : undefined, row.numero_tarjeta, row.numero_cuenta, (_a = row.comercio_nombre) !== null && _a !== void 0 ? _a : undefined, (_b = row.comercio_fecha) !== null && _b !== void 0 ? _b : undefined, (_c = row.comercio_n_autorizacion) !== null && _c !== void 0 ? _c : undefined, (_d = row.comercio_producto) !== null && _d !== void 0 ? _d : undefined, (_e = row.comercio_sucursal) !== null && _e !== void 0 ? _e : undefined, (_f = row.cliente_nombre_completo) !== null && _f !== void 0 ? _f : undefined, (_g = row.cliente_sexo) !== null && _g !== void 0 ? _g : undefined, (_h = row.cliente_cuitocuil) !== null && _h !== void 0 ? _h : undefined, (_j = row.cliente_tipo_documento) !== null && _j !== void 0 ? _j : undefined, (_k = row.cliente_dni) !== null && _k !== void 0 ? _k : undefined, (_l = row.cliente_fecha_nacimiento) !== null && _l !== void 0 ? _l : undefined, (_m = row.cliente_estado_civil) !== null && _m !== void 0 ? _m : undefined, (_o = row.cliente_nacionalidad) !== null && _o !== void 0 ? _o : undefined, (_p = row.cliente_domicilio_calle) !== null && _p !== void 0 ? _p : undefined, (_q = row.cliente_domicilio_numero) !== null && _q !== void 0 ? _q : undefined, (_r = row.cliente_domicilio_piso) !== null && _r !== void 0 ? _r : undefined, (_s = row.cliente_domicilio_departamento) !== null && _s !== void 0 ? _s : undefined, (_t = row.cliente_domicilio_localidad) !== null && _t !== void 0 ? _t : undefined, (_u = row.cliente_domicilio_provincia) !== null && _u !== void 0 ? _u : undefined, (_v = row.cliente_domicilio_barrio) !== null && _v !== void 0 ? _v : undefined, (_w = row.cliente_domicilio_pais) !== null && _w !== void 0 ? _w : undefined, (_x = row.cliente_domicilio_codigo_postal) !== null && _x !== void 0 ? _x : undefined, (_y = row.cliente_domicilio_correo_electronico) !== null && _y !== void 0 ? _y : undefined, (_z = row.cliente_domicilio_telefono_fijo) !== null && _z !== void 0 ? _z : undefined, (_0 = row.cliente_domicilio_telefono_celular) !== null && _0 !== void 0 ? _0 : undefined, (_1 = row.cliente_datos_laborales_actividad) !== null && _1 !== void 0 ? _1 : undefined, (_2 = row.cliente_datos_laborales_razon_social) !== null && _2 !== void 0 ? _2 : undefined, (_3 = row.cliente_datos_laborales_cuit) !== null && _3 !== void 0 ? _3 : undefined, (_4 = row.cliente_datos_laborales_inicio_actividades) !== null && _4 !== void 0 ? _4 : undefined, (_5 = row.cliente_datos_laborales_cargo) !== null && _5 !== void 0 ? _5 : undefined, (_6 = row.cliente_datos_laborales_sector) !== null && _6 !== void 0 ? _6 : undefined, (_7 = row.cliente_datos_laborales_domicilio_legal) !== null && _7 !== void 0 ? _7 : undefined, (_8 = row.cliente_datos_laborales_codigo_postal) !== null && _8 !== void 0 ? _8 : undefined, (_9 = row.cliente_datos_laborales_localidad) !== null && _9 !== void 0 ? _9 : undefined, (_10 = row.cliente_datos_laborales_provincia) !== null && _10 !== void 0 ? _10 : undefined, (_11 = row.cliente_datos_laborales_telefono) !== null && _11 !== void 0 ? _11 : undefined, row.tasas_tea_ctf_financiacion ? parseFloat(row.tasas_tea_ctf_financiacion) : undefined, row.tasas_tna_compensatorios_financiacion ? parseFloat(row.tasas_tna_compensatorios_financiacion) : undefined, row.tasas_tna_punitorios ? parseFloat(row.tasas_tna_punitorios) : undefined, row.tasas_ctf_financiacion ? parseFloat(row.tasas_ctf_financiacion) : undefined, row.tasas_comision_renovacion_anual ? parseFloat(row.tasas_comision_renovacion_anual) : undefined, row.tasas_comision_mantenimiento ? parseFloat(row.tasas_comision_mantenimiento) : undefined, row.tasas_comision_reposicion_plastico ? parseFloat(row.tasas_comision_reposicion_plastico) : undefined, row.tasas_atraso_05_31_dias ? parseFloat(row.tasas_atraso_05_31_dias) : undefined, row.tasas_atraso_32_60_dias ? parseFloat(row.tasas_atraso_32_60_dias) : undefined, row.tasas_atraso_61_90_dias ? parseFloat(row.tasas_atraso_61_90_dias) : undefined, row.tasas_pago_facil ? parseFloat(row.tasas_pago_facil) : undefined, row.tasas_platinium_pago_facil ? parseFloat(row.tasas_platinium_pago_facil) : undefined, row.tasas_platinium_tea_ctf_financiacion ? parseFloat(row.tasas_platinium_tea_ctf_financiacion) : undefined, row.tasas_platinium_tna_compensatorios_financiacion ? parseFloat(row.tasas_platinium_tna_compensatorios_financiacion) : undefined, row.tasas_platinium_tna_punitorios ? parseFloat(row.tasas_platinium_tna_punitorios) : undefined, row.tasas_platinium_ctf_financiacion ? parseFloat(row.tasas_platinium_ctf_financiacion) : undefined, row.tasas_platinium_comision_renovacion_anual ? parseFloat(row.tasas_platinium_comision_renovacion_anual) : undefined, row.tasas_platinium_comision_mantenimiento ? parseFloat(row.tasas_platinium_comision_mantenimiento) : undefined, row.tasas_platinium_comision_reposicion_plastico ? parseFloat(row.tasas_platinium_comision_reposicion_plastico) : undefined, row.tasas_platinium_atraso_05_31_dias ? parseFloat(row.tasas_platinium_atraso_05_31_dias) : undefined, row.tasas_platinium_atraso_32_60_dias ? parseFloat(row.tasas_platinium_atraso_32_60_dias) : undefined, row.tasas_platinium_atraso_61_90_dias ? parseFloat(row.tasas_platinium_atraso_61_90_dias) : undefined);
        if (row.pdf_contrato) {
            contrato.setPdfContrato(row.pdf_contrato);
        }
        return contrato;
    }
}
exports.ContratoRepositoryAdapter = ContratoRepositoryAdapter;
