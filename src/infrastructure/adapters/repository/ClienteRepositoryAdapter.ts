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
            row.cuil || '',
            row.telefono,
            row.email,
            row.fecha_nacimiento ? new Date(row.fecha_nacimiento) : null,
            row.domicilio,
            row.datos_empleador,
            row.acepta_tarjeta,
            row.fecha_creacion ? new Date(row.fecha_creacion) : new Date(),
            0 // comercianteId no está en la tabla clientes
        );
    }

    /**
     * Obtiene un cliente por su ID.
     * @param id - ID del cliente a buscar.
     * @returns Promise<Cliente> - El cliente encontrado.
     * @throws Error si el cliente no existe.
     */
    async findById(id: number): Promise<Cliente> {
        const query = 'SELECT * FROM clientes WHERE id = $1';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            throw new Error('Cliente no encontrado');
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
        const query = 'SELECT * FROM clientes WHERE dni = $1';
        const result = await pool.query(query, [dni]);
        
        if (result.rows.length === 0) {
            throw new Error('Cliente no encontrado');
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
        const query = 'SELECT * FROM clientes WHERE cuil = $1';
        const result = await pool.query(query, [cuil]);
        
        if (result.rows.length === 0) {
            throw new Error('Cliente no encontrado');
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
        const query = 'SELECT * FROM clientes WHERE email = $1';
        const result = await pool.query(query, [email]);
        
        if (result.rows.length === 0) {
            throw new Error('Cliente no encontrado');
        }
        
        return this.mapRowToCliente(result.rows[0]);
    }

    /**
     * Obtiene todos los clientes del sistema.
     * @returns Promise<Cliente[]> - Array de todos los clientes.
     */
    async findAll(): Promise<Cliente[]> {
        const query = 'SELECT * FROM clientes';
        const result = await pool.query(query);
        return result.rows.map((row: any) => this.mapRowToCliente(row));
    }

    /**
     * Guarda un nuevo cliente en la base de datos.
     * @param cliente - Objeto Cliente a guardar.
     * @returns Promise<void> - No retorna valor.
     */
    async save(cliente: Cliente): Promise<void> {
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
        
        await pool.query(query, values);
    }

    /**
     * Actualiza los datos de un cliente existente.
     * @param cliente - Objeto Cliente con los datos actualizados.
     * @returns Promise<void> - No retorna valor.
     */
    async update(cliente: Cliente): Promise<void> {
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
        
        await pool.query(query, values);
    }

    /**
     * Elimina un cliente por su ID.
     * @param id - ID del cliente a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    async delete(id: number): Promise<void> {
        const query = 'DELETE FROM clientes WHERE id = $1';
        await pool.query(query, [id]);
    }
}
