// src/application/ports/PermisoRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Permisos
 *
 * Este módulo define la interfaz para el puerto de repositorio de permisos que permite
 * gestionar las operaciones de persistencia y asignación de permisos en el sistema.
 *
 * RESPONSABILIDADES:
 * - Gestionar la persistencia de permisos
 * - Manejar la asignación de permisos a usuarios y roles
 * - Proporcionar métodos de consulta de permisos
 * - Verificar permisos de usuarios
 */

import { Permiso } from "../../domain/entities/Permiso";
import { Usuario } from "../../domain/entities/Usuario";

/**
 * Puerto para operaciones de repositorio de permisos.
 *
 * Esta interfaz define los métodos necesarios para gestionar la persistencia
 * y asignación de permisos en el sistema.
 */
export interface PermisoRepositoryPort {
    /**
     * Obtiene todos los permisos disponibles en el sistema.
     *
     * @returns Promise<Permiso[]> - Listado de todos los permisos
     */
    getAllPermisos(): Promise<Permiso[]>;
    
    /**
     * Asigna permisos a un usuario específico.
     *
     * @param usuarioId - ID del usuario
     * @param permisos - Lista de nombres de permisos a asignar
     * @returns Promise<Usuario> - Usuario con permisos actualizados
     * @throws Error si el usuario no existe o los permisos son inválidos
     */
    asignarPermisos(
        usuarioId: number,
        permisos: string[]
    ): Promise<Usuario>;
    
    /**
     * Crea un nuevo permiso en el sistema.
     *
     * @param nombre - Nombre del permiso
     * @param descripcion - Descripción del permiso
     * @returns Promise<Permiso> - Permiso creado
     * @throws Error si el permiso ya existe o los datos son inválidos
     */
    crearPermiso(
        nombre: string,
        descripcion: string
    ): Promise<Permiso>;
    
    /**
     * Verifica si un usuario tiene un permiso específico.
     *
     * @param usuarioId - ID del usuario
     * @param permiso - Nombre del permiso a verificar
     * @returns Promise<boolean> - true si el usuario tiene el permiso, false en caso contrario
     */
    usuarioTienePermiso(
        usuarioId: number,
        permiso: string
    ): Promise<boolean>;
    
    /**
     * Obtiene todos los permisos de un usuario específico.
     *
     * @param usuarioId - ID del usuario
     * @returns Promise<Permiso[]> - Listado de permisos del usuario
     * @throws Error si el usuario no existe
     */
    getPermisosUsuario(usuarioId: number): Promise<Permiso[]>;
    
    /**
     * Obtiene todos los usuarios que tienen un permiso específico.
     *
     * @param permiso - Nombre del permiso
     * @returns Promise<Usuario[]> - Listado de usuarios con ese permiso
     */
    getUsuariosConPermiso(permiso: string): Promise<Usuario[]>;
    
    /**
     * Obtiene los detalles de un permiso específico.
     *
     * @param permiso - Nombre del permiso
     * @returns Promise<{ nombre: string; descripcion: string; categoria: string; fechaCreacion: Date; } | null> - Detalles del permiso o null si no existe
     */
    getPermisoDetalle(permiso: string): Promise<{
        nombre: string;
        descripcion: string;
        categoria: string;
        fechaCreacion: Date;
    } | null>;
    
    /**
     * Actualiza la descripción de un permiso existente.
     *
     * @param permiso - Nombre del permiso a actualizar
     * @param nuevaDescripcion - Nueva descripción del permiso
     * @returns Promise<Permiso> - Permiso actualizado
     * @throws Error si el permiso no existe
     */
    actualizarPermiso(
        permiso: string,
        nuevaDescripcion: string
    ): Promise<Permiso>;

    /**
     * Asigna permisos a un rol específico.
     *
     * @param rol - Nombre del rol
     * @param permisos - Lista de nombres de permisos a asignar al rol
     * @returns Promise<void>
     * @throws Error si el rol no existe o los permisos son inválidos
     */
    asignarPermisosARol(
        rol: string,
        permisos: string[]
    ): Promise<void>;
}
