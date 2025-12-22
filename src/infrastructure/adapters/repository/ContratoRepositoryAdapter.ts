// src/infrastructure/adapters/repository/ContratoRepositoryAdapter.ts

/**
 * ADAPTADOR: Repositorio de Contratos
 *
 * Este archivo implementa el adaptador para el repositorio de contratos.
 * Proporciona métodos para interactuar con la base de datos PostgreSQL
 * y gestionar las operaciones CRUD de contratos.
 */

import { ContratoRepositoryPort } from "../../../application/ports/ContratoRepositoryPort";
import { Contrato } from "../../../domain/entities/Contrato";
import { pool } from "../../config/Database/DatabaseDonfig";

export class ContratoRepositoryAdapter implements ContratoRepositoryPort {
  /**
   * Guarda un contrato en la base de datos (alias de createContrato).
   * @param contrato - Objeto Contrato a guardar.
   * @returns Promise<Contrato> - El contrato guardado con su ID asignado.
   */
  async saveContrato(contrato: Contrato): Promise<Contrato> {
    if (contrato.getId() && contrato.getId() !== 0) {
    return this.updateContrato(contrato);
  }
  return this.createContrato(contrato);
  }

  /**
   * Obtiene un contrato por su ID.
   * @param id - ID del contrato a buscar.
   * @returns Promise<Contrato | null> - El contrato encontrado o null si no existe.
   */
  async getContratoById(id: string): Promise<Contrato | null> {
    const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_autorizacion, numero_cuenta, pdf_contrato
            FROM contratos 
            WHERE id = $1
        `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToContrato(result.rows[0]);
  }

  /**
   * Actualiza los datos de un contrato existente.
   * @param contrato - Objeto Contrato con los datos actualizados.
   * @returns Promise<Contrato> - El contrato actualizado.
   */
  async updateContrato(contrato: Contrato): Promise<Contrato> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const query = `
      UPDATE contratos 
      SET fecha_generacion = $1, 
          estado = $2, 
          cliente_id = $3, 
          monto = $4,
          numero_autorizacion = $5, 
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
          cliente_referente1_nombre = $33,
          cliente_referente1_apellido = $34,
          cliente_referente1_vinculo = $35,
          cliente_referente1_telefono = $36,
          cliente_referente2_nombre = $37,
          cliente_referente2_apellido = $38,
          cliente_referente2_vinculo = $39,
          cliente_referente2_telefono = $40,
          cliente_datos_laborales_actividad = $41,
          cliente_datos_laborales_razon_social = $42,
          cliente_datos_laborales_cuit = $43,
          cliente_datos_laborales_inicio_actividades = $44,
          cliente_datos_laborales_cargo = $45,
          cliente_datos_laborales_sector = $46,
          cliente_datos_laborales_domicilio_legal = $47,
          cliente_datos_laborales_codigo_postal = $48,
          cliente_datos_laborales_localidad = $49,
          cliente_datos_laborales_provincia = $50,
          cliente_datos_laborales_telefono = $51,
          tasas_tea_ctf_financiacion = $52,
          tasas_tna_compensatorios_financiacion = $53,
          tasas_tna_punitorios = $54,
          tasas_ctf_financiacion = $55,
          tasas_comision_renovacion_anual = $56,
          tasas_comision_mantenimiento = $57,
          tasas_comision_reposicion_plastico = $58,
          tasas_atraso_05_31_dias = $59,
          tasas_atraso_32_60_dias = $60,
          tasas_atraso_61_90_dias = $61,
          tasas_pago_facil = $62,
          tasas_platinium_pago_facil = $63,
          tasas_platinium_tea_ctf_financiacion = $64,
          tasas_platinium_tna_compensatorios_financiacion = $65,
          tasas_platinium_tna_punitorios = $66,
          tasas_platinium_ctf_financiacion = $67,
          tasas_platinium_comision_renovacion_anual = $68,
          tasas_platinium_comision_mantenimiento = $69,
          tasas_platinium_comision_reposicion_plastico = $70,
          tasas_platinium_atraso_05_31_dias = $71,
          tasas_platinium_atraso_32_60_dias = $72,
          tasas_platinium_atraso_61_90_dias = $73
      WHERE id = $74
            `;
      await client.query(query, [
      contrato.getFechaGeneracion(),
      contrato.getEstado(),
      contrato.getClienteId(),
      contrato.getMonto(),
      contrato.getNumeroAutorizacion(),
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
      contrato.clienteReferente1Nombre,
      contrato.clienteReferente1Apellido,
      contrato.clienteReferente1Vinculo,
      contrato.clienteReferente1Telefono,
      contrato.clienteReferente2Nombre,
      contrato.clienteReferente2Apellido,
      contrato.clienteReferente2Vinculo,
      contrato.clienteReferente2Telefono,
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
      contrato.getId() // Último parámetro (WHERE id = $74)
    ]);

      await client.query("COMMIT");

      // Devolver el contrato actualizado
      const updated = await this.getContratoById(contrato.getId().toString());
      if (!updated) {
        throw new Error("Error al recuperar contrato actualizado");
      }
      return updated;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Elimina un contrato por su ID.
   * @param id - ID del contrato a eliminar.
   * @returns Promise<void> - No retorna valor.
   */
  async deleteContrato(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM contratos WHERE id = $1", [id]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Crea un nuevo contrato en la base de datos.
   * @param contrato - Objeto Contrato a crear.
   * @returns Promise<Contrato> - El contrato creado con su ID asignado.
   */
  async createContrato(contrato: Contrato): Promise<Contrato> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const query = `
        INSERT INTO contratos (
            solicitud_formal_id,
            cliente_id,
            monto,
            fecha_generacion,
            estado,
            numero_autorizacion,
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
            cliente_Sueldo_Neto,
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
            cliente_referente1_nombre,
            cliente_referente1_apellido,
            cliente_referente1_vinculo,
            cliente_referente1_telefono,
            cliente_referente2_nombre,
            cliente_referente2_apellido,
            cliente_referente2_vinculo,
            cliente_referente2_telefono,
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
            $61, $62, $63, $64, $65, $66, $67, $68, $69, $70,
            $71, $72, $73, $74, $75
        )
        RETURNING *;
    `;
 
      const params = [
        contrato.solicitudFormalId,
        contrato.clienteId,
        contrato.getMonto(),
        contrato.fechaGeneracion,
        contrato.estado,
        contrato.numeroAutorizacion,
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
        contrato.clienteSueldoNeto,
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
        contrato.clienteReferente1Nombre,
        contrato.clienteReferente1Apellido,
        contrato.clienteReferente1Vinculo,
        contrato.clienteReferente1Telefono,
        contrato.clienteReferente2Nombre,
        contrato.clienteReferente2Apellido,
        contrato.clienteReferente2Vinculo,
        contrato.clienteReferente2Telefono,
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
      const result = await client.query(query, params);


      await client.query("COMMIT");

      const savedData = result.rows[0];
      return this.mapRowToContrato(savedData);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Obtiene todos los contratos del sistema.
   * @returns Promise<Contrato[]> - Array de todos los contratos.
   */
  async getAllContratos(): Promise<Contrato[]> {
    const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_autorizacion, numero_cuenta
            FROM contratos
        `;
    const result = await pool.query(query);
    return result.rows.map((row) => this.mapRowToContrato(row));
  }

