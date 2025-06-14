// src/infrastructure/routes/controllers/Permisos.controller.ts
import { Request, Response } from 'express';
import { PermisoRepositoryAdapter } from '../../adapters/repository/PermisoRepositoryAdapter';
import { CreatePermisoUseCase } from '../../../application/use-cases/Permisos/CreatePermisoUseCase';
import { ListPermisosUseCase } from '../../../application/use-cases/Permisos/ListPermisosUseCase';
import { AsignarPermisosRolUseCase } from '../../../application/use-cases/Permisos/AsignarPermisosRolUseCase';
import { AsignarPermisoUseCase } from '../../../application/use-cases/Permisos/AsignarPermisoUseCase';

const permisoRepository = new PermisoRepositoryAdapter();

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

export const asignarPermisosARol = async (req: Request, res: Response) => {
    try {
        const rol = req.params.rol;
        const { permisos } = req.body;

        if (!permisos || !Array.isArray(permisos)) {
            return res.status(400).json({ error: 'Se esperaba un arreglo de permisos' });
        }
        console.log('Rol:', rol);
        console.log('Permisos:', permisos);
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