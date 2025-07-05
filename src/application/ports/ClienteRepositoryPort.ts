// src/application/ports/ClienteRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Clientes
 *
 * Este módulo define la interfaz para el puerto de repositorio de clientes que permite
 * gestionar las operaciones de persistencia de clientes en el sistema.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de clientes
 * - Proporcionar métodos de consulta por diferentes criterios
 * - Manejar operaciones CRUD de clientes
 */

import { Cliente } from "../../domain/entities/Cliente";

/**
 * Puerto para operaciones de repositorio de clientes.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y consulta de clientes en el sistema.
 */
export interface ClienteRepositoryPort {
    /**
     * Busca un cliente por su identificador único.
     *
     * @param id - ID del cliente
     * @returns Promise<Cliente> - Cliente encontrado
     * @throws Error si el cliente no existe
     */
    findById(id: number): Promise<Cliente>;

    /**
     * Busca un cliente por su DNI.
     *
     * @param dni - DNI del cliente
     * @returns Promise<Cliente> - Cliente encontrado
     * @throws Error si el cliente no existe
     */
    findByDni(dni: string): Promise<Cliente>;

    /**
     * Busca un cliente por su CUIL.
     *
     * @param cuil - CUIL del cliente
     * @returns Promise<Cliente> - Cliente encontrado
     * @throws Error si el cliente no existe
     */
    findByCuil(cuil: string): Promise<Cliente>;

    /**
     * Busca un cliente por su correo electrónico.
     *
     * @param email - Correo electrónico del cliente
     * @returns Promise<Cliente> - Cliente encontrado
     * @throws Error si el cliente no existe
     */
    findByEmail(email: string): Promise<Cliente>;

    /**
     * Obtiene todos los clientes registrados.
     *
     * @returns Promise<Cliente[]> - Listado de todos los clientes
     */
    findAll(): Promise<Cliente[]>;

    /**
     * Guarda un nuevo cliente en el repositorio.
     *
     * @param cliente - Cliente a guardar
     * @returns Promise<void>
     * @throws Error si el cliente ya existe o los datos son inválidos
     */
    save(cliente: Cliente): Promise<void>;

    /**
     * Actualiza los datos de un cliente existente.
     *
     * @param cliente - Cliente con datos actualizados
     * @returns Promise<void>
     * @throws Error si el cliente no existe
     */
    update(cliente: Cliente): Promise<void>;

    /**
     * Elimina un cliente del repositorio.
     *
     * @param id - ID del cliente a eliminar
     * @returns Promise<void>
     * @throws Error si el cliente no existe
     */
    delete(id: number): Promise<void>;
}
