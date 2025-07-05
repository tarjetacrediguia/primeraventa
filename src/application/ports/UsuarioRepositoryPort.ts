// src/application/ports/UsuarioRepository.ts

/**
 * MÓDULO: Puerto de Repositorio de Usuarios
 *
 * Este módulo define la interfaz para el puerto de repositorio de usuarios que permite
 * gestionar las operaciones de persistencia de usuarios en el sistema.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de usuarios
 * - Proporcionar métodos de consulta por diferentes criterios
 * - Manejar operaciones CRUD de usuarios
 */

import { Usuario } from "../../domain/entities/Usuario";

/**
 * Puerto para operaciones de repositorio de usuarios.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y consulta de usuarios en el sistema.
 */
export interface UsuarioRepositoryPort {
    /**
     * Guarda un nuevo usuario en el repositorio.
     *
     * @param usuario - Usuario a guardar
     * @returns Promise<Usuario> - Usuario guardado con ID asignado
     * @throws Error si el usuario ya existe o los datos son inválidos
     */
    saveUsuario(usuario: Usuario): Promise<Usuario>;

    /**
     * Obtiene un usuario por su identificador único.
     *
     * @param id - ID del usuario
     * @returns Promise<Usuario | null> - Usuario encontrado o null si no existe
     */
    getUsuarioById(id: number): Promise<Usuario | null>;

    /**
     * Actualiza los datos de un usuario existente.
     *
     * @param usuario - Usuario con datos actualizados
     * @returns Promise<Usuario> - Usuario actualizado
     * @throws Error si el usuario no existe
     */
    updateUsuario(usuario: Usuario): Promise<Usuario>;

    /**
     * Elimina un usuario del repositorio.
     *
     * @param id - ID del usuario a eliminar
     * @returns Promise<void>
     * @throws Error si el usuario no existe
     */
    deleteUsuario(id: number): Promise<void>;

    /**
     * Obtiene todos los usuarios registrados.
     *
     * @returns Promise<Usuario[]> - Listado de todos los usuarios
     */
    getAllUsuarios(): Promise<Usuario[]>;

    /**
     * Obtiene usuarios por su correo electrónico.
     *
     * @param email - Correo electrónico a buscar
     * @returns Promise<Usuario[]> - Listado de usuarios con ese email
     */
    getUsuariosByEmail(email: string): Promise<Usuario[]>;

    /**
     * Obtiene un usuario específico por su correo electrónico.
     *
     * @param email - Correo electrónico del usuario
     * @returns Promise<Usuario | null> - Usuario encontrado o null si no existe
     */
    getUsuarioByEmail(email: string): Promise<Usuario | null>;

    /**
     * Obtiene usuarios por su rol en el sistema.
     *
     * @param rol - Rol de los usuarios a buscar
     * @returns Promise<Usuario[]> - Listado de usuarios con ese rol
     */
    getUsuariosByRol(rol: string): Promise<Usuario[]>;
}
