"use strict";
//src/infraestructure/adapters/repository/UsuarioRepositoryAdapter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepositoryAdapter = void 0;
/**
 * Adaptador del repositorio de usuarios que implementa las operaciones de persistencia.
 * Proporciona métodos para crear, leer, actualizar y eliminar usuarios del sistema,
 * así como búsquedas por diferentes criterios como email y rol.
 */
class UsuarioRepositoryAdapter {
    /**
     * Guarda un nuevo usuario en la base de datos.
     * @param usuario - Objeto Usuario a guardar en el sistema.
     * @returns Promise<Usuario> - El usuario guardado con su ID asignado.
     */
    saveUsuario(usuario) {
        throw new Error("Method not implemented.");
    }
    /**
     * Obtiene un usuario por su ID único.
     * @param id - ID numérico del usuario a buscar.
     * @returns Promise<Usuario | null> - El usuario encontrado o null si no existe.
     */
    getUsuarioById(id) {
        throw new Error("Method not implemented.");
    }
    /**
     * Actualiza los datos de un usuario existente en la base de datos.
     * @param usuario - Objeto Usuario con los datos actualizados.
     * @returns Promise<Usuario> - El usuario actualizado.
     */
    updateUsuario(usuario) {
        throw new Error("Method not implemented.");
    }
    /**
     * Elimina un usuario del sistema por su ID.
     * @param id - ID del usuario a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    deleteUsuario(id) {
        throw new Error("Method not implemented.");
    }
    /**
     * Obtiene todos los usuarios registrados en el sistema.
     * @returns Promise<Usuario[]> - Array con todos los usuarios del sistema.
     */
    getAllUsuarios() {
        throw new Error("Method not implemented.");
    }
    /**
     * Obtiene todos los usuarios que coinciden con un email específico.
     * @param email - Dirección de email a buscar.
     * @returns Promise<Usuario[]> - Array de usuarios con el email especificado.
     */
    getUsuariosByEmail(email) {
        throw new Error("Method not implemented.");
    }
    /**
     * Obtiene un usuario específico por su dirección de email.
     * @param email - Dirección de email del usuario a buscar.
     * @returns Promise<Usuario | null> - El usuario encontrado o null si no existe.
     */
    getUsuarioByEmail(email) {
        throw new Error("Method not implemented.");
    }
    /**
     * Obtiene todos los usuarios que tienen un rol específico.
     * @param rol - Rol de usuario a buscar (ej: 'admin', 'user', 'analista').
     * @returns Promise<Usuario[]> - Array de usuarios con el rol especificado.
     */
    getUsuariosByRol(rol) {
        throw new Error("Method not implemented.");
    }
}
exports.UsuarioRepositoryAdapter = UsuarioRepositoryAdapter;