  /**
   * Obtiene contratos por ID de solicitud formal.
   * @param solicitudFormalId - ID de la solicitud formal.
   * @returns Promise<Contrato[]> - Array de contratos asociados a la solicitud.
   */
  async getContratosBySolicitudFormalId(
    solicitudFormalId: number
  ): Promise<Contrato[]> {
    const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_autorizacion, numero_cuenta
            FROM contratos
            WHERE solicitud_formal_id = $1
        `;
    const result = await pool.query(query, [solicitudFormalId]);
    return result.rows.map((row) => this.mapRowToContrato(row));
  }

  /**
   * Obtiene contratos por ID de analista.
   * @param analistaId - ID del analista.
   * @returns Promise<Contrato[]> - Array de contratos aprobados por el analista.
   */
  async getContratosByAnalistaId(analistaId: number): Promise<Contrato[]> {
    const query = `
            SELECT c.id, c.fecha_generacion, c.monto, c.estado, 
                   c.solicitud_formal_id, c.cliente_id, 
                   c.numero_autorizacion, c.numero_cuenta
            FROM contratos c
            JOIN solicitudes_formales sf ON c.solicitud_formal_id = sf.id
            WHERE sf.analista_aprobador_id = $1
        `;
    const result = await pool.query(query, [analistaId]);
    return result.rows.map((row) => this.mapRowToContrato(row));
  }

  /**
   * Obtiene contratos por ID de comerciante.
   * @param comercianteId - ID del comerciante.
   * @returns Promise<Contrato[]> - Array de contratos del comerciante.
   */
  async getContratosByComercianteId(
    comercianteId: number
  ): Promise<Contrato[]> {
    const query = `
            SELECT c.id, c.fecha_generacion, c.monto, c.estado, 
                   c.solicitud_formal_id, c.cliente_id, 
                   c.numero_autorizacion, c.numero_cuenta
            FROM contratos c
            JOIN solicitudes_formales sf ON c.solicitud_formal_id = sf.id
            WHERE sf.comerciante_id = $1
        `;
    const result = await pool.query(query, [comercianteId]);
    return result.rows.map((row) => this.mapRowToContrato(row));
  }

  /**
   * Obtiene contratos por estado.
   * @param estado - Estado de los contratos a buscar.
   * @returns Promise<Contrato[]> - Array de contratos con el estado especificado.
   */
  async getContratosByEstado(estado: string): Promise<Contrato[]> {
    const query = `
            SELECT id, fecha_generacion, monto, estado, solicitud_formal_id, 
                   cliente_id, numero_autorizacion, numero_cuenta
            FROM contratos
            WHERE estado = $1
        `;
    const result = await pool.query(query, [estado]);
    return result.rows.map((row) => this.mapRowToContrato(row));
  }

  private mapRowToContrato(row: any): Contrato {
    const contrato = new Contrato(
            row.id,
            row.fecha_generacion,
            row.estado,
            Number(row.solicitud_formal_id),
            Number(row.cliente_id),
            row.monto ? parseFloat(row.monto) : undefined,
            row.numero_autorizacion,
            row.numero_cuenta,
            row.comercio_nombre ?? undefined,
            row.comercio_fecha ?? undefined,
            row.comercio_n_autorizacion ?? undefined,
            row.comercio_producto ?? undefined,
            row.comercio_sucursal ?? undefined,
            row.cliente_nombre_completo ?? undefined,
            row.cliente_sexo ?? undefined,
            row.cliente_cuitocuil ?? undefined,
            row.cliente_tipo_documento ?? undefined,
            row.cliente_dni ?? undefined,
            row.cliente_fecha_nacimiento ?? undefined,
            row.cliente_estado_civil ?? undefined,
            row.cliente_nacionalidad ?? undefined,
            row.cliente_Sueldo_Neto ?? undefined,
            row.cliente_domicilio_calle ?? undefined,
            row.cliente_domicilio_numero ?? undefined,
            row.cliente_domicilio_piso ?? undefined,
            row.cliente_domicilio_departamento ?? undefined,
            row.cliente_domicilio_localidad ?? undefined,
            row.cliente_domicilio_provincia ?? undefined,
            row.cliente_domicilio_barrio ?? undefined,
            row.cliente_domicilio_pais ?? undefined,
            row.cliente_domicilio_codigo_postal ?? undefined,
            row.cliente_domicilio_correo_electronico ?? undefined,
            row.cliente_domicilio_telefono_fijo ?? undefined,
            row.cliente_domicilio_telefono_celular ?? undefined,
            row.cliente_referente1_nombre ?? undefined,
            row.cliente_referente1_apellido ?? undefined,
            row.cliente_referente1_vinculo ?? undefined,
            row.cliente_referente1_telefono ?? undefined,
            row.cliente_referente2_nombre ?? undefined,
            row.cliente_referente2_apellido ?? undefined,
            row.cliente_referente2_vinculo ?? undefined,
            row.cliente_referente2_telefono ?? undefined,
            row.cliente_datos_laborales_actividad ?? undefined,
            row.cliente_datos_laborales_razon_social ?? undefined,
            row.cliente_datos_laborales_cuit ?? undefined,
            row.cliente_datos_laborales_inicio_actividades ?? undefined,
            row.cliente_datos_laborales_cargo ?? undefined,
            row.cliente_datos_laborales_sector ?? undefined,
            row.cliente_datos_laborales_domicilio_legal ?? undefined,
            row.cliente_datos_laborales_codigo_postal ?? undefined,
            row.cliente_datos_laborales_localidad ?? undefined,
            row.cliente_datos_laborales_provincia ?? undefined,
            row.cliente_datos_laborales_telefono ?? undefined,
            row.tasas_tea_ctf_financiacion ? parseFloat(row.tasas_tea_ctf_financiacion) : undefined,
            row.tasas_tna_compensatorios_financiacion ? parseFloat(row.tasas_tna_compensatorios_financiacion) : undefined,
            row.tasas_tna_punitorios ? parseFloat(row.tasas_tna_punitorios) : undefined,
            row.tasas_ctf_financiacion ? parseFloat(row.tasas_ctf_financiacion) : undefined,
            row.tasas_comision_renovacion_anual ? parseFloat(row.tasas_comision_renovacion_anual) : undefined,
            row.tasas_comision_mantenimiento ? parseFloat(row.tasas_comision_mantenimiento) : undefined,
            row.tasas_comision_reposicion_plastico ? parseFloat(row.tasas_comision_reposicion_plastico) : undefined,
            row.tasas_atraso_05_31_dias ? parseFloat(row.tasas_atraso_05_31_dias) : undefined,
            row.tasas_atraso_32_60_dias ? parseFloat(row.tasas_atraso_32_60_dias) : undefined,
            row.tasas_atraso_61_90_dias ? parseFloat(row.tasas_atraso_61_90_dias) : undefined,
            row.tasas_pago_facil ? parseFloat(row.tasas_pago_facil) : undefined,
            row.tasas_platinium_pago_facil ? parseFloat(row.tasas_platinium_pago_facil) : undefined,
            row.tasas_platinium_tea_ctf_financiacion ? parseFloat(row.tasas_platinium_tea_ctf_financiacion) : undefined,
            row.tasas_platinium_tna_compensatorios_financiacion ? parseFloat(row.tasas_platinium_tna_compensatorios_financiacion) : undefined,
            row.tasas_platinium_tna_punitorios ? parseFloat(row.tasas_platinium_tna_punitorios) : undefined,
            row.tasas_platinium_ctf_financiacion ? parseFloat(row.tasas_platinium_ctf_financiacion) : undefined,
            row.tasas_platinium_comision_renovacion_anual ? parseFloat(row.tasas_platinium_comision_renovacion_anual) : undefined,
            row.tasas_platinium_comision_mantenimiento ? parseFloat(row.tasas_platinium_comision_mantenimiento) : undefined,
            row.tasas_platinium_comision_reposicion_plastico ? parseFloat(row.tasas_platinium_comision_reposicion_plastico) : undefined,
            row.tasas_platinium_atraso_05_31_dias ? parseFloat(row.tasas_platinium_atraso_05_31_dias) : undefined,
            row.tasas_platinium_atraso_32_60_dias ? parseFloat(row.tasas_platinium_atraso_32_60_dias) : undefined,
            row.tasas_platinium_atraso_61_90_dias ? parseFloat(row.tasas_platinium_atraso_61_90_dias) : undefined
        );
        if (row.pdf_contrato) {
            contrato.setPdfContrato(row.pdf_contrato);
        }
        return contrato;
  }

  async getContratosByCuilCliente(cuil: string): Promise<Contrato[]> {
  const query = `
    SELECT c.* 
    FROM contratos c
    INNER JOIN clientes cl ON c.cliente_id = cl.id
    WHERE cl.cuil = $1
  `;
  
  const result = await pool.query(query, [cuil]);
  return result.rows.map((row) => this.mapRowToContrato(row));
}
}
