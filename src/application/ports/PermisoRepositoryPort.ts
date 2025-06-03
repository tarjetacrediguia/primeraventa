// src/application/ports/PermisoRepositoryPort.ts
import { Usuario } from "../../domain/entities/Usuario";

export interface PermisoRepositoryPort {
    // Obtener todos los permisos disponibles en el sistema
    getAllPermisos(): Promise<string[]>;
    
    // Asignar permisos a un usuario
    asignarPermisos(
        usuarioId: string,
        permisos: string[]
    ): Promise<Usuario>;
    
    // Crear un nuevo permiso en el sistema
    crearPermiso(
        nombre: string,
        descripcion: string,
        categoria: string
    ): Promise<string>;
    
    // Verificar si un usuario tiene un permiso específico
    usuarioTienePermiso(
        usuarioId: string,
        permiso: string
    ): Promise<boolean>;
    
    // Obtener permisos de un usuario específico
    getPermisosUsuario(usuarioId: string): Promise<string[]>;
    
    // Obtener todos los usuarios con un permiso específico
    getUsuariosConPermiso(permiso: string): Promise<Usuario[]>;
    
    // Obtener detalles de un permiso
    getPermisoDetalle(permiso: string): Promise<{
        nombre: string;
        descripcion: string;
        categoria: string;
        fechaCreacion: Date;
    } | null>;
    
    // Actualizar descripción de un permiso
    actualizarPermiso(
        permiso: string,
        nuevaDescripcion: string
    ): Promise<void>;
}