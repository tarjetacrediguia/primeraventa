// src/infrastructure/repositories/ClienteRepositoryAdapter.ts

/**
 * ADAPTADOR: Repositorio de Clientes
 *
 * Este archivo implementa el adaptador para el repositorio de clientes.
 * Proporciona métodos para interactuar con la base de datos PostgreSQL
 * y gestionar las operaciones CRUD de clientes.
 */

import { ClienteRepositoryPort } from "../../../application/ports/ClienteRepositoryPort";
import { Cliente } from "../../../domain/entities/Cliente";
import { pool } from "../../config/Database/DatabaseDonfig";

export class ClienteRepositoryAdapter implements ClienteRepositoryPort {
  constructor() {}

  private mapRowToCliente(row: any): Cliente {
    return new Cliente(
      row.id,
      row.nombre_completo,
      row.apellido,
      row.dni,
      row.cuil || "",
      row.telefono,
      row.email,
      row.fecha_nacimiento ? new Date(row.fecha_nacimiento) : null,
      row.domicilio,
      row.acepta_tarjeta,
      row.fecha_creacion ? new Date(row.fecha_creacion) : new Date(),
      row.comerciante_id || 0,
      row.sexo || null,
      row.codigo_postal || null,
      row.localidad || null,
      row.provincia || null,
      row.numero_domicilio || null,
      row.barrio || null,
      row.empleador_razon_social || null,
      row.empleador_cuit || null,
      row.empleador_domicilio || null,
      row.empleador_telefono || null,
      row.empleador_codigo_postal || null,
      row.empleador_localidad || null,
      row.empleador_provincia || null,
      row.nacionalidad || null,
      row.estado_civil || null
    );
  }

  /**
   * Obtiene un cliente por su ID.
   * @param id - ID del cliente a buscar.
   * @returns Promise<Cliente> - El cliente encontrado.
   * @throws Error si el cliente no existe.
   */
  async findById(id: number): Promise<Cliente> {
    const query = "SELECT * FROM clientes WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new Error("Cliente no encontrado");
    }

    return this.mapRowToCliente(result.rows[0]);
  }

  /**
   * Obtiene un cliente por su DNI.
   * @param dni - DNI del cliente a buscar.
   * @returns Promise<Cliente> - El cliente encontrado.
   * @throws Error si el cliente no existe.
   */
  async findByDni(dni: string): Promise<Cliente> {
    const query = "SELECT * FROM clientes WHERE dni = $1";
    const result = await pool.query(query, [dni]);

    if (result.rows.length === 0) {
      throw new Error("Cliente no encontrado");
    }

    return this.mapRowToCliente(result.rows[0]);
  }

  /**
   * Obtiene un cliente por su CUIL.
   * @param cuil - CUIL del cliente a buscar.
   * @returns Promise<Cliente> - El cliente encontrado.
   * @throws Error si el cliente no existe.
   */
  async findByCuil(cuil: string): Promise<Cliente> {
    const query = "SELECT * FROM clientes WHERE cuil = $1";
    const result = await pool.query(query, [cuil]);

    if (result.rows.length === 0) {
      throw new Error("Cliente no encontrado");
    }

    return this.mapRowToCliente(result.rows[0]);
  }

  /**
   * Obtiene un cliente por su email.
   * @param email - Email del cliente a buscar.
   * @returns Promise<Cliente> - El cliente encontrado.
   * @throws Error si el cliente no existe.
   */
  async findByEmail(email: string): Promise<Cliente> {
    const query = "SELECT * FROM clientes WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      throw new Error("Cliente no encontrado");
    }

    return this.mapRowToCliente(result.rows[0]);
  }

  /**
   * Obtiene todos los clientes del sistema.
   * @returns Promise<Cliente[]> - Array de todos los clientes.
   */
  async findAll(): Promise<Cliente[]> {
    const query = "SELECT * FROM clientes";
    const result = await pool.query(query);
    return result.rows.map((row: any) => this.mapRowToCliente(row));
  }

  /**
   * Guarda un nuevo cliente en la base de datos.
   * @param cliente - Objeto Cliente a guardar.
   * @returns Promise<void> - No retorna valor.
   */
  async save(cliente: Cliente): Promise<Cliente> {
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

    const result = await pool.query(query, values);
    return this.mapRowToCliente(result.rows[0]);
  }

  /**
   * Actualiza los datos de un cliente existente.
   * @param cliente - Objeto Cliente con los datos actualizados.
   * @returns Promise<void> - No retorna valor.
   */
  async update(cliente: Cliente): Promise<Cliente> {
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

    const result = await pool.query(query, values);
    return this.mapRowToCliente(result.rows[0]);
  }

  /**
   * Elimina un cliente por su ID.
   * @param id - ID del cliente a eliminar.
   * @returns Promise<void> - No retorna valor.
   */
  async delete(id: number): Promise<void> {
    const query = "DELETE FROM clientes WHERE id = $1";
    await pool.query(query, [id]);
  }
  /*
   * Obtiene un cliente por ID con verificación de pertenencia al comerciante
   * @param id - ID del cliente
   * @param comercianteId - ID del comerciante
   * @returns Promise<Cliente> - El cliente si existe y pertenece al comerciante
   */
  async findByIdWithComercianteCheck(
    id: number,
    comercianteId: number
  ): Promise<Cliente> {
    const query = `
            SELECT c.* 
            FROM clientes c
            INNER JOIN solicitudes_iniciales si ON c.id = si.cliente_id
            WHERE c.id = $1 AND si.comerciante_id = $2
        `;

    const result = await pool.query(query, [id, comercianteId]);

    if (result.rows.length === 0) {
      throw new Error("Cliente no encontrado o no pertenece al comerciante");
    }

    return this.mapRowToCliente(result.rows[0]);
  }
}
