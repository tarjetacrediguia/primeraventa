// src/application/ports/PermisoRepositoryPort.ts
import { Permiso } from "../../domain/entities/Permiso";
import { Usuario } from "../../domain/entities/Usuario";

export interface PermisoRepositoryPort {
    // Obtener todos los permisos disponibles en el sistema
    getAllPermisos(): Promise<Permiso[]>;
    
    // Asignar permisos a un usuario
    asignarPermisos(
        usuarioId: number,
        permisos: string[]
    ): Promise<Usuario>;
    
    // Crear un nuevo permiso en el sistema
    crearPermiso(
        nombre: string,
        descripcion: string
    ): Promise<Permiso>;
    
    // Verificar si un usuario tiene un permiso específico
    usuarioTienePermiso(
        usuarioId: number,
        permiso: string
    ): Promise<boolean>;
    
    // Obtener permisos de un usuario específico
    getPermisosUsuario(usuarioId: number): Promise<Permiso[]>;
    
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
    ): Promise<Permiso>;

    asignarPermisosARol(
        rol: string,
        permisos: string[]
    ): Promise<void>;
}