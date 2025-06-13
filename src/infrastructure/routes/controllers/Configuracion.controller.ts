// src/infrastructure/routes/controllers/Configuracion.controller.ts
import { Request, Response } from 'express';
import { GetConfUseCase } from '../../../application/use-cases/Configuraciones/GetConfUseCase';
import { UpdateConfUseCase } from '../../../application/use-cases/Configuraciones/UpdateConfUseCase';
import { CreateConfUseCase } from '../../../application/use-cases/Configuraciones/CreateConfUseCase';
import { ConfiguracionRepositoryAdapter } from '../../adapters/repository/ConfiguracionRepositoryAdapter';
import { Configuracion } from '../../../domain/entities/Configuracion';

const configuracionRepository = new ConfiguracionRepositoryAdapter();

export const getConfiguracion = async (req: Request, res: Response) => {
    try {
        const useCase = new GetConfUseCase(configuracionRepository);
        const configuraciones = await useCase.execute();
        res.status(200).json(configuraciones.map(conf => conf.toPlainObject()));
    } catch (error: any) {
        console.error('Error al obtener configuración:', error);
        res.status(500).json({ error: 'Error al obtener configuración' });
    }
};

export const updateConfiguracion = async (req: Request, res: Response) => {
    try {
        const { clave, valor } = req.body;
        
        if (!clave || valor === undefined) {
            return res.status(400).json({ error: "Clave y valor son obligatorios" });
        }
        
        const useCase = new UpdateConfUseCase(configuracionRepository);
        const configuracionActualizada = await useCase.execute(clave, valor);
        
        res.status(200).json({ mensaje: "Configuración Actualizada" });
    } catch (error: any) {
        console.error('Error al actualizar configuración:', error);
        
        if (error.message.startsWith('Configuración con clave')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error al actualizar configuración' });
        }
    }
};

export const createConfiguracion = async (req: Request, res: Response) => {
    try {
        const { clave, valor, descripcion } = req.body;
        
        if (!clave || valor === undefined) {
            return res.status(400).json({ error: "Clave y valor son obligatorios" });
        }
        
        const nuevaConfig = new Configuracion(clave, valor, descripcion);
        const useCase = new CreateConfUseCase(configuracionRepository);
        const configuracionCreada = await useCase.execute(nuevaConfig);
        
        res.status(201).json(configuracionCreada.toPlainObject());
    } catch (error: any) {
        console.error('Error al crear configuración:', error);
        
        if (error.message.includes('duplicate key value')) {
            res.status(409).json({ error: 'La clave ya existe' });
        } else {
            res.status(500).json({ error: 'Error al crear configuración' });
        }
    }
};