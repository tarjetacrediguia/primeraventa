// src/infrastructure/routes/controllers/Permisos.controller.ts

/**
 * CONTROLADOR: Permisos
 *
 * Este archivo contiene los controladores para la gestión de permisos y asignación de permisos a roles y usuarios.
 * Permite crear, listar, asignar y verificar permisos en el sistema.
 * Cada función está diseñada para ser utilizada como handler de rutas Express.
 */
import { Request, Response } from 'express';
import { PermisoRepositoryAdapter } from '../../adapters/repository/PermisoRepositoryAdapter';
import { CreatePermisoUseCase } from '../../../application/use-cases/Permisos/CreatePermisoUseCase';
import { ListPermisosUseCase } from '../../../application/use-cases/Permisos/ListPermisosUseCase';
import { AsignarPermisosRolUseCase } from '../../../application/use-cases/Permisos/AsignarPermisosRolUseCase';
import { AsignarPermisoUseCase } from '../../../application/use-cases/Permisos/AsignarPermisoUseCase';
import { VerificarPermisoUseCase } from '../../../application/use-cases/Permisos/VerificarPermisoUseCase';
import { ObtenerPermisosUsuarioUseCase } from '../../../application/use-cases/Permisos/ObtenerPermisosUsuarioUseCase';

const permisoRepository = new PermisoRepositoryAdapter();

/**
 * Crea un nuevo permiso en el sistema.
 * @param req - Request de Express con los datos del permiso en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve el permiso creado o un error en caso de fallo.
 */
export const crearPermiso = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion } = req.body;
        
        if (!nombre || !descripcion) {
            return res.status(400).json({ error: 'Nombre y descripción son obligatorios' });
        }

        const useCase = new CreatePermisoUseCase(permisoRepository);
        const permiso = await useCase.execute(nombre, descripcion);
        
        res.status(201).json(permiso.toPlainObject());
    } catch (error: any) {
        console.error('Error al crear permiso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

/**
 * Lista todos los permisos registrados en el sistema.
 * @param req - Request de Express.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de permisos o un error en caso de fallo.
 */
export const listarPermisos = async (req: Request, res: Response) => {
    try {
        const useCase = new ListPermisosUseCase(permisoRepository);
        const permisos = await useCase.execute();
        
        res.status(200).json(permisos.map(permiso => permiso.toPlainObject()));
    } catch (error) {
        console.error('Error al listar permisos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

/**
 * Asigna permisos a un rol específico.
 * @param req - Request de Express con el nombre del rol en params y los permisos en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un mensaje de éxito o un error en caso de fallo.
 */
export const asignarPermisosARol = async (req: Request, res: Response) => {
    try {
        const rol = req.params.rol;
        const { permisos } = req.body;

        if (!permisos || !Array.isArray(permisos)) {
            return res.status(400).json({ error: 'Se esperaba un arreglo de permisos' });
        }
        const useCase = new AsignarPermisosRolUseCase(permisoRepository);
        await useCase.execute(rol, permisos);

        res.status(200).json({ message: 'Permisos asignados correctamente al rol' });
    } catch (error: any) {
        if (error.message.includes('Rol inválido') || 
            error.message.includes('Permisos inválidos')) {
            res.status(400).json({ error: error.message });
        } 
        else if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
        } 
        else {
            console.error('Error al asignar permisos al rol:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

/**
 * Asigna permisos a un usuario específico.
 * @param req - Request de Express con el ID del usuario en params y los permisos en el body.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un mensaje de éxito o un error en caso de fallo.
 */
export const asignarPermisosAUsuario = async (req: Request, res: Response) => {
    try {
        const usuarioId = parseInt(req.params.id, 10);
        const { permisos } = req.body;

        if (!permisos || !Array.isArray(permisos)) {
            return res.status(400).json({ error: 'Se esperaba un arreglo de permisos' });
        }

        if (isNaN(usuarioId)) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }

        // Transformar permisos a array de strings si vienen como objetos
        const nombresPermisos = permisos.map(p => 
            typeof p === 'string' ? p : p.nombre
        );

        const useCase = new AsignarPermisoUseCase(permisoRepository);
        const usuario = await useCase.execute(usuarioId, nombresPermisos);

        res.status(200).json({ message: 'Permisos asignados correctamente al usuario' });
    } catch (error: any) {
        if (error.message === 'Usuario no encontrado') {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('Permisos inválidos')) {
            res.status(400).json({ error: error.message });
        } else {
            console.error('Error al asignar permisos al usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

/**
 * Obtiene los permisos de un usuario específico.
 * @param req - Request de Express con el ID del usuario en params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de permisos o un error en caso de fallo.
 */
export const obtenerPermisosUsuario = async (req: Request, res: Response) => {
    try {
        const usuarioId = parseInt(req.params.id, 10);
        
        if (isNaN(usuarioId)) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }

        const useCase = new ObtenerPermisosUsuarioUseCase(permisoRepository);
        const permisos = await useCase.execute(usuarioId);
        
        res.status(200).json(permisos.map(permiso => permiso.toPlainObject()));
    } catch (error: any) {
        if (error.message === "Usuario no encontrado") {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Error al obtener permisos del usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

/**
 * Verifica si un usuario tiene un permiso específico.
 * @param req - Request de Express con el ID del usuario en params y el nombre del permiso en query params.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un booleano indicando si el usuario tiene el permiso o un error en caso de fallo.
 */
export const verificarPermisoUsuario = async (req: Request, res: Response) => {
    try {
        const usuarioId = parseInt(req.params.id, 10);
        const permiso = req.query.permiso as string;  // Se obtiene de query params
        
        if (isNaN(usuarioId)) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }
        if (!permiso) {
            return res.status(400).json({ error: 'Nombre de permiso requerido' });
        }

        const useCase = new VerificarPermisoUseCase(permisoRepository);
        const tienePermiso = await useCase.execute(usuarioId, permiso);
        
        res.status(200).json({ tienePermiso });
    } catch (error: any) {
        if (error.message === "Usuario no encontrado") {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Error al verificar permiso:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};
